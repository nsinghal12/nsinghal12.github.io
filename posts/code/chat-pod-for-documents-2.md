---
title: Building a chatpod for documents
path: /code/chat-pod-for-documents-2
date: 14-Aug-2023
category: code
tags:
- code
- nodejs
---

In my previous post, I explored the overall approach on how to create
a chatpod on a given set of documents, and the concept of text embeddings
and vector databases. In this post we will explore the code around the same.

Let's start building a pod for a file called `state-of-the-union.txt` - the
[Remarks of US President Joe Biden - State of the Union Address](https://www.whitehouse.gov/briefing-room/speeches-remarks/2022/03/01/remarks-of-president-joe-biden-state-of-the-union-address-as-delivered).

First, we declare the basic imports to read a file from disk, and a simple
`crypto` engine that will allow us to generate UUID `string`s.

```typescript
const fs = require('fs');
const crypto = require('crypto');
```

Next, for generating text embeddings as well as for generating answers from
selected text, we will use OpenAI GPT. Thus, let's initialize its client:

```typescript
// initialize OpenAI client
// this will be used to talk to OpenAI API
const { OpenAIApi } = require("openai");

const openAiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(openAiApiKey);
```

As noted earlier, we also need a vector store that will be able to store
all vectors for us. It will also run a similarity search and retrieve top
matching query for us:

```typescript
// initialize pinecone client
// this will be used to talk to pinecone API
const pinecone = require("pinecone");

const pineConeApiKey = process.env.PINECONE_API_KEY;
const pineconeClient = new pinecone.Client(pineConeApiKey);

const indexName = "my-index";
const namespace = "default";
```

The next ideal step is to generate embeddings. But, before we do that let's take
a look at our simple code to chunk string into approx 1000 words. This is required
to reduce the text content into a length less than what OpenAI allows.

```typescript
function splitTextIntoApproxThousandWords(text: string): string[] {
    const words = text.split(' ');

    const chunks: string[] = [];
    let chunk: string = '';
    for (let index = 0; index < words.length; index++) {
        const word = words[index];
        if (chunk.length + word.length >= 1000) {
            chunks.push(chunk);
            chunk = '';
        }

        chunk += word + ' ';
    }

    return chunks;
}
```

Now, is the time to write our `ingestFile` function. The goal of the function is
to take a simple text file from disk, read the contents, chunk, create embeddings
and then push these embeddings to our vector database (pinecone, in our case).

```typescript
// this method ingests a file into pinecone database
// so that its text is available for any future search
async function ingestFile(filePath: string): Promise<void> {
    // first read the text of the file
    const fileContents: string = await fs.readFileSync(filePath, 'utf8') || '';

    // once we have read the contents, we will chunk it out into smaller chunks
    // of say 1000 words each.
    const chunks: string[] = splitTextIntoApproxThousandWords(fileContents);

    // once we have the chunks we need to find their text embeddings
    // let's use OpenAI for the same. We then push the vector into
    // our pincone database
    for (let index = 0; index < chunks.length; index++) {
        // first invoke API to get embeddings
        const embeddingResponse = await openai.embeddings({
            text: chunks[index],
        });

        // extract embeddings
        const embedding = embeddingResponse.embeddings;
    
        // create the vector object
        const vector = {
            id: crypto.randomUUID(),
            vector: embedding,
            metadata: {
                text: chunks[index],
            }
        };

        // create a query for adding this vector to pinecone
        const upsertRequest = {
            vectors: [vector],
            namespace,
        };

        // fire pinecone query
        const pineConeResponse = await pineconeClient.upsert(indexName, upsertRequest);
        // (skipping error handling for brevity)
    }
}
```

Now, that we can use `ingestFile` function to add as many files are we desire
into our vector database. This becomes our **search corpus**. This corpus shall now
be used to answer queries via LLM. 

So first, for any given user query, let's find the top-most search hit from
our vector database. Because, we our ingesting a few files, let's only that the top
most hit and not worry about match score here. In a real world, they shall be
considerations too.

```typescript
async function search(query: string): Promise<string> {
    const searchRequest = {
        query: query,
        top: 1,
        filters: {},
        namespace,
    };

    const searchResponse = await pineconeClient.search(indexName, searchRequest);
    const topResult = searchResponse.hits[0];
    return topResult.metadata.text;
}
```

Once, we have the content where our question may lie, the only remaining aspect is
to generate a perfect `prompt` with the user's query, the just search text chunk
and OpenAI LLM. Below is the code for it:

```typescript
async function generateLLMResponse(prompt: string): Promise<string> {
    const response = await openai.complete({
        engine: 'gpt3-turbo',
        prompt: prompt,
        maxTokens: 8000,
        temperature: 0, // temperature is zero because we want the model to be deterministic
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
    });

    return response.choices[0].text;
}
```

And we are done. Let's write a simple driver code that shall help us answer
a simple query, `Who is Ms Jackson?` based on the state of the union address.

```typescript
async function main() {
    // ingest the file
    await ingestFile('state-of-the-union.txt');

    // search for a query
    const query = 'Who is Ms Jackson?';
    const textChunk = await search(query);

    const prompt = `
    Answer the following user question in the context of text supplied below. 
    Do not use any other information to answer. 
    If you do not know the answer simply say, "Sorry, don't know.".
    User query is: "${query}".
    Text to use to answer the question: "${textChunk}".
    `;

    const response = await generateLLMResponse(prompt);
    console.log(response);

    // answer received:
    // Ms Ketanji Brown Jackson is Circuit Court of Appeals Judge, One of our nation’s top legal minds ,nominated by President Biden.
}
```

I hope the above helps explain how to build a simple document chatbot in NodeJS.

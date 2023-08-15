---
title: Building a chatpod for documents
path: /code/chat-pod-for-documents
date: 13-Aug-2023
category: code
tags:
- code
- nodejs
---

Recently there has been a surge in sites that leverage LLMs (large language models)
and allow to run simple Q&A pods over a given set of documents. I found this very
interesting and thought of learning how to build one. This post explores the methodology
for the same.

## TL;DR

The process to build one is simple:

* Get a set of documents (PDFs, Word documents, text files etc)
* Extract text from these documents
* Chunk the text from each file into smaller chunks (say 1000 words)
* Create an embedding for each chunk
* Store this embedding along with chunk in a vector database
* Now, ask the user to provide a question
* Again, create an embedding of the question
* Run a vector-similarity search of this question against the vector database
* Retrieve top 3 results from vector database where match < 0.9
* Now create a prompt for LLM using the user's question and 3 chunks
* Fire this prompt on LLM
* Serve the reply received from LLM to the user

Now, let's explore each of the above step in detail. 

### What are text embeddings?

Text embeddings in LLM are a type of machine learning model that represent text as vectors of numbers.
In developer's language an array of `float`s. 

```javascript
const vector = [ 0.3, 0.4, 0.5 ]; // an array of floating point numbers
```

These vectors capture the meaning and context of the text, and can be used for a variety of tasks, 
such as text classification, natural language inference, and question answering. To create text embeddings, 
a large language model (LLM) is trained on a massive dataset of text. The LLM learns to associate each 
word or phrase with a vector of numbers. These vectors represent the meaning and context of the word 
or phrase, and can be used to compare different pieces of text.

Text embeddings are useful for a variety of tasks, including:

* **Text classification**: Text embeddings can be used to classify text into different categories, such 
as news, opinion, or tutorial. This can help readers to find the content that they are looking for more 
easily.

* **Natural language inference**: Text embeddings can be used to determine the relationship between two 
sentences. This can be used to improve the accuracy of machine translation, question answering, and other 
natural language processing tasks.

* **Question answering**: Text embeddings can be used to identify the key concepts in a question, and to 
retrieve the most relevant information from a document. This can help to improve the accuracy of question 
answering systems.

* **Semantic search**: Text embeddings can be used to search for documents that are semantically similar 
to a given query. This can be used to improve the relevance of search results.

* **Personalization**: Text embeddings can be used to track the interests of a user and to recommend 
relevant content. This can help users to find the content that they are most likely to be interested in.

### What are vector databases ?

Vector databases are a type of database that are specifically designed to store and query vectors. Vectors 
are data structures that represent points in a high-dimensional space. They are often used to represent 
the embeddings of text, images, and other data.

Vector databases offer a number of advantages over traditional databases for storing and querying vectors. They are:

* **Faster**: Vector databases can perform vector operations, such as similarity search, much faster than 
traditional databases. This is because they are specifically designed to optimize for these types of operations.
* **Scalable**: Vector databases can scale to large datasets of vectors. This is because they use distributed 
storage and parallel processing techniques.
* **Flexible**: Vector databases can store and query different types of vectors. This makes them a good 
choice for a variety of applications.

[Milvus](https://milvus.io), [Zilliz](https://zilliz.com/) and [Pinecone](https://www.pinecone.io) are 
some popular vector databases. Milvus is a self-hosted database, while Pinecone is a managed service. 
Milvus is known for its performance, while Pinecone is known for its ease of use.

### Summary

We have outlined the approach on how to build a chat-pod for documents and explored the key concepts
of text embeddings and a vector database. In the next post of this series, I will demonstrate the 
code for the above approach.

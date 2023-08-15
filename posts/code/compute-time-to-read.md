---
title: Computing time to read for my blog
path: /code/compute-time-to-read
date: 6-Aug-2023
category: code
tags:
- code
- nodejs
---

This week I have started my exercise to rebuild my [website](https://nitisinghal.com) 
using [ReactJS](https://react.dev). This allows me the opportunity to use my skills for
my own use. One of the things that I have been interested is adding the **time to read** 
value for my readers. This shall gives a basic idea to users on what kind of time it will need.

After a couple of iterations, following is the code that I came up with:

```typescript
export default function computeWPM(text, wordsPerMinute = 238) {
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time;
}
```

The approach was simple. Divide the text into words, by splitting based on the whitespace.
Yes, the approach is naive. If words are connected by `hyphen` or there are non-word
tokens such as mathematical symbols - they are counted too. But, again this works because
the time to read is just a guidance.

I then use 200 words per minute as the speed for normal English readers. The average speed
is considered between 200-300 words per minute when reading silently. I just took the lower
one to be cautious.

Will this is code in action soon.

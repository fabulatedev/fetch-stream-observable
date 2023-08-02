# fetch-stream-observable
[![Coverage Status](https://coveralls.io/repos/github/idiomicdev/fetch-stream-observable/badge.svg?branch=main)](https://coveralls.io/github/idiomicdev/fetch-stream-observable?branch=main)
[![npm version](https://badge.fury.io/js/fetch-stream-observable.svg)](https://badge.fury.io/js/fetch-stream-observable)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fetch-stream-observable)

Fetch API which returns an [observable](https://www.npmjs.com/package/zen-observable). 

- OpenAI stream parsing supported out of the box.
- Gracefully degrades to calling `subscription` only once for non streaming response (`json` and `text` for eg).
- Typescript
- Lightweight (3.7kb min+gzip)

## Installation
```
$ npm i fetch-stream-observable
```

## Usage

```typescript
import { fetchObservable } from 'fetch-stream-observable';

fetchObservable("https://api.openai.com/v1/chat/completions", {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer <OPEN_AI_API_KEY>`,
    },
    method: "POST",
    body: JSON.stringify({
        /*
            OpenAI body payload.
        */
        // Tells openAI to send streaming response.
        stream: true, 
    }),
    // This disables automatic parsing of open ai response.
    doNotParseOpenAIStream: false, 
    // This will disable returning an additive complete response string.
    doNotConcatTextStream: false, 
})
    .subscribe((data: string) => {
        // Logs the complete string with each event, 
        // helpful with React `setState`.
        console.log(data); 
    });
```
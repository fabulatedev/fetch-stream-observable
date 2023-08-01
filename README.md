# fetch-stream-observable
[![Coverage Status](https://coveralls.io/repos/github/idiomicdev/fetch-stream-observable/badge.svg?branch=main)](https://coveralls.io/github/idiomicdev/fetch-stream-observable?branch=main)

Fetch API which returns an [observable](https://www.npmjs.com/package/zen-observable). 

- OpenAI stream parsing supported out of the box.
- Gracefully degrades to calling `subscription` only once for non streaming response (`json` and `text` for eg).
- Typescript

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
    // This enables automatic parsing of open ai response.
    parseOpenAIStream: true, 
    // This will return an additive complete response string.
    additiveTextStream: true, 
})
    .subscribe((data: string) => {
        // Logs the complete string with each event, 
        // helpful with React `setState`.
        console.log(data); 
    });
```
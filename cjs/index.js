"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchObservable = void 0;
const fetch_event_source_1 = require("@microsoft/fetch-event-source");
const zen_observable_ts_1 = require("zen-observable-ts");
function fetchObservable(url, options) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let responseTextStream = "";
    const { signal: inputSignal } = options || {};
    inputSignal?.addEventListener("abort", () => {
        abortController.abort();
    });
    return new zen_observable_ts_1.Observable(observer => {
        (0, fetch_event_source_1.fetchEventSource)(url, {
            openWhenHidden: true,
            ...options,
            signal,
            headers: {
                "Accept": "*/*",
                ...options?.headers,
            },
            onmessage: (ev) => {
                if (options?.parseOpenAIStream) {
                    const { data } = ev;
                    const chunk = parseChunk(data);
                    responseTextStream += chunk || '';
                    (options?.additiveTextStream)
                        ? observer.next(responseTextStream)
                        : observer.next(chunk);
                }
                else {
                    observer.next(ev.data);
                }
            },
            onclose: () => {
                observer.complete();
            },
            onopen: async (resp) => {
                if (resp.status !== 200) {
                    observer.error(resp.statusText);
                    observer.complete();
                    abortController.abort();
                    return;
                }
                const contentType = resp.headers.get("content-type");
                if (contentType !== "text/event-stream") {
                    const reader = (contentType.startsWith('application/json'))
                        ? await resp.json()
                        : await resp.text();
                    observer.next(reader);
                    observer.complete();
                    abortController.abort();
                }
            },
        });
    });
}
exports.fetchObservable = fetchObservable;
function parseChunk(chunk) {
    try {
        if (chunk === '[DONE]')
            return;
        const parsed = JSON.parse(chunk);
        const content = parsed.choices[0].delta.content;
        return content;
    }
    catch (error) {
        console.error('Could not JSON parse stream message', error);
    }
}

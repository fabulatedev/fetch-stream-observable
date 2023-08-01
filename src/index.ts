import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Observable } from "zen-observable-ts";

export interface FetchObservableOpts extends RequestInit {
    openWhenHidden?: boolean;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
    parseOpenAIStream?: boolean;
    additiveTextStream?: boolean;
}


export function fetchObservable(url: string, options?: FetchObservableOpts): Observable<string> {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let responseTextStream = "";

    const { signal: inputSignal } = options || {};
    inputSignal?.addEventListener("abort", () => {
        abortController.abort();
    });

    return new Observable<string>(observer => {

        fetchEventSource(url, {
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
                } else {
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

export default fetchObservable;

function parseChunk(chunk) {
    try {
        if (chunk === '[DONE]') return;
        const parsed = JSON.parse(chunk);
        const content = parsed.choices[0].delta.content;
        return content;
    } catch (error) {
        console.error('Could not JSON parse stream message', error);
    }
}
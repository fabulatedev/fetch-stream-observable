import { Observable } from "zen-observable-ts";
export interface FetchObservableOpts extends RequestInit {
    openWhenHidden?: boolean;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
    parseOpenAIStream?: boolean;
    additiveTextStream?: boolean;
}
export declare function fetchObservable(url: string, options?: FetchObservableOpts): Observable<string>;

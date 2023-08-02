import { fetchObservable } from "../esm";
import 'dotenv/config';

test("fetchObservable json", () => new Promise<void>(done => {
    fetchObservable("http://jsonplaceholder.typicode.com/users/1")
        .subscribe((data: any) => {
            console.log(data, typeof data);
            expect(data["id"]).toBe(1);
            done();
        })
}));

test("fetchObservable text", () => new Promise<void>(done => {
    fetchObservable("http://metaphorpsum.com/sentences/1")
        .subscribe((data: any) => {
            console.log(data, typeof data);
            expect(data.length).toBeGreaterThan(0);
            expect(typeof data).toBe("string");
            expect(data.includes('.')).toBe(true);
            done();
        })
}));

test("fetchObservable error", () => new Promise<void>(done => {
    fetchObservable("https://yesno.wtf/ap2")
        .subscribe((data: any) => {
            done();
        }, err => {
            expect(err).toBe("Not Found");
            done();
        })
}));



test("fetchObservable stream", () => new Promise<void>(done => {
    let totalLen = 0;
    fetchObservable("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify({
            messages: [{
                role: "system",
                content: "You are an helpful assistant",
            }, {
                role: "user",
                content: "Respond with hello world",
            }],
            model: 'gpt-3.5-turbo',
            temperature: 0,
            top_p: 1,
            presence_penalty: 0,
            frequency_penalty: 0,
            stream: true,
        }),
    })
        .subscribe((data: string) => {
            expect(typeof data).toBe("string");
            expect(data.length >= totalLen).toBe(true);
            totalLen = data.length;
        }, err => { }, () => done());
}));
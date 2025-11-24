export interface ChildProcessObject {
    once(e: 'exit',  c: () => void): ChildProcessObject;
    once(e: 'close', c: () => void): ChildProcessObject;
    once(e: 'error', c: (err: Error) => void): ChildProcessObject;
}
export interface ChildProcessInstance {
    on(event: 'close', callback: (___: any) => void):   void;
    on(event: 'error', callback: (err: Error) => void): void;
}

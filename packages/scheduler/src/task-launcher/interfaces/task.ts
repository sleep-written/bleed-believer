export interface Task {
    action(): Promise<void>;
}
import { State } from '../state.js';

export interface Person {
    name: string;
    age: number;
}

export class PersonState extends State<Person> {
    changeName(name: string): Promise<void> {
        return this.setState(o => ({
            ...o,
            name
        }));
    }

    changeAge(age: number): Promise<void> {
        return this.setState(o => ({
            ...o,
            age
        }));
    }
}
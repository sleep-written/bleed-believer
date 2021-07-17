import { CommandMeta } from "../command/command.meta";

export interface CommandMethodMeta {
    methods: {
        [key: string]: PropertyDescriptor;
    };
}

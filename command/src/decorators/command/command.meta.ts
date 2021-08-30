export interface CommandMeta {
    main: string[];
    title: string;
    description: string;
    methods: {
        [key: string]: PropertyDescriptor;
    };
}

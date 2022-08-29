import { State } from '../state.js';

export interface User {
    id: number;
    nick: string;
    typeId: number;
};

export interface Product {
    id?: number;
    quantity: number;
    price: number;
}

export interface Dcto {
    id: number;
    corr: number;
    products: Product[];
};

export interface Body {
    user?: User;
    contr: Partial<Dcto>;
}

export class BodyState extends State<Body> {
    setUser(user?: User): Promise<void> {
        return this.setState(input => ({
            ...input,
            user
        }));
    }

    addProductRow(index: number): Promise<void> {
        return this.setState(input => {
            const productos = input.contr.products instanceof Array
                ?   input.contr.products
                :   [];

            const part1 = productos.slice(0, index);
            const part2 = productos.slice(index);
            const item: Product = {
                quantity: 0,
                price: 0
            }

            return {
                ...input,
                contr: {
                    ...input.contr,
                    products: [
                        ...part1,
                        item,
                        ...part2,
                    ]
                }
            };
        });
    }

    updateproductRow(index: number, value: Product): Promise<void> {
        return this.setState(input => {
            const products = input.contr.products?.slice() ?? [];
            if (!products[index]) {
                throw new Error('Kill it!');
            } else {
                products[index] = { ...value };
            }

            return {
                ...input,
                contr: {
                    ...input.contr,
                    products
                }
            }
        });
    }
}
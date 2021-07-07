import { CommandOptions } from './command.options';
import { CommandType } from './command.type';

export function Command(options: CommandOptions): (obj: CommandType) => void {
    let main: string[] = [];
    if (typeof options.main === 'string') {
        // Lowercase all and converts to string[] 
        main = [ options.main.toLowerCase() ];
    } else if (options.main instanceof Array) {
        // lowercase all items
        main = options.main.map(x => x.toLowerCase());
    }
    
    return obj => {
        obj.__meta__ = {
            main,
            title: options.title,
            description: options.description ?? 'None description provided yet.'
        };
    };
}

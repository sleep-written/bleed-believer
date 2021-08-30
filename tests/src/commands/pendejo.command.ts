import { Args, Command, CommandMethod } from '@bleed-believer/command';

@Command({
    main: 'pendejo',
    title: 'Comando para pendejos'
})
export class PendejoCommand {
    @CommandMethod()
    start(args: Args) {
        console.log('Bienvenido maldito pendejo tome asiento...');
        console.log('2021 CARNAAAAAAL ESTOY AGARRANDO SEÑAL!!!');
        console.log('--key ->', args.find('key'));
    }
}

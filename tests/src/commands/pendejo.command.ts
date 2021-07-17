import { Command, CommandMethod } from 'bleed-believer';

@Command({
    main: 'pendejo',
    title: 'Comando para pendejos'
})
export class PendejoCommand {
    @CommandMethod()
    start() {
        console.log('Bienvenido maldito pendejo tome asiento...');
        console.log('2021 CARNAAAAAAL ESTOY AGARRANDO SEÑAL!!!');
    }
}

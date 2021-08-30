import { Command, CommandMethod } from '@bleed-believer/command';

@Command({
    main: 'help',
    title: 'Help'
})
export class HelpCommand {
    @CommandMethod()
    start() {
        console.log('Bienvenido a la ayuda de este programa!');
        console.log('Aquí no hay documentación que mostrar.');
    }
}
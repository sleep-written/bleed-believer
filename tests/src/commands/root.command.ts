import { Command, CommandMethod } from '@bleed-believer/command';

@Command({
    title: 'Base'
})
export class RootCommand {
    @CommandMethod()
    start(): void {
        console.log('Aquí no hay nada que ver...');
    }
}

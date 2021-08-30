import { Command, CommandMethod } from '@bleed-believer/command';

@Command({
    main: 'count',
    title: 'Count to 10'
})
export class CountCommand {
    private _clock: NodeJS.Timeout;
    private _value = 0;

    @CommandMethod()
    start(): Promise<void> {
        return new Promise(resolve => {
            this._clock = setInterval(() => {
                if (this._value >= 10) {
                    clearInterval(this._clock);
                    this._clock = null;
                    resolve();
                } else {
                    console.log('value ->', ++this._value);
                }
            }, 1000);
        });
    }
}

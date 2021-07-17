import { BleedBeliever } from 'bleed-believer';
import { CommandRouting } from './command-routing';

const main = new BleedBeliever(CommandRouting);
main.bleed();
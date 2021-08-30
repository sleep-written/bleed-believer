import { BleedBeliever } from '@bleed-believer/core';
import { CommandRouting } from './command-routing';

const main = new BleedBeliever(CommandRouting);
main.bleed();
import { AppRouting } from './app.routing';
import { Commander } from '@bleed-believer/commander';

const app = new Commander(AppRouting);
app.execute();

import { AppRouting } from './app.routing';
import { Commander } from '@bleed-believer/command';

const app = new Commander(AppRouting);
app.execute();

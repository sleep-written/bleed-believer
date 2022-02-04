import { AppRouting } from './app.routing';

const app = new AppRouting();
app.before();

const meta = (AppRouting as any)?.__meta__;
console.log(meta);
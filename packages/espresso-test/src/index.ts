import * as BodyParser from 'body-parser';
import express from 'express';

import { ApiRouting } from './controllers/api.routing';
import { Espresso } from '@bleed-believer/espresso';

const app = express();
app.use(BodyParser.json({ strict: false }));
app.use(BodyParser.urlencoded({ extended: true }));

const exp = new Espresso(app, { verbose: true, lowercase: true });
exp.inject(ApiRouting);

exp.onError((e, _, res) => {
    console.log('ERROR!');
    console.log(e.message);
    
    res.json('FATAL ERROR!');
});

app.listen(8080, () => {
    console.log('Ready...');
});

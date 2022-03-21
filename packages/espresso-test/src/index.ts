import * as BodyParser from 'body-parser';
import express from 'express';

import { Espresso } from '@bleed-believer/espresso';
import { ApiRouting } from './controllers/api.routing';

const exp = express();
exp.use(BodyParser.json({ strict: false }));
exp.use(BodyParser.urlencoded({ extended: true }));

const app = new Espresso(exp);
app.injectRouting(ApiRouting);
app.onError((e, req, res) => {
    console.log('ERROR!');
    console.log(e.message);
    
    res.json('FATAL ERROR!');
});

exp.listen(8080, () => {
    console.clear();
    console.log('Ready...');
});

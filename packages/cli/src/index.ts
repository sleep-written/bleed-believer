#! /usr/bin/env node
import { Commander } from '@bleed-believer/commander';
import { AppRouting } from './app.routing';

const app = new Commander(AppRouting);
app.execute();
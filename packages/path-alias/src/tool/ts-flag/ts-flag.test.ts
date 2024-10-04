import test from 'ava';
import { rm } from 'fs/promises';
import { TsFlag } from './ts-flag.js';

test.after(async () => {
    const tsNodeFlag = new TsFlag('test/joder-chaval');
    await rm(tsNodeFlag.path, { force: true });
});

test.serial('ts-node = false', t => {
    const tsNodeFlag = new TsFlag('test/joder-chaval');
    const isTsNode = tsNodeFlag.parsingSourceCode;
    t.false(isTsNode);
});

test.serial('mark as ts-node', t => {
    const tsNodeFlag = new TsFlag('test/joder-chaval');
    tsNodeFlag.markAsParsingSourceCode();

    const isTsNode = tsNodeFlag.parsingSourceCode;
    t.true(isTsNode);
});

test.serial('ts-node = true', t => {
    const tsNodeFlag = new TsFlag('test/joder-chaval');
    const isTsNode = tsNodeFlag.parsingSourceCode;
    t.true(isTsNode);
});

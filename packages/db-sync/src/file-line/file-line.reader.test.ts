import { setTimeout as sleep } from 'timers/promises';
import { tmpdir } from 'os';
import test from 'ava';

import { FileLineWriter } from './file-line.writer.js';
import { FileLineReader } from './file-line.reader.js';
import { Chronometer } from '@tool/chronometer/chronometer.js';

const writer = new FileLineWriter(tmpdir(), 'test.file-line.reader.txt');
test.beforeEach(async _ => writer.kill(true));
test.afterEach(async _ => writer.kill(true));

test.serial('Read the content of an small file', async t => {
    // Data original
    const lines = [
        'texto 1',
        'texto 2',
        'texto 3',
        'texto 4',
        'texto 5',
    ];

    // Generar el archivo
    await writer.append(async append => {
        await Promise.all(lines.map(x => append(x)));
    });

    // A partir de aquí viene el line-reader
    const lineReader = new FileLineReader(writer.path);
    const result: string[] = [];
    await lineReader.read((line, close) => {
        result.push(line);
        if (result.length >= 3) {
            close();
        }
    });

    t.deepEqual(result, lines.slice(0, 3));
});

test.serial('Read the content of an small file with a delay in callback', async t => {
    t.timeout(7_000);
    // Data original
    const lines = [
        'texto 1',
        'texto 2',
        'texto 3',
        'texto 4',
        'texto 5',
    ];

    // Generar el archivo
    await writer.append(async append => {
        await Promise.all(lines.map(x => append(x)));
    });

    // A partir de aquí viene el line-reader
    const lineReader = new FileLineReader(writer.path);
    const result: string[] = [];
    await lineReader.read(async (line, close) => {
        result.push(line);
        await sleep(1_000);
        
        if (result.length >= 2) {
            close();
        }
    });

    t.deepEqual(result, lines.slice(0, 2));
});

test.serial('Ensure large file reading with low memory consumption', async t => {
    t.timeout(80_000);
    const chronometer = new Chronometer();
    const verbose = false;

    // Set an interval to log memory usage every 1 second
    const memoryUsage: number[] = [];
    const memoryLogInterval = setInterval(() => {
        // Memory usage in Mb
        const used = process.memoryUsage().heapUsed / (1024 ** 2);
        memoryUsage.push(used);

        if (verbose) {
            console.log(`The script uses approximately ${used.toFixed(2)} MB`);
        }
    }, 1000);

    // 10 million lines should give us a file roughly around 100 MB
    const testLine = "perreo ijoeputa";
    const numberOfLines = 10_000_000;

    // Create a large file
    chronometer.start();
    await writer.append(async append => {
        for (let i = 0; i < numberOfLines; i++) {
            await append(testLine);
        }
    });

    if (verbose) {
        console.log(`time to write: ${chronometer.stop(3)}s`);
    }

    await sleep(1000);
    const lineReader = new FileLineReader(writer.path);
    // const readTimeout = setTimeout(
    //     () => lineReader.close(),
    //     20_000
    // );

    if (verbose) {
        chronometer.start();
    }

    // Read each line and validate without storing
    let isValid = true;
    await lineReader.read((line, close) => {
        if (line !== testLine) {
            isValid = false;
            close(); // Stop reading as soon as we find a mismatch
        }
    });

    // Clear all timers
    // clearTimeout(readTimeout);
    clearInterval(memoryLogInterval);

    if (verbose) {
        console.log(`time to read: ${chronometer.stop(3)}s`);
    }

    // Calc average memory usage
    const limit = 20; // 20 Mb
    const average =
        memoryUsage.reduce((p, c) => p + c) /
        memoryUsage.length;

    if (verbose) {
        console.log(
                `Average consuption: ${average.toFixed(2)} Mb; `
            +   `Limit consuption: ${limit} Mb;`
        );
    }

    // Assertions
    t.true(isValid);
    t.true(
        average <= limit,
        `The average memy usage is over than ${limit.toFixed(2)} Mb.`
    );
});
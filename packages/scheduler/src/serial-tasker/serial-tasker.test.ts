import test from 'ava';
import { SerialTasker } from './serial-tasker.js';

test.serial('Queue [1, 2, 3]', async t => {
    t.timeout(10000);
    await new Promise<void>(resolve => {
        const tasker = new SerialTasker();
        const target: number[] = [];
    
        function push(n: number): void {
            target.push(n);
            if (target.length >= 3) {
                t.deepEqual(target, [1, 2, 3]);
                resolve();
            }
        }
    
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            // console.log('Add number 1...');
            push(1);
        });
        
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            // console.log('Add number 2...');
            push(2);
        });
        
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            // console.log('Add number 3...');
            push(3);
        });

        // console.log('Tasks added!');
    });
});

test.serial('Queue [1, fail, 3]', async t => {
    t.timeout(10000);
    await new Promise<void>(resolve => {
        const tasker = new SerialTasker();
        const target: number[] = [];
    
        function push(n: number): void {
            target.push(n);
            if (target.length >= 2) {
                t.deepEqual(target, [1, 3]);
                resolve();
            }
        }
    
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            // console.log('Add number 1...');
            push(1);
        });
        
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            throw new Error('AajjajAj');
        }).catch(() => {
            // console.log('Task 2 failed!')
        });
        
        tasker.push(async () => {
            await new Promise(r => setTimeout(r, 1000));
            // console.log('Add number 3...');
            push(3);
        });

        // console.log('Tasks added!');
    });
});

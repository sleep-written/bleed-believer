import test from 'ava';
import { TaskQueue } from './task-queue.js';
import { CancelledExecution } from './cancelled-execution.error.js';

// Test to ensure tasks are executed sequentially
test('Tasks are executed sequentially in the TaskQueue', async t => {
    const queue = new TaskQueue();
    let task1Finished = false;
    let task2Started = false;

    // Define two tasks, where each resolves after a delay
    const task1 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            task1Finished = true; // Mark task1 as finished
            resolve();
        }, 50); // Short delay to simulate work
    });

    const task2 = () => new Promise<void>(resolve => {
        task2Started = true; // Mark task2 as started
        t.true(task1Finished, 'Task 2 started before Task 1 finished'); // Assert that task1 must finish before task2 starts
        setTimeout(resolve, 50); // Another short delay
    });

    // Enqueue both tasks
    queue.run(task1);
    queue.run(task2);

    // Wait for both tasks to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify both flags to ensure sequential execution
    t.true(task1Finished, 'Task 1 did not finish');
    t.true(task2Started, 'Task 2 did not start');
});

// Test to ensure tasks are executed sequentially and manipulate a shared resource
test('Sequential tasks manipulate a shared string to form a greeting', async t => {
    const queue = new TaskQueue();
    let sharedString = ''; // Our shared resource starting as an empty string

    // Define three tasks to manipulate the sharedString
    const task1 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += 'hello'; // Concatenate 'hello'
            resolve();
        }, 50); // Wait for 50ms
    });

    const task2 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += ' '; // Concatenate a space
            resolve();
        }, 50); // Wait for 50ms
    });

    const task3 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += 'world'; // Concatenate 'world'
            resolve();
        }, 50); // Wait for 50ms
    });

    // Enqueue the tasks and wait for all to complete
    await Promise.all([
        queue.run(task1),
        queue.run(task2),
        queue.run(task3)
    ]);

    // Verify the final state of sharedString
    t.is(sharedString, 'hello world', 'The shared string does not form the greeting "hello world"');
});

// Test to ensure tasks return their expected values in the correct order
test('TaskQueue tasks return expected values in sequential order', async t => {
    const queue = new TaskQueue();

    // Define three tasks, each returning a value after a delay
    const task1 = () => new Promise<number>(resolve => {
        setTimeout(() => resolve(666), 50); // Wait for 50ms and return 666
    });

    const task2 = () => new Promise<string>(resolve => {
        setTimeout(() => resolve('joder'), 50); // Wait for 50ms and return 'joder'
    });

    const task3 = () => new Promise<boolean>(resolve => {
        setTimeout(() => resolve(false), 50); // Wait for 50ms and return false
    });

    // Execute the tasks and store their return values using Promise.all
    const results = await Promise.all([
        queue.run(task1),
        queue.run(task2),
        queue.run(task3)
    ]);

    // Verify that the results array contains the expected values in the correct order
    t.deepEqual(results, [666, 'joder', false], 'The returned values are not as expected');
});

// Test to ensure the cancellation mechanism works correctly
test('TaskQueue cancellation correctly aborts pending tasks', async t => {
    const queue = new TaskQueue();
    let task1Executed = false;
    let task2Executed = false;
    let task3Executed = false;
    
    // Define two tasks, each setting a flag when executed
    const task1 = async () => {
        await new Promise(r => setTimeout(r, 100));
        task1Executed = true;
        return 666;
    };

    const task2 = async () => {
        await new Promise(r => setTimeout(r, 100));
        task2Executed = true;
        return 'joder';
    };

    const task3 = async () => {
        await new Promise(r => setTimeout(r, 100));
        task3Executed = true;
        return 'joder';
    };

    // Cancel the queue after 25ms
    setTimeout(
        () => queue.abort(),
        25
    );

    // Enqueue both tasks
    const task1Promise = queue.run(task1).catch(err => err);
    const task2Promise = queue.run(task2).catch(err => err);
    const task3Promise = queue.run(task3).catch(err => err);

    // Wait for both tasks to (not) complete
    const result1 = await task1Promise;
    const result2 = await task2Promise;
    const result3 = await task3Promise;

    // Check that neither task was executed and both were rejected with CancelledExecution
    t.true(task1Executed, 'Task 1 must have executed');
    t.false(task2Executed, 'Task 2 must not have executed');
    t.false(task3Executed, 'Task 3 must not have executed');
    t.is(result1, 666);
    t.true(result2 instanceof CancelledExecution, 'Task 2 was not cancelled properly');
    t.true(result3 instanceof CancelledExecution, 'Task 3 was not cancelled properly');
});

// Test to ensure tasks can be added at different times and still execute in order
test('Tasks added at different times result in correct string concatenation', async t => {
    const queue = new TaskQueue();
    let sharedString = ''; // Iniciar con un string vacío

    // Definir tarea 1 y tarea 2
    const task1 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += 'hello'; // Concatenar 'hello'
            resolve();
        }, 50); // Esperar 50ms
    });

    const task2 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += ' world'; // Concatenar ' world'
            resolve();
        }, 50); // Esperar 50ms
    });

    // Ejecutar tarea 1 y tarea 2 en paralelo sin esperar a que terminen
    queue.run(task1);
    queue.run(task2);

    // Esperar 25ms antes de añadir tarea 3
    await new Promise(resolve => setTimeout(resolve, 25));

    // Definir y ejecutar tarea 3
    const task3 = () => new Promise<void>(resolve => {
        setTimeout(() => {
            sharedString += ' joder'; // Concatenar ' joder'
            resolve();
        }, 50); // Esperar 50ms
    });
    queue.run(task3);

    // Esperar a que todas las tareas terminen
    await new Promise(resolve => setTimeout(resolve, 200));

    // Comprobar que el string resultante es el esperado
    t.is(sharedString, 'hello world joder', 'El string resultante no coincide con "hello world joder"');
});
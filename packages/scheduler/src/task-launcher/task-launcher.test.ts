import type { Task, TaskLaunchOptions } from './interfaces/index.js';

import { TaskLauncher } from './task-launcher.js';
import * as assets from './task-launcher.assets.js';

import test from 'ava';

test('Infinite task execution and abort', async t => {
    let count = 0;

    class FakeTask implements Task {
        async action(): Promise<void> {
            count++;
            await new Promise(r =>  setTimeout(r, 100)); // Simulates some asynchronous work
        }
    }

    const target = new TaskLauncher([
        FakeTask
    ]);

    // Wait a bit before aborting to allow some tasks to complete
    setTimeout(() => target.abort(), 250);

    // Execute and do not wait here for it to finish as it's an infinite task
    await target.execute({ FakeTask: 'infinite' });

    // Assert that the task was executed 2 or 3 times based on timing
    t.is(count, 3, `Expected task count to be between 2 and 3, got ${count}`);
});

test('Scheduled tasks execution order', async t => {
    // Declaración de la variable compartida
    let sharedString = '';
    
    // Implementación de FakeTask01
    class FakeTask01 implements Task {
        async action(): Promise<void> {
            sharedString += 'j';
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Implementación de FakeTask02
    class FakeTask02 implements Task {
        async action(): Promise<void> {
            sharedString += 'a';
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Crear una instancia de TaskLauncher con las tareas
    const launcher = new TaskLauncher([FakeTask01, FakeTask02]);

    // Opciones de lanzamiento basadas en la hora actual
    const launchOptions: TaskLaunchOptions = {
        FakeTask01: assets.generateSchedule(1000, 4000, 5000, 7000, 8000),
        FakeTask02: assets.generateSchedule(2000, 3000, 4000, 6000, 8000)
    };
    
    // Abortar después de 5 segundos
    setTimeout(() => launcher.abort(), 5000);
    
    // Lanzar las tareas según el horario
    await launcher.execute(launchOptions);

    // Evaluar el resultado esperado
    t.is(sharedString, 'jaaja', `Expected "jaaja", got "${sharedString}"`);
});

test('Mixed scheduled and infinite tasks execution', async t => {
    let sharedString = ''; // Reset shared string
    
    // Tareas que alteran el string
    class InfiniteTaskA implements Task {
        async action(): Promise<void> {
            sharedString += 'A';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    class InfiniteTaskB implements Task {
        async action(): Promise<void> {
            sharedString += 'B';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    class ScheduledTask implements Task {
        async action(): Promise<void> {
            sharedString += 'S';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    const launcher = new TaskLauncher([InfiniteTaskA, InfiniteTaskB, ScheduledTask]);

    // Opciones de lanzamiento basadas en la hora actual
    const launchOptions: TaskLaunchOptions = {
        InfiniteTaskA: 'infinite',
        InfiniteTaskB: 'infinite',
        ScheduledTask: assets.generateSchedule(1000, 3000, 5000)
    };

    // Esperar unos segundos antes de abortar
    setTimeout(() => launcher.abort(), 4500); // Espera de 4 segundos

    // Lanzar todas las tareas
    await launcher.execute(launchOptions);

    // Evaluar el resultado esperado
    t.is(
        sharedString,
        'ABABSABABABABSABABAB',
        'ScheduledTask did not execute as expected'
    );
});

test('Mixed tasks with error handling', async t => {
    let sharedString = ''; // Reset shared string
    let taskACount = 0; // Counter for InfiniteTaskA to throw error on 3rd call

    // Tareas que alteran el string, con InfiniteTaskA lanzando error en la 3ra ejecución
    class InfiniteTaskA implements Task {
        async action(): Promise<void> {
            sharedString += 'A';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    class InfiniteTaskB implements Task {
        async action(): Promise<void> {
            sharedString += 'B';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    class ScheduledTask implements Task {
        async action(): Promise<void> {
            if (++taskACount === 2) {
                throw new Error("Simulated error on third execution");
            }
            
            sharedString += 'S';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    const launcher = new TaskLauncher(
        [InfiniteTaskA, InfiniteTaskB, ScheduledTask],
        (e: Error) => { t.is(e.message, 'Simulated error on third execution') }
    );

    // Opciones de lanzamiento basadas en la hora actual
    const launchOptions: TaskLaunchOptions = {
        InfiniteTaskA: 'infinite',
        InfiniteTaskB: 'infinite',
        ScheduledTask: assets.generateSchedule(1000, 3000, 5000)
    };

    // Esperar unos segundos antes de abortar
    setTimeout(() => launcher.abort(), 4500); // Espera de 4.5 segundos

    // Lanzar todas las tareas esperando manejar correctamente los errores
    try {
        await launcher.execute(launchOptions);
    } catch (error: any) {
        // Atrapar errores para verificar que no detengan la ejecución completa
        t.fail(`Unexpected error halted execution: ${error.message}`);
    }

    // Evaluar el resultado esperado
    t.is(
        sharedString,
        'ABABSABABABABABABAB',
        'ScheduledTask did not execute as expected'
    );
});
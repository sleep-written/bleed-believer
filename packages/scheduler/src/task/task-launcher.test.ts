import type { TaskLaunchOptions } from './task-launch-options.js';
import type { Task } from './task.js';

import * as assets from './task-launcher.assets.js';
import { TaskLauncher } from './task-launcher.js';

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

    // Precalcular el día y los tiempos para las opciones de lanzamiento
    const { day, hh, mm, ss } = assets.getNow();

    // Opciones de lanzamiento basadas en la hora actual
    const launchOptions: Record<string, TaskLaunchOptions> = {
        FakeTask01: {
            days: [day],
            timestamp: [
                [hh, mm, (ss + 1) % 60],
                [hh, mm, (ss + 4) % 60],
                [hh, mm, (ss + 5) % 60],
                [hh, mm, (ss + 7) % 60],
                [hh, mm, (ss + 8) % 60],
            ]
        },
        FakeTask02: {
            days: [day],
            timestamp: [
                [hh, mm, (ss + 2) % 60],
                [hh, mm, (ss + 3) % 60],
                [hh, mm, (ss + 4) % 60],
                [hh, mm, (ss + 6) % 60],
                [hh, mm, (ss + 8) % 60],
            ]
        }
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

    // Precalcular el día y los tiempos para las opciones de lanzamiento
    const { day, hh, mm, ss } = assets.getNow();

    // Opciones de lanzamiento basadas en la hora actual
    const launchOptions: Record<string, TaskLaunchOptions | 'infinite'> = {
        InfiniteTaskA: 'infinite',
        InfiniteTaskB: 'infinite',
        ScheduledTask: {
            days: [day],
            timestamp: [
                [hh, mm, (ss + 1) % 60],
                [hh, mm, (ss + 3) % 60],
                [hh, mm, (ss + 5) % 60]
            ]
        }
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
import type { MountOptions, Size } from './interfaces/index.js';

import { realign } from './tool/realign/index.js';
import { table } from './tool/table/index.js';
import { cmd } from './tool/cmd/index.js';

/**
 * A class that represents a device (for example an SSD), or a shared folder mounted in the current system.
 */
export class Resource {
    /**
     * Gets all mounted devices and shared folders in your system.
     */
    static async get(): Promise<Resource[]> {
        // Executes the command
        const comm = await cmd('findmnt', ['-lo', 'fstype,source,target,size']);
        if (comm.stderr) {
            const text = comm.stderr.toString('utf-8').trim();
            throw new Error(text);
        } else if (!comm.stdout) {
            throw new Error('Response not received');
        }

        // Normalizes the output
        const text = comm.stdout.toString('utf-8');
        const rect = await realign(text);
        const data = table(rect);

        // Maps table
        return data.map(x => {
            // Parses size
            const value = parseFloat(x.SIZE.replace(/[a-z]+$/gi, ''));
            const size: Size = { value };

            // Adds the suffix
            const suffix = x.SIZE?.match(/[a-z]+$/gi)?.at(0) as any;
            if (suffix) {
                size.suffix = suffix;
            }

            // Returns the parsed resource
            return new Resource(
                x.FSTYPE,
                x.SOURCE,
                x.TARGET,
                size
            );
        });
    }

    /**
     * Searches a device that satisfy a certain criteria. Returns an `Resource` instance
     * if the __predicate__ function returns a result, otherwise returns _`undefined`_.
     * @param predicate A function to evaluate each device. Must returns a boolean.
     */
    static async find(predicate: (o: Resource, i: number) => boolean): Promise<Resource | undefined> {
        const all = await Resource.get();
        return all.find(predicate);
    }

    /**
     * Returns all `Resource` instances that satisfy a certain criteria in an Array.
     * @param predicate A function to evaluate each device. Must returns a boolean.
     */
    static async filter(predicate: (o: Resource, i: number) => boolean): Promise<Resource[]> {
        const all = await Resource.get();
        return all.filter(predicate);
    }

    /**
     * Checks if at least one resource satisfy a given condition. Returns `true` when
     * the __predicate__ function found at least one result, otherwise returns `false`.
     * @param predicate A function to evaluate each device. Must returns a boolean.
     */
    static async some(predicate: (o: Resource, i: number) => boolean): Promise<boolean> {
        const all = await Resource.get();
        return all.some(predicate);
    }

    /**
     * Mounts a device or shared folder already declared in `/etc/fstab`.
     * @param target The folder where the device will be mounted (according with `/etc/fstab` content).
     * @param sudo If `true` the command will run with `sudo` permissions.
     */
    static async mount(target: string, sudo?: boolean): Promise<Resource>;
    /**
     * Mounts a new device or shared folder.
     * @param options An object that describes how to mount the new device.
     * @param sudo If `true` the command will run with `sudo` permissions.
     */
    static async mount(options: MountOptions, sudo?: boolean): Promise<Resource>;
    static async mount(o: string | MountOptions, sudo?: boolean): Promise<Resource> {
        // Build args
        const argv: string[] = [];
        if (typeof o === 'object') {
            argv.push(
                o.fstype,
                o.source,
                o.target
            );
        } else {
            argv.push(o);
        }

        // Launch command
        const resp = sudo
            ?   await cmd('sudo', ['mount', ...argv])
            :   await cmd('mount', argv);

        if (resp.stderr) {
            const text = resp.stderr.toString('utf-8').trim();
            throw new Error(text);
        }

        // Search the device
        const device = await Resource.find(x => {
            if (typeof o === 'object') {
                return (
                    x.fstype === o.fstype &&
                    x.source === o.source &&
                    x.target === o.target
                );
            } else {
                return x.target === o;
            }
        });

        // Return response
        if (!device) {
            throw new Error(`Device not found`);
        } else {
            return device;
        }
    }

    /**
     * Mounts all devices and shared folders declared in `/etc/fstab`.
     * @param sudo If `true` the command will run with `sudo` permissions.
     */
    static async mountAll(sudo?: boolean): Promise<Resource[]> {
        const resp = sudo
            ?   await cmd('sudo', ['mount', '-a'])
            :   await cmd('mount', ['-a']);

        if (resp.stderr) {
            const text = resp.stderr.toString('utf-8').trim();
            throw new Error(text);
        }

        return Resource.get();
    }

    /**
     * Unmounts a device or shared folder.
     * @param target The folder where the device (or shared folder) is mounted.
     * @param sudo If `true` the command will run with `sudo` permissions.
     */
    static async umount(target: string, sudo?: boolean): Promise<void> {
        const resp = sudo
            ?   await cmd('sudo', ['umount', target])
            :   await cmd('umount', [target]);

        if (resp.stderr) {
            const text = resp.stderr.toString('utf-8').trim();
            throw new Error(text);
        }
    }

    /**
     * The filesystem type of the current resource.
     */
    readonly fstype!: string;

    /**
     * The source address of the current resource (ex: /dev/sda1).
     */
    readonly source!: string;

    /**
     * The destination directory where the resourse is mounted (ex: /mnt/music).
     */
    readonly target!: string;

    /**
     * Describes the total size of the current resource.
     */
    readonly size!: Size;

    private constructor(
        fstype: string,
        source: string,
        target: string,
        size: Size
    ) {
        Object.defineProperties(this, {
            fstype: { value: fstype,    writable: false,    configurable: false },
            source: { value: source,    writable: false,    configurable: false },
            target: { value: target,    writable: false,    configurable: false },
            size:   { value: size,      writable: false,    configurable: false },
        });
    }

    /**
     * Unmounts the current device.
     * @param sudo If `true` the command will run with `sudo` permissions.
     */
    async umount(sudo?: boolean): Promise<void> {
        return Resource.umount(this.target, sudo);
    }
}
# @bleed-believer/mnt

Manage partitions in linux. The package is available in __ESM__ and __CommonJS__ and fully compatible with __Typescript__.

## Installation

Simply use:
```bash
npm i --save @bleed-believer/mnt
```

## Usage

- Gets all mounted resources:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const resources = await Resource.get();
    console.log(resources);
    ```

- Gets an specific resource:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const resource = await Resource.find(x => x.target === '/mnt/z');
    console.log(resource);
    ```

- Checks if the resource is mounted:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const resp = await Resource.some(x => x.target === '/mnt/z');
    console.log('exists???', resp);
    ```

- Filtering some devices:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const resources = await Resource.filter(x => x.fstype === 'ext4');
    console.log(resources);
    ```

- Mounting a resource listed in `/etc/fstab`:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const obj = await Resource.mount('/mnt/z');
    console.log(obj);
    ```

- Mounting a new resource:
    ```ts
    import { Resource } from '@bleed-believer/mnt';

    const obj = await Resource.mount({
        fstype: 'ntfs',
        source: '/dev/sdb2',
        target: '/mnt/z'
    });
    console.log(obj);
    ```

- Unmounting a resource:
    ```ts
    import { Resource } from '@bleed-believer/mnt';
    
    // Using only the target folder (listed in /etc/fstab)...
    await Resource.umount('/mnt/z');

    // ...or usinig an instance
    const obj = await Resource.find(x => x.target === '/mnt/z');
    await obj.umount();
    ```
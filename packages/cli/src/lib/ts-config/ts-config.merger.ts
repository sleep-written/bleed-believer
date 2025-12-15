import type { TsConfigValue, Module, ModuleResolution, Target } from './interfaces/index.js';
import { Merger } from '@lib/merger/index.js';

export const tsConfigMerger = new Merger<TsConfigValue>({
    exclude: new Merger<string[]>((incoming, original) => [
        ...(original ?? []),
        ...(incoming ?? []),
    ]),
    compilerOptions: new Merger({
        strict:                             new Merger<boolean>(),
        target:                             new Merger<Target>(c => c?.toLowerCase() as Target),
        module:                             new Merger<Module>(c => c?.toLowerCase() as Module),
        moduleResolution:                   new Merger<ModuleResolution>(c => c?.toLowerCase() as ModuleResolution),

        removeComments:                     new Merger<boolean>(),
        esModuleInterop:                    new Merger<boolean>(),
        resolveJsonModule:                  new Merger<boolean>(),
        verbatimModuleSyntax:               new Merger<boolean>(),
        emitDecoratorMetadata:              new Merger<boolean>(),
        experimentalDecorators:             new Merger<boolean>(),
        allowImportingTsExtensions:         new Merger<boolean>(),
        rewriteRelativeImportExtensions:    new Merger<boolean>(),

        outDir:                             new Merger<string>(),
        rootDir:                            new Merger<string>(),
        baseUrl:                            new Merger<string>(),
        sourceMap:                          new Merger<boolean>(),
        paths:                              new Merger<Record<string, string[]>>((incoming, original) => {
            const out = original
            ?   structuredClone(original)
            :   {};

            Object
                .entries(incoming)
                .forEach(([ k, v ]) => {
                    if (out[k] instanceof Array) {
                        out[k] = [
                            ...out[k],
                            ...v
                        ];
                    } else {
                        out[k] = v.slice();
                    }
                });

            return out;
        })
    })
});
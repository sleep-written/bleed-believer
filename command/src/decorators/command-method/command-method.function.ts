import { ClassMeta } from '@bleed-believer/core';
import { CommandMethodMeta } from "./command-method.meta";
import { CommandMethodType } from "./command-method.type";

export function CommandMethod(): CommandMethodType {
    return (target, key, descriptor) => {
        // Get Prototype
        const proto = target as ClassMeta<CommandMethodMeta>;

        // Add metadata
        if (!proto?.__meta__) {
            (proto.__meta__ as CommandMethodMeta) = {
                methods: {}
            }
        } else if (!proto.__meta__?.methods) {
            proto.__meta__.methods = {};
        }

        // Assign the current description
        proto.__meta__.methods[key] = descriptor;
    };
}

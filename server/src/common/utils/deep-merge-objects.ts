// deep merge two objects
export function deepMergeObjects (target: object, merge: object): object {
    if (!merge || !target || typeof(merge) !== 'object' || typeof(target) !== 'object' )
        return target ?? {};
    for (const key of Object.keys(merge)) {
        if (!(typeof(merge[key]) === 'object' && typeof(target[key]) === 'object')) {
            target[key] = merge[key];
            continue;
        }
        target[key] = deepMergeObjects(target[key], merge[key]);
    }
    return target;
}


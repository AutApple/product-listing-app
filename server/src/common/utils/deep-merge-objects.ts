// deep merge two objects
export function deepMergeObjects (target: object, merge: object): object {
    if (!merge || !target || typeof(merge) !== 'object' || typeof(target) !== 'object' )
        return target ?? {};
    
    // shallow copy the target so its not being modified
    const output = { ...target };
    
    for (const key of Object.keys(merge)) {
        if (!(typeof(merge[key]) === 'object' && typeof(output[key]) === 'object')) {
            output[key] = merge[key];
            continue;
        }
        output[key] = deepMergeObjects(output[key], merge[key]);
    }
    return output;
}


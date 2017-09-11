export function wrapIterableIterator(process: () => IterableIterator<any>) {
    let iterable;
    return function () {
        if (!iterable) {
            iterable = process();
        }

        const item = iterable.next();
        if (item.done) {
            iterable = undefined;
        }
        return item.value;
    }
}
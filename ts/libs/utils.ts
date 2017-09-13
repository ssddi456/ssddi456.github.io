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

export function createBuffer(gl: WebGLRenderingContext) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error('create gl buffer failed');
    }
    return buffer;
}


export function loopFactory(updater: (tick: number) => any, updateInterval: number) {
    let startTime = Date.now();
    let tick = 0;
    const ret = function () {
        const currentTime = Date.now();
        const delta = currentTime - startTime;
        if (updateInterval < delta) {
            startTime = currentTime;
            updater(tick);
        }
        tick += 1;
        requestAnimationFrame(ret);
    };
    return ret;
}

export function forEachVectorArray<T>(
    array: T[],
    vecterSize: number,
    hander: (vector: T[], index: number, setVector: (newVal: T[]) => void) => any,
) {
    const allLen = array.length;
    if (allLen % vecterSize !== 0) {
        throw new Error('array size ' + allLen + ' not match size ' + vecterSize);
    }
    let i = 0;
    const temp = [] as T[];
    const setVector = function (newVal: T[]) {
        for (let j = 0; j < vecterSize; j++) {
            array[j + i] = newVal[j];
        }
    };
    const getVector = function () {
        for (let j = 0; j < vecterSize; j++) {
            temp[j] = array[i + j];
        }
        return temp;
    };
    for (; i < allLen; i += vecterSize) {
        hander(getVector(), Math.floor(i / vecterSize), setVector);
    }
}

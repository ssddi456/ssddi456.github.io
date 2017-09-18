import { Vector4, Point } from "./2dRoad";

export function randomItem<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

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

export function axisCollision(x1: number, x2: number, x3: number, x4: number) {
    const points = [x1, x2, x3, x4].sort((a, b) => a - b);
    const delta = points[3] - points[0] - x2 - x1 + x4 - x3;
    return delta;
}

export function boxCollision(boxA: Vector4, boxB: Vector4) {
    const xCollision = axisCollision(boxA[1], boxA[3], boxB[1], boxB[3]);
    const yCollision = axisCollision(boxA[0], boxA[2], boxB[0], boxB[2]);
    if (xCollision < 0 && yCollision < 0) {
        return [xCollision, yCollision];
    }
    return null;
}
export function getBBox(postion: Point, halfsize: Point) {
    return [
        postion[0] - halfsize[0], postion[1] - halfsize[1],
        postion[0] + halfsize[0], postion[1] + halfsize[1],
    ] as Vector4;
}



/**
 * [
 *  [0, 0, 0],
 *  [0, 0, 0],
 *  [0, 0, 0],
 * ]
 * 
 * 来构成一个地图，0为不通过，1为可以通过。
 */

export class RoadMap {
    grid: number[][];
    width = 0;
    height = 0;

    constructor(x: number, y: number) {
        this.grid = [];
        this.width = x;
        this.height = y;

        for (let indexY = 0; indexY < y; indexY++) {
            const row = [];
            this.grid.push(row);
            for (let indexX = 0; indexX < x; indexX++) {
                row.push(0);
            }
        }
    }
    setWall(x: number, y: number) {
        this.grid[y][x] = 0;
    }
    isInGrid(x: number, y: number) {
        if (x < 0 ||
            x >= this.width ||
            y < 0 ||
            y >= this.height
        ) {
            return false;
        }
        return true;
    }
    canWalkThrough(x: number, y: number) {
        if (!this.isInGrid(x, y)) {
            return false;
        }
        return this.grid[y][x] === 1;
    }
    setWalkThrough(x: number, y: number) {
        this.grid[y][x] = 1;
    }
    setRoad(a: [number, number], b: [number, number]) {
        let increaser;
        let fixer;

        if (a[0] === b[0]) {
            fixer = 0;
            increaser = 1;
        } else if (a[1] === b[1]) {
            fixer = 1;
            increaser = 0;
        }

        const start = a[increaser];
        const step = Math.abs(b[increaser] - a[increaser]);
        const direction = (b[increaser] - a[increaser]) / step;

        for (let index = 0; index < step; index += 1) {
            const pos = [] as [number, number];
            pos[fixer] = a[fixer];
            pos[increaser] = start + index * direction;
            this.setWalkThrough.apply(this, pos);
        }
    }
    isJoint(x: number, y: number) {
        if (!this.canWalkThrough(x, y)) {
            return false;
        }
        if (
            !(this.canWalkThrough(x - 1, y) && this.canWalkThrough(x + 1, y)) ||
            !(this.canWalkThrough(x, y - 1) && this.canWalkThrough(x, y + 1))
        ) {
            return true;
        }
    }
    getAllJoint() {
        const ret: Array<[number, number]> = [];
        for (let indexY = 0; indexY < this.grid.length; indexY++) {
            const row = this.grid[indexY];
            for (let indexX = 0; indexX < this.grid.length; indexX++) {
                if (this.isJoint(indexX, indexY)) {
                    ret.push([indexX, indexY]);
                }
            }
        }
        return ret;
    }
    getAllWalkThrough() {
        const ret: Array<[number, number]> = [];
        for (let indexY = 0; indexY < this.grid.length; indexY++) {
            const row = this.grid[indexY];
            for (let indexX = 0; indexX < this.grid.length; indexX++) {
                if (row[indexX] === 1) {
                    ret.push([indexX, indexY]);
                }
            }
        }
        return ret;
    }

    forEach(walker: (x: number, y: number) => any) {
        for (let indexY = 0; indexY < this.grid.length; indexY++) {
            const row = this.grid[indexY];
            for (let indexX = 0; indexX < this.grid.length; indexX++) {
                walker(indexX, indexY);
            }
        }
    }

    getNearBy(x: number, y: number) {
        const ret = [] as Array<[number, number]>;
        if (this.isInGrid(x, y - 1)) {
            ret.push([x, y - 1]);
        }
        if (this.isInGrid(x, y + 1)) {
            ret.push([x, y + 1]);
        }
        if (this.isInGrid(x - 1, y)) {
            ret.push([x - 1, y]);
        }
        if (this.isInGrid(x + 1, y)) {
            ret.push([x + 1, y]);
        }
        return ret;
    }

    getCheckPos(x: number, y: number) {
        const ret = [] as Array<{ check: [number, number], add: [number, number] }>;
        if (this.isInGrid(x, y - 2)) {
            ret.push({ check: [x, y - 2], add: [x, y - 1] });
        }
        if (this.isInGrid(x, y + 2)) {
            ret.push({ check: [x, y + 2], add: [x, y + 1] });
        }
        if (this.isInGrid(x - 2, y)) {
            ret.push({ check: [x - 2, y], add: [x - 1, y] });
        }
        if (this.isInGrid(x + 2, y)) {
            ret.push({ check: [x + 2, y], add: [x + 1, y] });
        }
        return ret;
    }

    generateRandonRoad(startX = 0, startY = 0) {
        const waitForCheck = [] as Array<[number, number]>;

        waitForCheck.push([startX, startY]);

        while (waitForCheck.length) {
            const pos = waitForCheck.pop();
            const nearBy = this.getCheckPos(pos[0], pos[1]);

            const blocked = nearBy.filter((nearByPos) => {
                return !this.canWalkThrough(nearByPos.add[0], nearByPos.add[1]) &&
                    !this.canWalkThrough(nearByPos.check[0], nearByPos.check[1]);
            });
            if (blocked.length >= nearBy.length - 1) {
                this.setWalkThrough(pos[0], pos[1]);
                // random push
                while (blocked.length) {
                    if (Math.random() > 0.5) {
                        waitForCheck.push(blocked.pop().add);
                    } else {
                        waitForCheck.push(blocked.shift().add);
                    }
                }
            }
        }
    }
}

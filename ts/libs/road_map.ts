import { Point } from './2dRoad';

/**
 * [
 *  [0, 0, 0],
 *  [0, 0, 0],
 *  [0, 0, 0],
 * ]
 *
 * 来构成一个地图，0为不通过，1为可以通过。
 */
interface IMapCell {
    canWalkThrough: boolean;
    visited: boolean;
    visible: boolean;
}

export class RoadMap {
    grid: IMapCell[][];
    width = 0;
    height = 0;

    entrance: Point;
    exit: Point;

    constructor(x: number, y: number) {
        this.grid = [];
        this.width = x;
        this.height = y;
    }

    resetGrid() {
        this.grid = this.grid || [];
        this.grid.splice(this.height, this.grid.length - this.height);

        for (let indexY = 0; indexY < this.height; indexY++) {
            let row: IMapCell[];
            if (!this.grid[indexY]) {
                row = [];
                this.grid.push(row);
            }
            row = this.grid[indexY];
            row.splice(this.width, row.length - this.width);

            for (let indexX = 0; indexX < this.width; indexX++) {
                let el = row[indexX];
                if (el === undefined) {
                    el = {
                        canWalkThrough: false,
                        visited: false,
                        visible: false,
                    };
                    row.push(el);
                } else {
                    el.canWalkThrough = false;
                    el.visited = false;
                    el.visible = false;
                }
            }
        }
    }
    setWall(x: number, y: number) {
        this.grid[y][x].canWalkThrough = false;
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
        return this.grid[y][x].canWalkThrough;
    }
    setWalkThrough(x: number, y: number) {
        this.grid[y][x].canWalkThrough = true;
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
            const pos: Point = [0, 0];
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
                if (row[indexX].canWalkThrough) {
                    ret.push([indexX, indexY]);
                }
            }
        }
        return ret;
    }

    forEach(walker: (x: number, y: number, cell: IMapCell, index?: number) => any) {
        for (let indexY = 0; indexY < this.grid.length; indexY++) {
            const row = this.grid[indexY];
            for (let indexX = 0; indexX < row.length; indexX++) {
                walker(indexX, indexY, row[indexX], this.posToIndex(indexX, indexY));
            }
        }
    }

    getArround(x: number, y: number, distance: number = 2) {
        const deltas = [0];
        for (let j = 1; j < distance; j++) {
            deltas.push(j);
            deltas.unshift(-1 * j);
        }

        const ret = [] as Point[];
        for (let indexY = 0; indexY < deltas.length; indexY++) {
            const deltaY = deltas[indexY];
            for (let indexX = 0; indexX < deltas.length; indexX++) {
                const deltaX = deltas[indexX];
                if (!(deltaX === 0 && deltaY === 0)) {
                    ret.push([x + deltaX, y + deltaY]);
                }
            }
        }
        return ret;
    }

    posToIndex(x: number, y: number) {
        return y * this.width + x;
    }
    indexToPos(index: number) {
        const x = index % this.width;
        const ret = [x, Math.floor(index / this.width)];
        return ret;
    }
    getCell(x: number, y: number) {
        return this.grid[y][x];
    }
    getNearBy(x: number, y: number) {
        const ret = [] as Point[];
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
        this.resetGrid();
        const waitForCheck = [] as Array<[number, number]>;
        this.entrance = [startX, startY];
        waitForCheck.push(this.entrance);

        while (waitForCheck.length) {
            // random pop
            let pos;
            if (Math.random() >= 0.5) {
                pos = waitForCheck.pop();
            } else {
                pos = waitForCheck.shift();
            }

            const nearBy = this.getCheckPos(pos[0], pos[1]);

            const blocked = nearBy.filter((nearByPos) => {
                return !this.canWalkThrough(nearByPos.add[0], nearByPos.add[1]) &&
                    !this.canWalkThrough(nearByPos.check[0], nearByPos.check[1]);
            });
            // 这个逻辑有点不对
            if (blocked.length >= nearBy.length - 1) {
                this.setWalkThrough(pos[0], pos[1]);
                // random push
                while (blocked.length) {
                    const block = blocked.pop();
                    if (block) {
                        this.setWalkThrough(block.add[0], block.add[1]);
                        if (Math.random() >= 0.5) {
                            waitForCheck.push(block.check);
                        } else {
                            waitForCheck.unshift(block.check);
                        }
                    }
                }
            }
        }

        const exit = [this.width - 1, Math.max(2, Math.ceil(Math.random() * this.height - 2))] as Point;
        this.exit = exit;
        let findXExit = exit[0];
        for (; findXExit > 0; findXExit--) {
            if (this.canWalkThrough(findXExit, exit[1])) {
                break;
            } else {
                this.setWalkThrough(findXExit, exit[1]);
            }
        }
    }
}

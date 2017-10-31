import { Point, Vector4 } from './2dRoad';
import { gridSize } from './3dRoad';

/**
 * [
 *  [IMapCell, IMapCell, IMapCell],
 *  [IMapCell, IMapCell, IMapCell],
 *  [IMapCell, IMapCell, IMapCell],
 * ]
 *
 * 来构成一个地图
 */
interface IMapCell {
    canWalkThrough: boolean;
    visited: boolean;
    visible: boolean;
    // 到起点的距离
    distance: number;
}

interface ICheckCellInfo {
    x: number;
    y: number;
    cell: IMapCell;
    parentCell: IMapCell;
}

export class RoadMap {
    grid: IMapCell[][];
    width = 0;
    height = 0;

    entrance: Point;
    exit: Point;
    safeZone: Vector4;
    safeZoneSize: number = 3;

    exitDistance: number = 0;

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
                        distance: 0,
                    };
                    row.push(el);
                } else {
                    el.canWalkThrough = false;
                    el.visited = false;
                    el.visible = false;
                    el.distance = 0;
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
    setWalkThrough(x: number, y: number, distance?: number) {
        const el = this.grid[y][x];
        el.canWalkThrough = true;
        if (distance !== undefined) {
            el.distance = distance;
        }
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
    getCell(x: number, y: number) {
        if (this.isInGrid(x, y)) {
            return this.grid[y][x];
        }
        return null;
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

    forEach(walker: (x: number, y: number, cell: IMapCell, index: number) => any) {
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

    setSafeZone(centerX: number, centerY: number) {
        this.safeZone = [
            centerX - this.safeZoneSize, centerY - this.safeZoneSize,
            centerX + this.safeZoneSize, centerY + this.safeZoneSize,
        ];
    }
    getSafeZoneSize() {
        return [
            this.safeZone[0] * gridSize, this.safeZone[1] * gridSize,
            (this.safeZone[2] + 1) * gridSize, (this.safeZone[3] + 1) * gridSize,
        ] as Vector4;
    }

    isInSaveZone(x: number, y: number) {
        const posX = Math.floor(x);
        const posY = Math.floor(y);

        if (!this.isInGrid(x, y)) {
            return false;
        }

        return posX >= this.safeZone[0] && posX <= this.safeZone[2]
            && posY >= this.safeZone[1] && posY <= this.safeZone[3];
    }

    generateRandonRoad(startX = 0, startY = 0) {


        this.resetGrid();
        const waitForCheck = [] as ICheckCellInfo[];
        this.entrance = [startX, startY];
        this.setSafeZone(startX, startY);

        waitForCheck.push({
            x: startX,
            y: startY,
            cell: this.getCell(startX, startY),
            parentCell: null,
        });

        while (waitForCheck.length) {
            // random pop
            let pos: ICheckCellInfo;
            if (Math.random() >= 0.5) {
                pos = waitForCheck.pop();
            } else {
                pos = waitForCheck.shift();
            }

            const nearBy = this.getCheckPos(pos.x, pos.y);

            const blocked = nearBy.filter((nearByPos) => {
                return !this.canWalkThrough(nearByPos.add[0], nearByPos.add[1]) &&
                    !this.canWalkThrough(nearByPos.check[0], nearByPos.check[1]);
            });

            // 这个逻辑有点不对
            if (blocked.length >= nearBy.length - 1) {
                const distance = pos.parentCell ? pos.parentCell.distance + 1 : 0;
                this.setWalkThrough(pos.x, pos.y, distance);
                // random push
                while (blocked.length) {
                    const block = blocked.pop();
                    if (block) {
                        this.setWalkThrough(block.add[0], block.add[1], distance + 1);
                        const newCheckCell = {
                            x: block.check[0],
                            y: block.check[1],
                            cell: this.getCell(block.check[0], block.check[1]),
                            parentCell: this.getCell(block.add[0], block.add[1]),
                        } as ICheckCellInfo;
                        if (Math.random() >= 0.5) {
                            waitForCheck.push(newCheckCell);
                        } else {
                            waitForCheck.unshift(newCheckCell);
                        }
                    }
                }
            }
        }

        const exit = [this.width - 1, Math.max(2, Math.ceil(Math.random() * this.height - 2))] as Point;
        this.exit = exit;
        let findXExit = exit[0];
        const addedExits = [] as IMapCell[];
        let exitJoint: IMapCell;
        for (; findXExit > 0; findXExit--) {
            const cell = this.getCell(findXExit, exit[1]);
            if (this.canWalkThrough(findXExit, exit[1])) {
                exitJoint = cell;
                break;
            } else {
                addedExits.push(cell);
            }
        }
        let exitDistance = exitJoint.distance;
        for (let i = addedExits.length; i > 0; i--) {
            const cell = addedExits[i - 1];
            cell.distance = ++exitDistance;
            cell.canWalkThrough = true;
        }
        this.exitDistance = exitDistance;
    }
}

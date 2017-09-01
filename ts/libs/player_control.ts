import { Point } from './2dRoad';
import { RoadMap } from "./road_map";

export class Player {
    currentPos: Point = [0, 0];

    acceleration: number = 0.1;
    maxSpeed: Point = [0, 0];

    speed: Point = [0, 0];
    size: Point = [0.25, 0.25];

    move(roadMap: RoadMap) {
        const normalizedPos = this.currentPos.map(Math.floor) as Point;
        const around = roadMap.getArround(normalizedPos[0], normalizedPos[1]);

        const premovePos = this.currentPos.map((x, i) => x + this.speed[i]);
        const boundaryDelta = premovePos.map((x, i) => {
            let delta = x - normalizedPos[i];

            if (delta > 1 - this.size[i]) {
                delta += this.size[i];
            }
            if (delta < this.size[i]) {
                delta -= this.size[i];
            }

            return delta;
        });

        const lookUpX = [] as Point[];
        const lookUpY = [] as Point[];

        if (boundaryDelta[0] < 0) {
            lookUpX.push(around[3]);
        }
        if (boundaryDelta[0] > 1) {
            lookUpX.push(around[4]);
        }
        if (boundaryDelta[1] < 0) {
            lookUpY.push(around[1]);
        }
        if (boundaryDelta[1] > 1) {
            lookUpY.push(around[6]);
        }
        if (boundaryDelta[0] < 0 && boundaryDelta[1] < 0) {
            lookUpX.push(around[0]);
            lookUpY.push(around[0]);
        }
        if (boundaryDelta[0] > 1 && boundaryDelta[1] < 0) {
            lookUpX.push(around[2]);
            lookUpY.push(around[2]);
        }
        if (boundaryDelta[0] < 0 && boundaryDelta[1] > 1) {
            lookUpX.push(around[5]);
            lookUpY.push(around[5]);
        }
        if (boundaryDelta[0] > 1 && boundaryDelta[1] > 1) {
            lookUpX.push(around[7]);
            lookUpY.push(around[7]);
        }

        for (let i = 0; i < lookUpX.length; i++) {
            const element = lookUpX[i];
            if (!roadMap.canWalkThrough(element[0], element[1])) {
                premovePos[0] -= boundaryDelta[0];
                if (boundaryDelta[0] > 1) {
                    premovePos[0] += 1;
                }
                break;
            }
        }
        for (let i = 0; i < lookUpY.length; i++) {
            const element = lookUpY[i];
            if (!roadMap.canWalkThrough(element[0], element[1])) {
                premovePos[1] -= boundaryDelta[1];
                if (boundaryDelta[1] > 1) {
                    premovePos[1] += 1;
                }
                break;
            }
        }

        const moveDalta = [
            premovePos[0] - this.currentPos[0],
            premovePos[1] - this.currentPos[1],
        ];

        this.currentPos[0] = premovePos[0];
        this.currentPos[1] = premovePos[1];

        return moveDalta;
    }
    accelerate(dir: Point) {
        this.speed[0] = dir[0] * this.acceleration;
        this.speed[1] = dir[1] * this.acceleration;
    }
}

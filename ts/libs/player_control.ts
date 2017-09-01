import { Point } from './2dRoad';
import { RoadMap } from "./road_map";

interface ICollisionDetector {
    checked: boolean;
}

export class Player {
    currentPos: Point = [0, 0];

    acceleration: number = 0.1;
    maxSpeed: Point = [0, 0];

    speed: Point = [0, 0];
    size: Point = [0.25, 0.25];

    move(roadMap: RoadMap) {
        const normalizedPos = this.currentPos.map(Math.floor) as Point;
        const around = roadMap.getArround(normalizedPos[0], normalizedPos[1]) as Array<Point & ICollisionDetector>;


        const premovePos = this.currentPos.map((x, i) => x + this.speed[i]);

        // 获取移动后中心相对当前所在方块的偏移量
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

        let lookUpX: Point & ICollisionDetector;
        let lookUpY: Point & ICollisionDetector;
        let commonCheck: Point & ICollisionDetector;
        let commonCheckCondition: (delta: Point) => boolean;

        // 检查周围八个方块是否需要进行碰撞
        if (boundaryDelta[0] < 0) {
            lookUpX = around[3];
        }
        if (boundaryDelta[0] > 1) {
            lookUpX = around[4];
        }
        if (boundaryDelta[1] < 0) {
            lookUpY = around[1];
        }
        if (boundaryDelta[1] > 1) {
            lookUpY = around[6];
        }
        if (boundaryDelta[0] < 0 && boundaryDelta[1] < 0) {
            commonCheckCondition = (delta: Point) => delta[0] < 0 && delta[1] < 0;
            commonCheck = around[0];
        }
        if (boundaryDelta[0] > 1 && boundaryDelta[1] < 0) {
            commonCheckCondition = (delta: Point) => delta[0] > 1 && delta[1] < 0;
            commonCheck = around[2];
        }
        if (boundaryDelta[0] < 0 && boundaryDelta[1] > 1) {
            commonCheckCondition = (delta: Point) => delta[0] < 0 && delta[1] > 1;
            commonCheck = around[5];
        }
        if (boundaryDelta[0] > 1 && boundaryDelta[1] > 1) {
            commonCheckCondition = (delta: Point) => delta[0] > 1 && delta[1] > 1;
            commonCheck = around[7];
        }

        // 进行十字方向上的碰撞
        if (lookUpX && !roadMap.canWalkThrough(lookUpX[0], lookUpX[1])) {
            premovePos[0] -= boundaryDelta[0];
            if (boundaryDelta[0] > 1) {
                premovePos[0] += 1;
            }
        }
        if (lookUpY && !roadMap.canWalkThrough(lookUpY[0], lookUpY[1])) {
            premovePos[1] -= boundaryDelta[1];
            if (boundaryDelta[1] > 1) {
                premovePos[1] += 1;
            }
        }
        // 十字方向碰撞完成后检查修正后的偏移量
        if (commonCheck && !roadMap.canWalkThrough(commonCheck[0], commonCheck[1])) {
            const recaculateDelta = premovePos.map((x, i) => {
                let delta = x - normalizedPos[i];

                if (delta > 1 - this.size[i]) {
                    delta += this.size[i];
                }
                if (delta < this.size[i]) {
                    delta -= this.size[i];
                }

                return delta;
            }) as Point;

            if (commonCheckCondition(recaculateDelta)) {
                // 检查四个角的碰撞是否需要修正
                if (recaculateDelta[0] < 0 || recaculateDelta[0] > 1) {
                    premovePos[0] -= recaculateDelta[0];
                    if (boundaryDelta[0] > 1) {
                        premovePos[0] += 1;
                    }
                }
                if (recaculateDelta[1] < 0 || recaculateDelta[1] > 1) {
                    premovePos[1] -= recaculateDelta[1];
                    if (boundaryDelta[1] > 1) {
                        premovePos[1] += 1;
                    }
                }
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

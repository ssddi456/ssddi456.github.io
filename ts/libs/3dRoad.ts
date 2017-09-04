import { RoadMap } from "./road_map";
import { IFace, IRoadMesh, IVertex, Vector3, Point, FacesToMesh, Color } from "./2dRoad";

const gridSize = 1;
export class Mesh3dRoad {
    roadMap: RoadMap;
    constructor(roadMap: RoadMap) {
        this.roadMap = roadMap;
    }
    getMesh() {
        const roadMap = this.roadMap;

        const jointFaces = [] as IFace[];
        const wallColorMap = {};


        function getWallColor(x, y) {
            const wallColorIndex = x + ',' + y;
            if (!(wallColorIndex in wallColorMap)) {
                wallColorMap[wallColorIndex] = Math.floor(Math.random() * wallColors.length);
            }
            return wallColorMap[wallColorIndex];
        }

        roadMap.forEach((wayPosX, wayPosY) => {
            const top = wayPosX * gridSize;
            const left = wayPosY * gridSize;
            const bottom = (wayPosX + 1) * gridSize;
            const right = (wayPosY + 1) * gridSize;

            if (!roadMap.canWalkThrough(wayPosX, wayPosY)) {
                const wallColorIndex = getWallColor(wayPosX, wayPosY);

                jointFaces.push(createTopSquare(
                    top,
                    left,
                    bottom,
                    right,
                    gridSize,
                    wallColors[wallColorIndex],
                ));

                return;
            }

            let groundUseColor = groundColor;
            if (wayPosX === roadMap.entrance[0]
                && wayPosY === roadMap.entrance[1]
            ) {
                groundUseColor = entranceColor;
            } else if (
                wayPosX === roadMap.exit[0]
                && wayPosY === roadMap.exit[1]
            ) {
                groundUseColor = exitColor;
            }

            jointFaces.push(createTopSquare(
                top,
                left,
                bottom,
                right,
                0,
                groundUseColor,
            ));

            const nearBys = this.roadMap.getNearBy(wayPosX, wayPosY);
            nearBys.forEach((nearBy) => {
                if (!this.roadMap.canWalkThrough(nearBy[0], nearBy[1])) {

                    const wallColorIndex = getWallColor(nearBy[0], nearBy[1]);
                    const wallUseColor = wallColors[wallColorIndex];

                    if (nearBy[0] === wayPosX) {
                        if (nearBy[1] > wayPosY) {
                            // create front
                            jointFaces.push(createFrontSquare(top, right, bottom, BackZAxis, wallUseColor));
                        } else if (nearBy[1] < wayPosY) {
                            // create back
                            jointFaces.push(createFrontSquare(bottom, left, top, FrontZAxis, wallUseColor));
                        }
                    } else if (nearBy[1] === wayPosY) {
                        if (nearBy[0] > wayPosX) {
                            // create right
                            jointFaces.push(createSideSquare(bottom, right, left, LeftXAxis, wallUseColor));
                        } else if (nearBy[0] < wayPosX) {
                            // create left
                            jointFaces.push(createSideSquare(top, left, right, RightXAxis, wallUseColor));
                        }
                    }
                }
            });
        });

        return FacesToMesh(jointFaces);
    }
}

const UpYAxis = [0, 1, 0] as Vector3;
const LeftXAxis = [-1, 0, 0] as Vector3;
const RightXAxis = [1, 0, 0] as Vector3;
const FrontZAxis = [0, 0, 1] as Vector3;
const BackZAxis = [0, 0, -1] as Vector3;

const wallColors = [[0.6875, 0.41796875, 0.4375, 0.4],
[0.95703125, 0.8515625, 0.80859375, 0.4],
[0.71484375, 0.8203125, 0.55078125, 0.4],
[0.91015625, 0.984375, 0.7265625, 0.4],
[0.6015625, 0.6796875, 0.44921875, 0.4],
[0.96875, 0.62890625, 0.421875, 0.4],
[0.81640625, 0.6640625, 0.76953125, 0.4],
[0.609375, 0.55859375, 0.67578125, 0.4],
[0.8671875, 0.78515625, 0.953125, 0.4],
[0.54296875, 0.47265625, 0.42578125, 0.4],
[0.984375, 0.875, 0.8203125, 0.4],
[0.53515625, 0.5390625, 0.41796875, 0.4],
[0.9921875, 0.98046875, 0.8046875, 0.4],
[0.52734375, 0.52734375, 0.39453125, 0.4],
[0.7890625, 0.92578125, 0.91015625, 0.4],
[0.51953125, 0.55859375, 0.5625, 0.4],
[0.796875, 0.921875, 0.83984375, 0.4],
[0.57421875, 0.69921875, 0.60546875, 0.4],
[0.92578125, 0.90234375, 0.81640625, 0.4],
[0.80078125, 0.6640625, 0.5859375, 0.4],
[0.99609375, 0.9765625, 0.87109375, 0.4],
[0.859375, 0.7421875, 0.609375, 0.4],
[0.99609375, 0.921875, 0.859375, 0.4],
[0.87890625, 0.61328125, 0.671875, 0.4],
[0.91796875, 0.8515625, 0.4921875, 0.4],
[0.80859375, 0.55859375, 0.453125, 0.4],
[0.9765625, 0.875, 0.43359375, 0.4],
[0.72265625, 0.5234375, 0.44140625, 0.4],
[0.9296875, 0.625, 0.5859375, 0.4],
[0.98046875, 0.9453125, 0.44140625, 0.4],
[0.859375, 0.5234375, 0.45703125, 0.4]] as Color[];

// alpha 通道用来
const entranceColor = [0, 0, 1, 0.5] as Color;
const exitColor = [0, 1, 0, 0.5] as Color;
const wallColor = [1, 0.1, 0, 0.6] as Color;
const groundColor = [0, 0, 0, 0.2] as Color;

const frontColor = [1.0, 1.0, 1.0, 1.0] as Color;
const backColor = [1.0, 0.0, 0.0, 1.0] as Color;
const topColor = [0.0, 1.0, 0.0, 1.0] as Color;
const bottomColor = [0.0, 0.0, 1.0, 1.0] as Color;
const rightColor = [1.0, 1.0, 0.0, 1.0] as Color;
const leftColor = [1.0, 0.0, 1.0, 1.0] as Color;

/**
 * @file 用于构造一个随机生成的3D迷宫。
 *
 * 主题1 糖果屋
 * 元素 棒棒糖 姜饼 拐杖糖 甜甜圈
 *
 * 主题2 星际争霸 虫巢
 * 元素 菌摊 蟑螂 孵化场 跳虫 触手
 */

const textureCoordinatePreset = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
] as Point[];

function createSquare(vertexes: IVertex[]) {
    const ret: IFace = {
        vertexes,
        indexes: [],
    };

    for (let start = 1; start < ret.vertexes.length - 1; start++) {
        ret.indexes.push(0);
        ret.indexes.push(start);
        ret.indexes.push(start + 1);
    }
    return ret;
}
function createTopSquare(top: number, left: number, bottom: number, right: number, height: number, vertexColor: Color) {

    /**
     * 在这里我们假设 Y坐标为零,
     * 法线方向指向Y坐标轴正方向
     */
    const vertexes = [

        {
            pos: [top, height, left] as Vector3,
            normal: UpYAxis,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[0],
        },
        {
            pos: [bottom, height, left] as Vector3,
            normal: UpYAxis,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[1],
        },
        {
            pos: [bottom, height, right] as Vector3,
            normal: UpYAxis,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[2],
        },
        {
            pos: [top, height, right] as Vector3,
            normal: UpYAxis,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[3],
        },
    ];

    return createSquare(vertexes);
}

function createFrontSquare(top: number, left: number, bottom: number, normal: Vector3, vertexColor: Color) {
    const vertexes = [
        {
            pos: [top, 0, left] as Vector3,
            normal,
            textureCoordinate: textureCoordinatePreset[0],
            vertexColor,
        },
        {
            pos: [top, gridSize, left] as Vector3,
            normal,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[1],
        },
        {
            pos: [bottom, gridSize, left] as Vector3,
            normal,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[2],
        },
        {
            pos: [bottom, 0, left] as Vector3,
            normal,
            vertexColor,
            textureCoordinate: textureCoordinatePreset[3],
        },
    ];

    return createSquare(vertexes);
}

function createSideSquare(top: number, left: number, right: number, normal: Vector3, vertexColor: Color) {
    const vertexes = [
        {
            pos: [top, 0, left] as Vector3,
            normal,
            textureCoordinate: textureCoordinatePreset[0],
            vertexColor,
        },
        {
            pos: [top, gridSize, left] as Vector3,
            normal,
            textureCoordinate: textureCoordinatePreset[1],
            vertexColor,
        },
        {
            pos: [top, gridSize, right] as Vector3,
            normal,
            textureCoordinate: textureCoordinatePreset[2],
            vertexColor,
        },
        {
            pos: [top, 0, right] as Vector3,
            normal,
            textureCoordinate: textureCoordinatePreset[3],
            vertexColor,
        },
    ];
    return createSquare(vertexes);
}

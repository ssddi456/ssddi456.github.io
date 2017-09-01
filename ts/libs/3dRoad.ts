import { RoadMap } from "./roadMap";
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

        roadMap.forEach((wayPosX, wayPosY) => {
            const top = wayPosX * gridSize;
            const left = wayPosY * gridSize;
            const bottom = (wayPosX + 1) * gridSize;
            const right = (wayPosY + 1) * gridSize;

            if (!roadMap.canWalkThrough(wayPosX, wayPosY)) {


                jointFaces.push(createTopSquare(
                    top,
                    left,
                    bottom,
                    right,
                    gridSize,
                    wallColor,
                ));

                return;
            }


            jointFaces.push(createTopSquare(
                top,
                left,
                bottom,
                right,
                0,
                groundColor,
            ));

            const nearBys = this.roadMap.getNearBy(wayPosX, wayPosY);
            nearBys.forEach((nearBy) => {
                if (!this.roadMap.canWalkThrough(nearBy[0], nearBy[1])) {
                    if (nearBy[0] === wayPosX) {
                        if (nearBy[1] > wayPosY) {
                            // create front
                            jointFaces.push(createFrontSquare(top, right, bottom, BackZAxis, wallColor));
                        } else if (nearBy[1] < wayPosY) {
                            // create back
                            jointFaces.push(createFrontSquare(bottom, left, top, FrontZAxis, wallColor));
                        }
                    } else if (nearBy[1] === wayPosY) {
                        if (nearBy[0] > wayPosX) {
                            // create right
                            jointFaces.push(createSideSquare(bottom, right, left, LeftXAxis, wallColor));
                        } else if (nearBy[0] < wayPosX) {
                            // create left
                            jointFaces.push(createSideSquare(top, left, right, RightXAxis, wallColor));
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

const wallColor = [1, 0.1, 0, 1] as Color;
const groundColor = [0, 0, 0, 1] as Color;

const frontColor = [1.0, 1.0, 1.0, 1.0] as Color;
const backColor = [1.0, 0.0, 0.0, 1.0] as Color;
const topColor = [0.0, 1.0, 0.0, 1.0] as Color;
const bottomColor = [0.0, 0.0, 1.0, 1.0] as Color;
const rightColor = [1.0, 1.0, 0.0, 1.0] as Color;
const leftColor = [1.0, 0.0, 1.0, 1.0] as Color;



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

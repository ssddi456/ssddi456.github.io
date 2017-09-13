import { RoadMap } from "./road_map";

export type Point = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export type Color = Vector4;
export type Matrix4x4 = [Vector4, Vector4, Vector4, Vector4];

export interface IMeshInfo {
    vertexs: number[];
    faces: number[];
    vertexNormal?: number[];
    textureCoordinates?: number[];
    vertexColors?: number[];
}

export interface IVertex {
    pos: Vector3;
    normal?: Vector3;
    textureCoordinate?: Point;
    textureCoordinateIndex?: number;
    vertexColor?: Vector3;
}
export interface IFace {
    vertexes: IVertex[];
    indexes: number[];
}

export class Mesh2dRoad {
    gridSize = 1;
    roadMap: RoadMap;
    constructor(roadMap: RoadMap) {
        this.roadMap = roadMap;
    }
    getMesh() {
        const joints = this.roadMap.getAllWalkThrough();
        const jointFaces = joints.map((jointPos) => {
            return createSquare(
                jointPos[0] * this.gridSize,
                jointPos[1] * this.gridSize,
                (jointPos[0] + 1) * this.gridSize,
                (jointPos[1] + 1) * this.gridSize,
            );
        });

        return facesToMesh(jointFaces);
    }
}

const UpYAxix = [0, 1, 0] as Vector3;
const textureCoordinatePreset = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
] as Point[];

function createSquare(top: number, left: number, bottom: number, right: number) {
    const ret: IFace = {
        vertexes: [],
        indexes: [],
    };
    /**
     * 在这里我们假设 Y坐标为零,
     * 法线方向指向Y坐标轴正方向
     */

    ret.vertexes.push({
        pos: [top, 0, left] as Vector3,
        normal: UpYAxix,
        textureCoordinate: textureCoordinatePreset[0],
    });
    ret.vertexes.push({
        pos: [bottom, 0, left] as Vector3,
        normal: UpYAxix,
        textureCoordinate: textureCoordinatePreset[1],
    });
    ret.vertexes.push({
        pos: [bottom, 0, right] as Vector3,
        normal: UpYAxix,
        textureCoordinate: textureCoordinatePreset[2],
    });
    ret.vertexes.push({
        pos: [top, 0, right] as Vector3,
        normal: UpYAxix,
        textureCoordinate: textureCoordinatePreset[3],
    });

    for (let start = 1; start < ret.vertexes.length - 1; start++) {
        ret.indexes.push(0);
        ret.indexes.push(start);
        ret.indexes.push(start + 1);
    }
    return ret;
}

export function facesToMesh(faces: IFace[]) {
    let pointCounter = 0;

    const ret: IMeshInfo = {
        vertexs: [],
        faces: [],
        vertexNormal: [],
        textureCoordinates: [],
        vertexColors: [],
    };

    for (let index = 0; index < faces.length; index++) {
        const face = faces[index];
        const faceStartIndex = pointCounter;

        for (let indexVertex = 0; indexVertex < face.vertexes.length; indexVertex++) {
            const vertex = face.vertexes[indexVertex];

            ret.vertexs.push(vertex.pos[0]);
            ret.vertexs.push(vertex.pos[1]);
            ret.vertexs.push(vertex.pos[2]);

            if (vertex.normal) {
                ret.vertexNormal.push(vertex.normal[0]);
                ret.vertexNormal.push(vertex.normal[1]);
                ret.vertexNormal.push(vertex.normal[2]);
            }

            if (vertex.textureCoordinate) {
                vertex.textureCoordinateIndex = ret.textureCoordinates.length;
                ret.textureCoordinates.push(vertex.textureCoordinate[0]);
                ret.textureCoordinates.push(vertex.textureCoordinate[1]);
            }

            if (vertex.vertexColor) {
                ret.vertexColors.push(vertex.vertexColor[0]);
                ret.vertexColors.push(vertex.vertexColor[1]);
                ret.vertexColors.push(vertex.vertexColor[2]);
                ret.vertexColors.push(vertex.vertexColor[3]);
            }

            pointCounter++;
        }

        for (let indexFaceIndex = 0; indexFaceIndex < face.indexes.length; indexFaceIndex++) {
            ret.faces.push(faceStartIndex + face.indexes[indexFaceIndex]);
        }
    }

    for (let i = 0; i < faces.length; i++) {
        const element = faces[i];
    }
    return ret;
}

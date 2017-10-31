import { IFace, facesToMesh, Vector3, Point } from './2dRoad';
import { createTopSquare, gridSize, groundColor } from './3dRoad';

export class Plane {
    width: number = 1;
    height: number = 1;
    getMesh() {
        const plane = [
            createTopSquare(
                0, 0,
                (this.width) * gridSize,
                (this.height) * gridSize,
                -0.1,
                groundColor,
            ),
        ] as IFace[];
        return facesToMesh(plane);
    }
}

const pos = [
    [-1, 1, 0],
    [-1, -1, 0],
    [1, -1, 0],
    [1, 1, 0],
] as Vector3[];
const textcoords = [
    [0, 1],
    [0, 0],
    [1, 0],
    [1, 1],
] as Point[];

export class ClipSpacePlane {
    static getMesh() {
        const face = createTopSquare(0, 0, -1, -1, 0, groundColor);
        face.vertexes.forEach((vertex, i) => {
            vertex.pos = pos[i];
            vertex.textureCoordinate = textcoords[i];
        });
        return facesToMesh([face]);
    }
}

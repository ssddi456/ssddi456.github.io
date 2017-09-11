import { IFace, facesToMesh } from "./2dRoad";
import { createTopSquare, gridSize, groundColor } from "./3dRoad";

export class Plane {
    width: number = 1;
    height: number = 1;
    getMesh() {
        const plane = [
            createTopSquare(
                0, 0,
                (this.width) *gridSize,
                (this.height) *gridSize,
                -0.1,
                groundColor,
            ),
        ] as IFace[];
        return facesToMesh(plane);
    }
}
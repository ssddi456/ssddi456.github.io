import { Player } from "./player_control";
import { RoadMap } from "./road_map";
import { getBBox, boxCollision, randomItem } from "./utils";
import { Point } from "./2dRoad";
import { gridSize } from "./3dRoad";
import { Mesh } from "../mesh";
import { Cube } from "./cube";
import { VertexColorShader } from "../shaders/vertex_color_shader";

export const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
] as Point[];

export class Wanderer extends Player {
    acceleration: number = 0.05;
    mesh: Mesh;
    moveSize: Point = [gridSize, gridSize];
    constructor() {
        super();
        this.randomDirection();
        this.mesh = new Mesh();
        this.mesh.shader = new VertexColorShader();
        const cubeTransFormer = new Cube();
        this.mesh.updateMeshInfo(cubeTransFormer.getMesh());
    }
    move(roadMap: RoadMap) {
        const safeZone = roadMap.getSafeZoneSize();
        const premovePos = this.currentPos.map((x, i) => x + this.speed[i]) as Point;
        const premoveBBox = getBBox(premovePos, this.moveSize);
        const hitSafeZone = boxCollision(premoveBBox, safeZone);

        const delta = super.move(roadMap);

        if (hitSafeZone) {
            this.speed.forEach((x) => -1 * x);
        } else {
            if (
                delta[0] / this.speed[0] < 1 ||
                delta[1] / this.speed[1] < 1
            ) {
                this.randomDirection();
            }
        }

        return delta;
    }
    moveTo(pos: Point, world) {
        const delta = [pos[0] - this.currentPos[0], pos[1] - this.currentPos[1]];
        this.currentPos[0] = pos[0];
        this.currentPos[1] = pos[1];

        this.mesh.x(Matrix.Translation($V([
            delta[0],
            0,
            delta[1],
        ])));
    }
    randomDirection() {
        this.speed = randomItem(directions).map((x) => x * this.acceleration) as Point;
    }
}

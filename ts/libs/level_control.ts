import { Mesh3dRoad } from './3dRoad';
import { Player } from './player_control';
import { Mesh } from '../mesh';
import { RoadMap } from './road_map';
import { Camara, World } from "../world";
import { wrapIterableIterator, createBuffer, forEachVectorArray, randomItem } from './utils';
import { Shader } from '../shaders/base_shader';
import { IMeshInfo } from './2dRoad';
import { Wanderer } from './wanderer';
import { CubeWithFogShader } from '../shaders/cube_with_fog';

/**
 * @file 关卡管理
 *
 * 过关后生成新关卡
 * 当前过关信息
 * 难度控制
 *   1 生成算法
 *   2 地图大小
 *   3 演出效果
 */

class MeshWithFog extends Mesh {
    fog: number[];
    fogBuffer: WebGLBuffer;
    init(gl: WebGLRenderingContext, world: World) {
        super.init(gl, world);

        this.fog = this.textureCoordinates.map((x) => 1);

        this.fogBuffer = createBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fogBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fog), gl.STATIC_DRAW);
    }
    updateMeshInfo(meshInfo: IMeshInfo) {
        super.updateMeshInfo(meshInfo);
        this.fog = this.textureCoordinates.map((x) => 1);
    }
    clone<T extends MeshWithFog>() {
        const ret = super.clone<T>();
        ret.fog = this.fog.slice();
        return ret;
    }
    rebuffering(gl: WebGLRenderingContext, world: World, attribute?: string) {
        super.rebuffering(gl, world, attribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fogBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fog), gl.STATIC_DRAW);
    }
    bindBufferAndDraw(shader: Shader, gl) {
        shader.bindBuffer('aFog', this.fogBuffer);
        super.bindBufferAndDraw(shader, gl);
    }

}

const fogChanging = 1 / 20; // 迷雾的渐变速度
export class LevelControler {
    currentLevel = 1;
    maze: RoadMap;
    mazeMesh: MeshWithFog;
    player: Player;
    meshTranseformer: Mesh3dRoad;
    transformLevel?: () => any;
    levelInitialed: boolean = false;

    wanderers: Wanderer[] = [];
    wanderersPool: Wanderer[] = [];

    constructor(player: Player) {
        this.player = player;

        this.maze = new RoadMap(10, 10);
        this.meshTranseformer = new Mesh3dRoad(this.maze);
        this.mazeMesh = new MeshWithFog();

        this.mazeMesh.textureSrc = '/images/white.jpg';
        this.mazeMesh.shader = new CubeWithFogShader();
    }
    update(world: World) {
        const pos = this.player.currentPos.map(Math.floor);
        const visibles = this.maze.getArround(pos[0], pos[1], this.player.sightRange)
            .filter((x) => this.maze.isInGrid(x[0], x[1]))
            .map((x) => this.maze.posToIndex(x[0], x[1]));

        visibles.push(this.maze.posToIndex(pos[0], pos[1]));
        this.wanderers.forEach((wanderer) => {
            const delta = wanderer.move(this.maze);
            wanderer.mesh.x(Matrix.Translation($V([
                delta[0],
                0,
                delta[1],
            ])));
        });

        this.meshTranseformer.faces.forEach((face) => {
            const cellpos = this.maze.indexToPos(face.index);
            const cell = this.maze.getCell(cellpos[0], cellpos[1]);

            if (visibles.indexOf(face.index) !== -1) {
                cell.visible = true;
                cell.visited = true;
            } else {
                cell.visible = false;
            }

            let targetVal = 0;
            if (cell.visible) {
                targetVal = 1;
            } else if (cell.visited) {
                targetVal = 0.3;
            } else {
                targetVal = 0;
            }

            if (cellpos[0] === this.maze.exit[0] && cellpos[1] === this.maze.exit[1]) {
                targetVal = 1;
            }

            const fogIndex = 0;
            const fog = this.mazeMesh.fog;
            const oldFog = fog[face.vertexes[0].textureCoordinateIndex];

            if (oldFog !== targetVal) {
                const delta = targetVal - oldFog;
                let newVal: number = targetVal;
                if (Math.abs(delta) > fogChanging) {
                    newVal = oldFog + (targetVal > oldFog ? 1 : -1) * fogChanging;
                }
                for (let faceVertexIndex = 0; faceVertexIndex < face.vertexes.length; faceVertexIndex++) {
                    fog[face.vertexes[faceVertexIndex].textureCoordinateIndex] = newVal;
                }
            }
        });
    }

    passLevel() {
        this.currentLevel += 1;
        this.levelInitialed = false;
        // 应该在这里庆祝一下
        this.playAnima(this.passLevelAnima);
    }
    get hardness() {
        return Math.max(Math.floor(Math.log10(this.currentLevel) * 3), 3);
    }
    playAnima(anima: () => IterableIterator<any>) {
        const self = this;
        this.transformLevel = wrapIterableIterator(function* () {
            const ticks = anima.call(self);
            let tick;
            do {
                tick = ticks.next();
                yield tick.value;
            } while (!tick.done);

            self.transformLevel = undefined;
        });
    }

    *startLevelAnima() {
        const frames = 1 * 15;
        const delta = (0.1 + 1.3) / frames;
        for (let i = 0; i < frames; i++) {
            yield this.mazeMesh.x(Matrix.Translation($V([0, delta, 0])));
        }
    }
    *passLevelAnima() {
        const frames = 1 * 15;
        const delta = -1 * (0.1 + 1.3) / frames;
        for (let i = 0; i < frames; i++) {
            yield this.mazeMesh.x(Matrix.Translation($V([0, delta, 0])));
        }
    }
    reset() {
        this.levelInitialed = false;
        this.player.currentPos[0] = 0;
        this.player.currentPos[1] = 0;
    }

    levelStart(world: World) {
        const gl = world.gl;

        this.maze.width = 4 * this.hardness + this.currentLevel;
        this.maze.height = 3 * this.hardness + Math.round(this.currentLevel * 0.75);

        const startX = Math.floor(Math.random() * this.maze.width / 2);
        const startY = Math.floor(Math.random() * this.maze.height / 2);

        this.player.resetPos(startX + 0.5, startY + 0.5);
        this.maze.generateRandonRoad(startX, startY);
        const meshInfo = this.meshTranseformer.getMesh();

        this.mazeMesh.updateMeshInfo(meshInfo);

        const walkThroughs = this.maze.getAllWalkThrough();

        let wanderer: Wanderer;
        if (!this.wanderers.length) {
            wanderer = new Wanderer();
            world.attachObject(wanderer.mesh);

            this.wanderers.push(wanderer);
        } else {
            wanderer = this.wanderers[0];
        }

        let wandererPos = randomItem(walkThroughs);
        while (this.maze.isInSaveZone(wandererPos[0], wandererPos[1])) {
            wandererPos = randomItem(walkThroughs);
        }

        wanderer.moveTo(wandererPos, world);

        this.levelInitialed = true;
        if (this.currentLevel > 1) {
            this.playAnima(this.startLevelAnima);
        }
    }

    levelPass() {
        this.passLevel();
    }
}

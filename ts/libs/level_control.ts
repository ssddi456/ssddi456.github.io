import { Mesh3dRoad } from './3dRoad';
import { CubeWithTextureAndLightingShader } from '../shaders/cube_with_texture_and_lighting_shader';
import { Player } from './player_control';
import { Mesh } from '../mesh';
import { RoadMap } from './road_map';
import { Camara } from "../world";
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

export class LevelControler {
    currentLevel = 1;
    maze: RoadMap;
    mazeMesh: Mesh;
    player: Player;
    meshTranseformer: Mesh3dRoad;
    transformLevel: Promise<void>;

    constructor(player: Player) {
        this.player = player;

        this.maze = new RoadMap(10, 10);
        this.meshTranseformer = new Mesh3dRoad(this.maze);
        this.mazeMesh = new Mesh();

        this.mazeMesh.textureSrc = '/images/white.jpg';
        this.mazeMesh.shader = new CubeWithTextureAndLightingShader();
    }
    passLevel() {
        this.currentLevel += 1;
        // 应该在这里庆祝一下
    }
    get hardness() {
        return Math.min(Math.floor(this.currentLevel / 10), 10);
    }

    async levelStart() {
        const startX = 0;
        const startY = 0;
        this.player.resetPos(startX, startY);

        // 先不管这个难度
        this.maze.height = this.maze.width = Math.max(10, Math.floor(Math.log10(this.hardness * 5)));
        //
        this.maze.width = 24;
        this.maze.height = 20;

        this.maze.generateRandonRoad(startX, startY);
        const meshInfo = this.meshTranseformer.getMesh();

        this.mazeMesh.debug = false;
        this.mazeMesh.visible = true;
        this.mazeMesh.vertices = meshInfo.vertexs;
        this.mazeMesh.faces = meshInfo.faces;

        if (meshInfo.vertexColors.length) {
            this.mazeMesh.vertexColors = meshInfo.vertexColors;
        }
        if (meshInfo.vertexNormal.length) {
            this.mazeMesh.vertexNormal = meshInfo.vertexNormal;
        }
        if (meshInfo.textureCoordinates.length) {
            this.mazeMesh.textureCoordinates = meshInfo.textureCoordinates;
        }
    }

    levelPass() {
        this.passLevel();
        this.levelStart();
    }
}

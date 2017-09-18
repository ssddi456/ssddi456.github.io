import { Vector3, Point } from './libs/2dRoad';
import { Mesh3dRoad } from './libs/3dRoad';
import { LineVertexColorShader } from './shaders/line_vertex_color_shader';
import { World, Camara } from './world';

import { VertexColorShader } from './shaders/vertex_color_shader';
import { CubeWithTextureShader } from './shaders/cube_with_texture_shader';
import { CubeWithTextureAndLightingShader } from './shaders/cube_with_texture_and_lighting_shader';
import { Light } from "./light";
import { Mesh } from "./mesh";
import { Line } from "./line";
import { RoadMap } from "./libs/road_map";
import { Plane } from "./libs/plane";
import { Cube } from "./libs/cube";
import { Player } from "./libs/player_control";
import { LevelControler } from "./libs/level_control";
import { loopFactory } from './libs/utils';

const main = $('#main')[0] as HTMLCanvasElement;
const elBBox = main.getClientRects()[0];
const size = { width: elBBox.width, height: elBBox.width * 0.75 };

$('#main').css({
    width: size.width,
    height: size.height,
});

main.width = size.width;
main.height = size.height;

const context = main.getContext('webgl');
if (!context) {
    throw new Error('create webgl context failed');
}
const world = new World(context, size);

const mainCamara = new Camara();
mainCamara.height = size.height;
mainCamara.width = size.width;
world.camara = mainCamara;

const skyLight = new Light();

skyLight.direction = [1, 2, 1];
skyLight.color = [0.5, 0.5, 0.5];
skyLight.debug = false;

const cubeTemplate = new Mesh();
cubeTemplate.visible = true;
const cubeTransFormer = new Cube();
cubeTemplate.updateMeshInfo(cubeTransFormer.getMesh());

const cubeShader = new VertexColorShader();
cubeTemplate.shader = cubeShader;

const dummyPlayerControl = new Player();
const dummyPlayer = cubeTemplate.clone();
dummyPlayer.vertices.forEach((v, i) => {
    if (i % 3 === 1) {
        if (v < 0) {
            dummyPlayer.vertices[i] = 0;
            return;
        }
    }
    dummyPlayer.vertices[i] *= 0.25;
});


const levelControler = new LevelControler(dummyPlayerControl);
levelControler.levelStart(world);

const clampFloor = new Mesh();
clampFloor.shader = levelControler.mazeMesh.shader;
const clampFloorPlane = new Plane();
clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
clampFloor.x(Matrix.Translation($V([0, -0.1, 0])));

async function loadShapes() {

    world.attachLight(skyLight);
    [
        levelControler.mazeMesh,
        dummyPlayer,
        clampFloor,
    ].map((x) => world.attachObject(x));

    await Promise.all([
        levelControler.mazeMesh.loadTexture(world.gl),
    ]);
}

mainCamara.eye = [11.5, 26, 9.5];
mainCamara.center = [11.5, 0, 9.5];
mainCamara.up = [0, 0, -1];

const dirLeft = [1, 0];
const dirRight = [-1, 0];
const dirFront = [0, 1];
const dirBack = [0, -1];
const currentDir = [0, 0] as Point;

const accelarateControlMap = {
    A: dirRight,
    D: dirLeft,
    S: dirFront,
    W: dirBack,
};

dummyPlayerControl.on('enterExit', () => {
    levelControler.levelPass();
});

const drawFrequant = 30;

const updateLoop = loopFactory(function () {
    if (levelControler.transformLevel) {
        // console.log('transform');

        // 在别处实现动画逻辑
        levelControler.transformLevel();
    } else if (!levelControler.levelInitialed) {
        // console.log('init level');

        const postPos = dummyPlayerControl.currentPos.slice();

        levelControler.levelStart(world);
        levelControler.mazeMesh.rebuffering(world.gl, world);

        clampFloorPlane.width = levelControler.maze.width;
        clampFloorPlane.height = levelControler.maze.height;
        clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
        clampFloor.rebuffering(world.gl, world);

        dummyPlayer.x(Matrix.Translation($V([
            dummyPlayerControl.currentPos[0] - postPos[0],
            0,
            dummyPlayerControl.currentPos[1] - postPos[1],
        ])));

        const centerX = levelControler.maze.width / 2;
        const centerY = levelControler.maze.height / 2;
        const centerHeight = levelControler.maze.width + 4;

        mainCamara.eye = [centerX, centerHeight, centerY];
        mainCamara.center = [centerX, 0, centerY];

    } else {
        // console.log('play level');

        dummyPlayerControl.accelerate(currentDir);
        const deltaPos = dummyPlayerControl.move(levelControler.maze);
        dummyPlayer.x(Matrix.Translation($V([deltaPos[0], 0, deltaPos[1]])));

        levelControler.update(world);
        levelControler.mazeMesh.rebuffering(world.gl, world);
    }
}, 1000 / drawFrequant);

const drawLoop = loopFactory(function () {
    world.render();
}, 1000 / drawFrequant);

loadShapes().then(function () {
    levelControler.reset();
    updateLoop();
    drawLoop();
});

const keyPressedMap = {};

document.body.addEventListener('keydown', function (e) {
    let delta;
    const key = String.fromCharCode(e.keyCode);
    if (keyPressedMap[key]) {
        return;
    }
    keyPressedMap[key] = true;
    delta = accelarateControlMap[key];
    if (!delta) {
        return;
    }
    currentDir.forEach((x, i) => currentDir[i] += delta[i]);
}, true);

document.body.addEventListener('keyup', function (e) {
    let delta;
    const key = String.fromCharCode(e.keyCode);
    if (!keyPressedMap[key]) {
        return;
    }
    keyPressedMap[key] = false;
    delta = accelarateControlMap[key];
    if (!delta) {
        return;
    }
    currentDir.forEach((x, i) => currentDir[i] -= delta[i]);
}, true);

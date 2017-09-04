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
import { Player } from "./libs/player_control";
import { LevelControler } from "./libs/level_control";

const main = $('#main')[0] as HTMLCanvasElement;
const size = main.getClientRects()[0];

main.height = size.height;
main.width = size.width;

const world = new World(main.getContext('webgl'), size);

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

const cubeShader = new VertexColorShader();

cubeTemplate.shader = cubeShader;
cubeTemplate.vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
];

cubeTemplate.vertexColors = [].concat.apply([], [
    [1.0, 1.0, 1.0, 1.0],    // Front face: white
    [1.0, 0.0, 0.0, 1.0],    // Back face: red
    [0.0, 1.0, 0.0, 1.0],    // Top face: green
    [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
    [1.0, 0.0, 1.0, 1.0],     // Left face: purple
].reduce((pre, cur) => {
    for (let index = 0; index < 4; index++) {
        pre.push(cur);
    }
    return pre;
}, [] as number[][]));

cubeTemplate.faces = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23,    // left
];
cubeTemplate.vertexNormal = [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
];
cubeTemplate.trs = Matrix.I(4);

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
levelControler.levelStart();

async function loadShapes() {

    world.attachLight(skyLight);

    await Promise.all([
        levelControler.mazeMesh,
        dummyPlayer,
    ].map((x) => world.attachObject(x)));
}

let startTime = 0;
const interval = 1000 / 60;

mainCamara.eye = [12, 26, 10];
mainCamara.center = [12, 0, 10];
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

    dummyPlayer.x(Matrix.Translation($V([
        -1 * dummyPlayerControl.currentPos[0],
        0,
        -1 * dummyPlayerControl.currentPos[1]])));

    levelControler.levelPass();
    levelControler.mazeMesh.rebuffering(world.gl, world);
});

function drawLoop() {
    const currentTime = Date.now();
    const delta = currentTime - startTime;
    if (interval < delta) {
        startTime = currentTime;

        if (levelControler.transformLevel) {
            // 在别处实现动画逻辑
        } else {
            dummyPlayerControl.accelerate(currentDir);
            const deltaPos = dummyPlayerControl.move(levelControler.maze);
            dummyPlayer.x(Matrix.Translation($V([deltaPos[0], 0, deltaPos[1]])));
        }

        world.render();
    }
    requestAnimationFrame(drawLoop);
}

loadShapes().then(function () {
    requestAnimationFrame(drawLoop);
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

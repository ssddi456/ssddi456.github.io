import { Vector3 } from './libs/2dRoad';
import { Mesh3dRoad } from './libs/3dRoad';
import { LineVertexColorShader } from './shaders/line_vertex_color_shader';
import { World, Camara } from './world';

import { VertexColorShader } from './shaders/vertex_color_shader';
import { CubeWithTextureShader } from './shaders/cube_with_texture_shader';
import { CubeWithTextureAndLightingShader } from './shaders/cube_with_texture_and_lighting_shader';
import { Light } from "./light";
import { Mesh } from "./mesh";
import { Line } from "./line";
import { RoadMap } from "./libs/roadMap";

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
skyLight.color = [1, 1, 1];
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

const cubeTemplate2 = cubeTemplate.clone();
cubeTemplate2.vertexColors = undefined;

cubeTemplate2.textureCoordinates = [
    // Front
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Top
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Bottom
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Right
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Left
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

cubeTemplate2.textureSrc = '/images/checker2x2.jpg';
cubeTemplate2.shader = new CubeWithTextureAndLightingShader();

const roadMap = new RoadMap(20, 20);
roadMap.generateRandonRoad();
// const roadMap = new RoadMap(3, 3);
// roadMap.setWalkThrough(1, 1);

const mesh3dRoad = new Mesh3dRoad(roadMap);
const meshData3dRoad = mesh3dRoad.getMesh();
const objMesh3dRoad = cubeTemplate2.clone();

objMesh3dRoad.debug = false;
objMesh3dRoad.visible = true;
objMesh3dRoad.vertices = meshData3dRoad.vertexs;
objMesh3dRoad.faces = meshData3dRoad.faces;

if (meshData3dRoad.vertexColors.length) {
    objMesh3dRoad.vertexColors = meshData3dRoad.vertexColors;
}
if (meshData3dRoad.vertexNormal.length) {
    objMesh3dRoad.vertexNormal = meshData3dRoad.vertexNormal;
}
if (meshData3dRoad.textureCoordinates.length) {
    objMesh3dRoad.textureCoordinates = meshData3dRoad.textureCoordinates;
}

const move = Matrix.Translation($V([0, 0, -25]));
const rotateX = Matrix.RotationX(0.25 * Math.PI).ensure4x4();
const rotateY = Matrix.RotationY(0.25 * Math.PI).ensure4x4();
const rotateZ = Matrix.RotationY(0.25 * Math.PI / 60 / 4).ensure4x4();

const linex = Line.createSimpleLine([0, 0, 0], [10, 0, 0], Matrix.I(4));
linex.verticesColor = [
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
];
const liney = Line.createSimpleLine([0, 0, 0], [0, 10, 0], Matrix.I(4));
liney.verticesColor = [
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
];
const linez = Line.createSimpleLine([0, 0, 0], [0, 0, 10], Matrix.I(4));
linez.verticesColor = [
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
];

const dummyPlayer = cubeTemplate.clone();
dummyPlayer.vertices.forEach((v, i) => dummyPlayer.vertices[i] *= 0.25);

async function loadShapes() {

    world.attachLight(skyLight);

    await Promise.all([
        linex,
        liney,
        linez,
        objMesh3dRoad,
        dummyPlayer,
    ].map((x) => world.attachObject(x)));
}

let startTime = 0;
const interval = 1000 / 60;

mainCamara.eye = [10, 24, 10];
mainCamara.center = [10, 0, 10];
mainCamara.up = [0, 0, -1];

const dirLeft = [1, 0, 0];
const dirRight = [-1, 0, 0];
const dirFront = [0, 0, 1];
const dirBack = [0, 0, -1];
let currentDir = [0, 0, 0];

function drawLoop() {
    const currentTime = Date.now();
    const delta = currentTime - startTime;
    if (interval < delta) {
        startTime = currentTime;
        dummyPlayer.x(Matrix.Translation($V(currentDir.map((x) => x * 0.1))));

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
    switch (key) {
        case 'A':
            delta = dirRight;
            break;
        case 'D':
            delta = dirLeft;
            break;
        case 'S':
            delta = dirFront;
            break;
        case 'W':
            delta = dirBack;
            break;
        default: return;
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
    switch (String.fromCharCode(e.keyCode)) {
        case 'A':
            delta = dirRight;
            break;
        case 'D':
            delta = dirLeft;
            break;
        case 'S':
            delta = dirFront;
            break;
        case 'W':
            delta = dirBack;
            break;
        default: return;
    }

    currentDir.forEach((x, i) => currentDir[i] -= delta[i]);

}, true);

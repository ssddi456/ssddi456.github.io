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
import { loopFactory, createTexture, createFrameBuffer, createFrameBufferWithDepth } from './libs/utils';
import { createMergeCanvas } from './objects/merge_canvas';

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
clampFloor.textureSrc = '/images/white.jpg';
clampFloor.shader = new CubeWithTextureAndLightingShader();
const clampFloorPlane = new Plane();

clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
clampFloor.x(Matrix.Translation($V([0, -0.2, 0])));

async function loadShapes() {

    await Promise.all([
        clampFloor.loadTexture(world.gl),
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
        // 重新初始化关卡

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
        const centerHeight = levelControler.maze.width;

        mainCamara.eye = [centerX, centerHeight, centerY];
        mainCamara.center = [centerX, 0, centerY];

        updateDebugUI();
    } else {
        // console.log('play level');

        dummyPlayerControl.accelerate(currentDir);
        const deltaPos = dummyPlayerControl.move(levelControler.maze);
        dummyPlayer.x(Matrix.Translation($V([deltaPos[0], 0, deltaPos[1]])));

        levelControler.update(world);
        levelControler.mazeMesh.rebuffering(world.gl, world);


    }
}, 1000 / drawFrequant);

const grayFrameTexture = createTexture(world.gl, size.width, size.height);
const [grayFrameBuffer, grayRenderBuffer] = createFrameBufferWithDepth(world.gl, grayFrameTexture, size);
const colorFrameTexture = createTexture(world.gl, size.width, size.height);
const [colorFrameBuffer, colorRenderBuffer] = createFrameBufferWithDepth(world.gl, colorFrameTexture, size);

const greyScene = world.createScene();
greyScene.camara = mainCamara;
greyScene.frameBuffer = grayFrameBuffer;
greyScene.renderBuffer = grayRenderBuffer;
greyScene.attachLight(skyLight);
greyScene.attachObject(clampFloor);
greyScene.attachObject(levelControler.mazeMesh);
greyScene.attachObject(dummyPlayer);
greyScene.beforeRender = function () {
    levelControler.mazeMesh.useFog = 1.0;
};
const colorScene = greyScene.clone();
colorScene.frameBuffer = colorFrameBuffer;
colorScene.renderBuffer = colorRenderBuffer;
colorScene.beforeRender = function () {
    levelControler.mazeMesh.useFog = 0;
};

const compositScene = world.createScene();
const compositCanvas = createMergeCanvas(size);
compositCanvas.sight = Math.pow((dummyPlayerControl.sightRange - 1) * size.height / levelControler.maze.height, 2);
compositCanvas.textureGray = grayFrameTexture;
compositCanvas.textureColor = colorFrameTexture;
compositScene.attachObject(compositCanvas);
compositScene.beforeRender = function () {

    const centerInWorld = dummyPlayer.trs;
    const centerInCamara = mainCamara.matrix.x(centerInWorld);
    const screenW = centerInCamara.elements[3][3];

    const screenX = centerInCamara.elements[0][3] / screenW;
    const screenY = centerInCamara.elements[1][3] / screenW;

    const actualCenterX = (screenX + 1) / 2 * size.width;
    const actualCenterY = (screenY + 1) / 2 * size.height;

    // console.log(centerInWorld);
    // console.log(centerInCamara);
    // console.log(screenX, screenY);
    // console.log(actualCenterX, actualCenterY);

    compositCanvas.center[0] = actualCenterX;
    compositCanvas.center[1] = actualCenterY;
};
const drawInfo = {
    gray: 1,
    color: 1,
    full: 1,
};

function draw() {
    if (drawInfo.gray) {
        greyScene.render();
    }
    if (drawInfo.color) {
        colorScene.render();
    }
    if (drawInfo.full) {
        compositScene.render();
    }
}

const drawLoop = loopFactory(draw, 1000 / drawFrequant);

loadShapes().then(function () {
    levelControler.reset();
    updateLoop();
    drawLoop();
    // draw();
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

const $hardness = $('#hardness');
const $exitDisance = $('#exit_disance');
const $renderControl = $('[name=render_control]');


function updateDebugUI() {
    $hardness.text(levelControler.hardness);
    $exitDisance.text(levelControler.maze.exitDistance);
}

$renderControl.on('change', function () {

    switch ((this as HTMLInputElement).value) {
        case 'render_composit_layer':
            drawInfo.gray = 1;
            drawInfo.color = 1;
            drawInfo.full = 1;

            greyScene.frameBuffer = grayFrameBuffer;
            greyScene.renderBuffer = grayRenderBuffer;

            colorScene.frameBuffer = colorFrameBuffer;
            colorScene.renderBuffer = colorRenderBuffer;
            break;
        case 'render_grayscal_layer':
            drawInfo.gray = 1;
            drawInfo.color = 0;
            drawInfo.full = 0;

            greyScene.frameBuffer = null;
            greyScene.renderBuffer = null;
            break;
        case 'render_full_color_layer':
            drawInfo.gray = 0;
            drawInfo.color = 1;
            drawInfo.full = 0;

            colorScene.frameBuffer = null;
            colorScene.renderBuffer = null;
            break;
    }
});

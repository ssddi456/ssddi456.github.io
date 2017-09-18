import { Plane } from '../libs/plane';
import { World, Camara } from '../world';
import { Light } from '../light';
import { Mesh } from '../mesh';
import { AnimateShaderShader } from '../shaders/animate_shader';
import { loopFactory, forEachVectorArray } from '../libs/utils';

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

mainCamara.eye = [11.5, 26, 9.5];
mainCamara.center = [11.5, 0, 9.5];
mainCamara.up = [0, 0, -1];


const skyLight = new Light();

skyLight.direction = [1, 2, 1];
skyLight.color = [0.5, 0.5, 0.5];
skyLight.debug = false;

const clampFloor = new Mesh();
clampFloor.debug = true;
clampFloor.shader = new AnimateShaderShader();
const clampFloorPlane = new Plane();
clampFloorPlane.width = 23;
clampFloorPlane.height = 19;

clampFloor.updateMeshInfo(clampFloorPlane.getMesh());
clampFloor.x(Matrix.Translation($V([0, -0.1, 0])));
const multiplier = [-1, 1, -1, 1];

async function loadShapes() {

    world.attachLight(skyLight);

    [
        clampFloor,
    ].map((x) => world.attachObject(x));
}

const updateLoop = loopFactory(function (tick) {

    // clampFloor.rebuffering(world.gl, world);

}, 1000 / 6);

const drawLoop = loopFactory(function () {
    world.render();
}, 1000 / 60);

loadShapes().then(function () {
    updateLoop();
    drawLoop();
});

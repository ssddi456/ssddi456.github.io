import { Plane, ClipSpacePlane } from '../libs/plane';
import { World, Camara } from '../world';
import { Light } from '../light';
import { Mesh } from '../mesh';
import { loopFactory, forEachVectorArray, createFrameBuffer, createTexture } from '../libs/utils';
import { MeshWithFog } from '../libs/level_control';
import { CubeWithFogShader } from '../shaders/cube_with_fog';
import { FogWithMergeShader } from '../shaders/fog_with_merge';
import { Shader } from '../shaders/base_shader';
import { Shape } from '../shape';

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
world.camara = mainCamara;

mainCamara.height = size.height;
mainCamara.width = size.width;
mainCamara.eye = [size.width / 2 - 40, 660, size.height / 2 - 30];
mainCamara.center = [size.width / 2 - 40, 0, size.height / 2 - 30];
mainCamara.up = [0, 0, -1];

const skyLight = new Light();

skyLight.direction = [1, 2, 1];
skyLight.color = [0.5, 0.5, 0.5];

const clampFloor = new MeshWithFog();
clampFloor.shader = new CubeWithFogShader();
clampFloor.textureSrc = '/images/checker_with_number.jpg';

const clampFloorPlane = new Plane();
clampFloorPlane.width = size.width * 0.9;
clampFloorPlane.height = size.height * 0.9;
clampFloor.updateMeshInfo(clampFloorPlane.getMesh());

const grayFrameTexture = createTexture(world.gl, size.width, size.height);
const grayFrameBuffer = createFrameBuffer(world.gl, grayFrameTexture);
const colorFrameTexture = createTexture(world.gl, size.width, size.height);
const colorFrameBuffer = createFrameBuffer(world.gl, colorFrameTexture);

const mergeCanvas = new (class extends Mesh {
    textureGray = grayFrameTexture;
    textureColor = colorFrameTexture;

    resolution = new Float32Array([size.width, size.height]);
    center = new Float32Array([size.width / 2, size.height / 2]);
    sight = 200 * 200;

    bindBufferAndDraw(shader: Shader, gl) {
        shader.bindBuffer('uSamplerGray', 0);
        shader.bindBuffer('uSamplerColor', 1);
        shader.bindBuffer('uCenter', this.center);
        shader.bindBuffer('uResolution', this.resolution);
        shader.bindBuffer('uSightRange', this.sight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textureGray);
        shader.bindBuffer('uSamplerGray', 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textureColor);
        shader.bindBuffer('uSamplerColor', 1);

        super.bindBufferAndDraw(shader, gl);
    }
})();

mergeCanvas.updateMeshInfo(ClipSpacePlane.getMesh());
mergeCanvas.shader = new FogWithMergeShader();
mergeCanvas.shader.render = function (renderWorld: World, mesh: Shape) {
    mesh.bindBufferAndDraw(this, renderWorld.gl);
};

async function loadTextures() {
    await clampFloor.loadTexture(world.gl);
}

const updateLoop = loopFactory(function (tick) {

    // clampFloor.rebuffering(world.gl, world);

}, 1000 / 6);

const greyScene = world.createScene();
greyScene.camara = mainCamara;
greyScene.attachLight(skyLight);
greyScene.attachObject(clampFloor);
greyScene.frameBuffer = grayFrameBuffer;
greyScene.beforeRender = function () {
    clampFloor.fog.forEach((x, i, fog) => fog[i] = 0.5);
    clampFloor.rebuffering(this.gl, world);
};

const colorScene = greyScene.clone();
colorScene.frameBuffer = colorFrameBuffer;
colorScene.beforeRender = function () {
    clampFloor.fog.forEach((x, i, fog) => fog[i] = 1);
    clampFloor.rebuffering(this.gl, world);
};

const compositScene = world.createScene();
compositScene.attachObject(mergeCanvas);

function draw() {
    const gl = world.gl;

    greyScene.render();
    colorScene.render();
    compositScene.render();
}

const drawLoop = loopFactory(draw, 1000 / 60);

loadTextures().then(function () {
    draw();
});

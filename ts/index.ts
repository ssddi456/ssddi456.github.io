import { b, c } from './decorator';
import { Mesh, World, Camara, VertexColorShader } from './world';

b.a = 333;
console.log(b);
console.log(c);

const testFs = require("./shaders/test-fs.glsl");
const testVs = require("./shaders/test-vs.glsl");

const main = $('#main')[0] as HTMLCanvasElement;
const size = main.getClientRects()[0];

main.height = size.height;
main.width = size.width;

const world = new World(main.getContext('webgl'), size);

const cubeTemplate = new Mesh();

const cubeShader = new VertexColorShader();
cubeShader.fragementShaderFactory = testFs;
cubeShader.vertexShaderFactory = testVs;

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

cubeTemplate.verticesColor = [].concat.apply([], [
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

cubeTemplate.trs = Matrix.I(4);

const move = Matrix.Translation($V([0, 0, -25]));
const rotateX = Matrix.RotationX(0.25 * Math.PI).ensure4x4();
const rotateY = Matrix.RotationY(0.25 * Math.PI).ensure4x4();

const rotateZ = Matrix.RotationZ(0.25 * Math.PI / 60 / 4).ensure4x4();

const cubes = [];
for (let i = 0; i < 5; i++) {
    const cubeCopy = cubeTemplate.clone();
    cubeCopy.trs = cubeCopy.trs.x(Matrix.Translation($V([(-2 + i) * 4, 0, 0])))
        .x(move)
        .x(rotateX)
        .x(rotateY);
    cubes.push(cubeCopy);
    world.attachObject(cubeCopy);
}

let startTime = Date.now();
const interval = 1000 / 60;

function drawLoop() {
    const currentTime = Date.now();
    const delta = currentTime - startTime;
    if (interval < delta) {
        startTime = currentTime;
        cubes.forEach(function (cube) {
            cube.trs = cube.trs.x(rotateZ);
        });
        world.render();
    }
    requestAnimationFrame(drawLoop);
}

drawLoop();

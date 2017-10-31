var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "./shape", "./line", "./libs/utils"], function (require, exports, shape_1, line_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mesh = /** @class */ (function (_super) {
        __extends(Mesh, _super);
        function Mesh() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mesh.prototype.loadTexture = function (gl) {
            return __awaiter(this, void 0, void 0, function () {
                var texture, image, loadFinsh;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.textureSrc) {
                                return [2 /*return*/];
                            }
                            texture = gl.createTexture();
                            if (texture) {
                                this.texture = texture;
                            }
                            image = new Image();
                            loadFinsh = new Promise(function (resolve, reject) {
                                image.onload = function () {
                                    resolve();
                                };
                                image.onerror = function (e) {
                                    reject(e);
                                };
                            });
                            image.src = this.textureSrc;
                            return [4 /*yield*/, loadFinsh];
                        case 1:
                            _a.sent();
                            gl.bindTexture(gl.TEXTURE_2D, texture);
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                            gl.generateMipmap(gl.TEXTURE_2D);
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            return [2 /*return*/];
                    }
                });
            });
        };
        Mesh.prototype.clone = function () {
            var newInstance = new this.constructor();
            newInstance.vertices = this.vertices.slice(0);
            newInstance.faces = this.faces.slice(0);
            if (this.vertexColors) {
                newInstance.vertexColors = this.vertexColors.slice(0);
            }
            if (this.textureCoordinates) {
                newInstance.textureCoordinates = this.textureCoordinates.slice(0);
            }
            if (this.textureSrc) {
                newInstance.textureSrc = this.textureSrc;
            }
            if (this.texture) {
                newInstance.texture = this.texture;
            }
            if (this.vertexNormal) {
                newInstance.vertexNormal = this.vertexNormal;
            }
            newInstance.shader = this.shader;
            newInstance.trs = this.trs.clone();
            newInstance.debug = this.debug;
            newInstance.visible = this.visible;
            return newInstance;
        };
        Mesh.prototype.init = function (gl, world) {
            this.vertexBuffer = utils_1.createBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            this.facesBuffer = utils_1.createBuffer(gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
            if (this.vertexColors) {
                this.vertexColorBuffer = utils_1.createBuffer(gl);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexColors), gl.STATIC_DRAW);
            }
            if (this.textureCoordinates) {
                this.textureCoordinatesBuffer = utils_1.createBuffer(gl);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
            }
            if (this.vertexNormal) {
                this.vertexNormalBuffer = utils_1.createBuffer(gl);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormal), gl.STATIC_DRAW);
            }
            this.addDebugObjects(world),
                this.shader.init(gl);
            this.inited = true;
        };
        Mesh.prototype.dispose = function (world) {
            var gl = world.gl;
            gl.deleteBuffer(this.vertexBuffer);
            gl.deleteBuffer(this.facesBuffer);
            gl.deleteBuffer(this.vertexColorBuffer);
            gl.deleteBuffer(this.textureCoordinatesBuffer);
            gl.deleteBuffer(this.vertexNormalBuffer);
            gl.deleteTexture(this.texture);
            this.disposed = true;
        };
        Mesh.prototype.rebuffering = function (gl, world, attribute) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
            if (this.vertexColors) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexColors), gl.STATIC_DRAW);
            }
            if (this.textureCoordinates) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
            }
            if (this.vertexNormal) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormal), gl.STATIC_DRAW);
            }
        };
        Mesh.prototype.bindBufferAndDraw = function (shader, gl) {
            shader.bindBuffer('aVertexPosition', this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
            if (this.texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                shader.bindBuffer('uSampler', 0);
            }
            if (this.vertexColors && this.vertexColors.length) {
                shader.bindBuffer('aVertexColor', this.vertexColorBuffer);
            }
            if (this.vertexNormal && this.vertexNormal.length) {
                shader.bindBuffer('aVertexNormal', this.vertexNormalBuffer);
            }
            if (this.textureCoordinates && this.textureCoordinates.length) {
                shader.bindBuffer('aTextureCoord', this.textureCoordinatesBuffer);
            }
            gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, 0);
        };
        Mesh.prototype.addDebugObjects = function (world) {
            var _this = this;
            if (!this.debug) {
                return;
            }
            var normals = this.normals = [];
            var normalLines = this.normalLines = [];
            var meshLines = this.meshLins = [];
            var transformedNormalLines = this.transformedNormalLines = [];
            var vertexFinalLightLines = this.vertexFinalLightLines = [];
            for (var index = 0; index < this.faces.length; index += 3) {
                var vertex1 = this.vertices.slice(this.faces[index] * 3, this.faces[index] * 3 + 3);
                var vertex2 = this.vertices.slice(this.faces[index + 1] * 3, this.faces[index + 1] * 3 + 3);
                var vertex3 = this.vertices.slice(this.faces[index + 2] * 3, this.faces[index + 2] * 3 + 3);
                var line1 = line_1.Line.createSimpleLine2(vertex1, vertex2, this.trs);
                meshLines.push(line1);
                var line2 = line_1.Line.createSimpleLine2(vertex2, vertex3, this.trs);
                meshLines.push(line2);
                var line3 = line_1.Line.createSimpleLine2(vertex3, vertex1, this.trs);
                meshLines.push(line3);
                world.attachObject(line1);
                world.attachObject(line2);
                world.attachObject(line3);
            }
            if (this.vertexNormal) {
                for (var index = 0; index < this.vertexNormal.length; index += 3) {
                    var normal = this.vertexNormal.slice(index, index + 3);
                    var vertex = this.vertices.slice(index, index + 3);
                    normals.push([normal[0], normal[1], normal[2], 1]);
                    var normalLine = line_1.Line.createSimpleLine(vertex, normal, this.trs);
                    world.attachObject(normalLine);
                    normalLines.push(normalLine);
                    var transformedNormalLine = line_1.Line.createSimpleLine(vertex, normal, this.trs);
                    transformedNormalLine.verticesColor = [
                        0, 1, 0, 1,
                        1, 0, 1, 1,
                    ];
                    world.attachObject(transformedNormalLine);
                    transformedNormalLines.push(transformedNormalLine);
                    var finalLightLine = line_1.Line.createSimpleLine([
                        vertex[0] + 0.2 * normal[0],
                        vertex[1] + 0.2 * normal[1],
                        vertex[2] + 0.2 * normal[2],
                    ], normal, this.trs);
                    finalLightLine.verticesColor = [
                        1, 1, 1, 1,
                        1, 0, 1, 1,
                    ];
                    world.attachObject(finalLightLine);
                    vertexFinalLightLines.push(finalLightLine);
                }
            }
            var setParent = function (x) { return x.parentShap = _this; };
            this.normalLines.forEach(setParent);
            this.transformedNormalLines.forEach(setParent);
            this.vertexFinalLightLines.forEach(setParent);
            this.meshLins.forEach(setParent);
        };
        Mesh.prototype.updateMeshInfo = function (meshInfo) {
            this.vertices = meshInfo.vertexs;
            this.faces = meshInfo.faces;
            if (meshInfo.vertexColors && meshInfo.vertexColors.length) {
                this.vertexColors = meshInfo.vertexColors;
            }
            if (meshInfo.vertexNormal && meshInfo.vertexNormal.length) {
                this.vertexNormal = meshInfo.vertexNormal;
            }
            if (meshInfo.textureCoordinates && meshInfo.textureCoordinates.length) {
                this.textureCoordinates = meshInfo.textureCoordinates;
            }
        };
        Mesh.prototype.updateDebug = function (world, lights) {
            var _this = this;
            var mainLight = lights[0];
            var gl = world.gl;
            this.normalLines.forEach(function (x) { return x.visible = false; });
            this.vertexFinalLightLines.forEach(function (x) { return x.visible = false; });
            this.transformedNormalLines.forEach(function (x) { return x.visible = false; });
            if (!mainLight) {
                this.transformedNormalLines.forEach(function (x) { return x.visible = false; });
            }
            else {
                var objAxis_1 = this.trs.inverse().transpose();
                var lightDirection_1 = $V(mainLight.direction).toUnitVector();
                this.transformedNormalLines.forEach(function (x, i) {
                    var start = x.start;
                    var normal = _this.normals[i];
                    var transformedNormalLine = objAxis_1.multiply(Matrix.create([
                        [normal[0]],
                        [normal[1]],
                        [normal[2]],
                        [normal[3]],
                    ]));
                    x.end = [
                        start[0] + transformedNormalLine.elements[0][0],
                        start[1] + transformedNormalLine.elements[1][0],
                        start[2] + transformedNormalLine.elements[2][0],
                    ];
                    gl.bindBuffer(gl.ARRAY_BUFFER, x.lineBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(x.points), gl.STATIC_DRAW);
                    var finalLightLine = _this.vertexFinalLightLines[i];
                    var lightPower = $V([].concat.apply([], transformedNormalLine.elements.slice(0, 3)))
                        .dot(lightDirection_1);
                    lightPower = Math.max(0, lightPower);
                    finalLightLine.end = [
                        finalLightLine.start[0] + lightPower * normal[0],
                        finalLightLine.start[1] + lightPower * normal[1],
                        finalLightLine.start[2] + lightPower * normal[2],
                    ];
                    gl.bindBuffer(gl.ARRAY_BUFFER, finalLightLine.lineBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(finalLightLine.points), gl.STATIC_DRAW);
                });
            }
        };
        return Mesh;
    }(shape_1.Shape));
    exports.Mesh = Mesh;
});

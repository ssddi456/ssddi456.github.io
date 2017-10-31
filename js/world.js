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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Camara = /** @class */ (function () {
        function Camara() {
            this.fv = 45;
            this.width = 640;
            this.height = 480;
            this.nearClip = 0.1;
            this.farClip = 1000;
            this.eye = [0, 5, 20];
            this.center = [0, 0, -25];
            this.up = [0, 1, 0];
        }
        Object.defineProperty(Camara.prototype, "radio", {
            get: function () {
                return this.width / this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camara.prototype, "matrix", {
            get: function () {
                return makePerspective(this.fv, this.radio, this.nearClip, this.farClip)
                    .x(makeLookAt.apply(null, [].concat(this.eye, this.center, this.up)));
            },
            enumerable: true,
            configurable: true
        });
        return Camara;
    }());
    exports.Camara = Camara;
    var World = /** @class */ (function () {
        function World(gl, size) {
            this.meshes = [];
            this.lights = [];
            this.gl = gl;
            // Set clear color to black, fully opaque
            gl.clearColor(0, 0, 0, 1.0);
            // Enable depth testing
            gl.enable(gl.DEPTH_TEST);
            // Near things obscure far things
            gl.depthFunc(gl.LEQUAL);
            // Clear the color as well as the depth buffer.
            gl.viewport(0, 0, size.width, size.height);
            this.width = size.width;
            this.height = size.height;
            // tslint:disable-next-line:no-bitwise
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        World.prototype.attachLight = function (light) {
            if (this.lights.indexOf(light) === -1) {
                this.lights.push(light);
                light.init(this.gl, this);
            }
        };
        World.prototype.attachObject = function (mesh) {
            if (this.meshes.indexOf(mesh) === -1) {
                this.meshes.push(mesh);
                mesh.init(this.gl, this);
            }
        };
        World.prototype.useShader = function (shader) {
            if (shader === this.lastUsedShader) {
                return;
            }
            if (this.lastUsedShader) {
                this.lastUsedShader.mounted = false;
            }
            this.gl.useProgram(shader.shaderProgram);
            shader.mount(this.gl);
            shader.mounted = true;
            this.lastUsedShader = shader;
        };
        World.prototype.render = function () {
            var gl = this.gl;
            gl.viewport(0, 0, this.camara.width, this.camara.height);
            // tslint:disable-next-line:no-bitwise
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var camaraMatrixFlat = new Float32Array(this.camara.matrix.flatten());
            for (var index = 0; index < this.meshes.length; index++) {
                var mesh = this.meshes[index];
                mesh.render(this, camaraMatrixFlat, this.lights);
            }
        };
        World.prototype.createScene = function () {
            var scene = new Scene(this.gl, this);
            return scene;
        };
        return World;
    }());
    exports.World = World;
    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene(gl, world) {
            var _this = _super.call(this, gl, world) || this;
            _this.frameBuffer = null;
            _this.renderBuffer = null;
            _this.gl = gl;
            _this.world = world;
            return _this;
        }
        Scene.prototype.clone = function () {
            var scene = new Scene(this.gl, this.world);
            scene.camara = this.camara;
            scene.lights = __spread(this.lights);
            scene.meshes = __spread(this.meshes);
            return scene;
        };
        Scene.prototype.attachLight = function (light) {
            if (this.lights.indexOf(light) === -1) {
                this.world.attachLight(light);
                this.lights.push(light);
            }
        };
        Scene.prototype.attachObject = function (mesh) {
            if (this.meshes.indexOf(mesh) === -1) {
                this.world.attachObject(mesh);
                this.meshes.push(mesh);
            }
        };
        Scene.prototype.useShader = function (shader) {
            this.world.useShader(shader);
        };
        Scene.prototype.render = function () {
            if (this.beforeRender) {
                this.beforeRender();
            }
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
            if (this.camara) {
                gl.viewport(0, 0, this.camara.width, this.camara.height);
            }
            else {
                gl.viewport(0, 0, this.width, this.height);
            }
            // Enable depth testing
            gl.enable(gl.DEPTH_TEST);
            // Near things obscure far things
            gl.depthFunc(gl.LEQUAL);
            gl.clearColor(0, 0, 0, 1.0);
            // Clear the color as well as the depth buffer.
            // tslint:disable-next-line:no-bitwise
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var camaraMatrixFlat = this.camara ? new Float32Array(this.camara.matrix.flatten()) : null;
            for (var index = 0; index < this.meshes.length; index++) {
                var mesh = this.meshes[index];
                mesh.render(this, camaraMatrixFlat, this.lights);
            }
        };
        return Scene;
    }(World));
    exports.Scene = Scene;
});

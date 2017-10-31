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
define(["require", "exports", "./base_shader"], function (require, exports, base_shader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CubeWithTextureShader = /** @class */ (function (_super) {
        __extends(CubeWithTextureShader, _super);
        function CubeWithTextureShader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.vertexShaderFactory = require("../shaders/cube_with_texture-vs.glsl");
            _this.fragementShaderFactory = require("../shaders/cube_with_texture-fs.glsl");
            return _this;
        }
        CubeWithTextureShader.prototype.mount = function (gl) {
            var shaderProgram = this.shaderProgram;
            this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(this.aVertexPosition);
            this.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
            gl.enableVertexAttribArray(this.textureCoordAttribute);
            this.uSampler = gl.getUniformLocation(this.shaderProgram, "uSampler");
            this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        };
        CubeWithTextureShader.prototype.render = function (world, mesh, camaraMatrixFlat) {
            var gl = world.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordinatesBuffer);
            gl.vertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, mesh.texture);
            gl.uniform1i(this.uSampler, 0);
            gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);
            gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));
            gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
        };
        return CubeWithTextureShader;
    }(base_shader_1.Shader));
    exports.CubeWithTextureShader = CubeWithTextureShader;
});

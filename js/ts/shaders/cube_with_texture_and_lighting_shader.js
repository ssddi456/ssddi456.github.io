"use strict";
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
exports.__esModule = true;
var base_shader_1 = require("ts/shaders/base_shader");
var CubeWithTextureAndLightingShader = /** @class */ (function (_super) {
    __extends(CubeWithTextureAndLightingShader, _super);
    function CubeWithTextureAndLightingShader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.vertexShaderFactory = require("js/shaders/cube_with_lighting-vs.glsl.js");
        _this.fragementShaderFactory = require("js/shaders/cube_with_lighting-fs.glsl.js");
        return _this;
    }
    CubeWithTextureAndLightingShader.prototype.mount = function (gl) {
        var shaderProgram = this.shaderProgram;
        this.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(this.aVertexColor);
        this.aVertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(this.aVertexNormal);
        this.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition);
        this.aTextureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(this.aTextureCoord);
        this.uSampler = gl.getUniformLocation(this.shaderProgram, "uSampler");
        this.uNormalMatrix = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
        this.uPMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.uMVMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.uDirectionalLightColor = gl.getUniformLocation(this.shaderProgram, 'uDirectionalLightColor');
        this.uDirectionalVector = gl.getUniformLocation(this.shaderProgram, 'uDirectionalVector');
    };
    CubeWithTextureAndLightingShader.prototype.render = function (world, mesh, camaraMatrixFlat, lights) {
        var gl = world.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordinatesBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColorBuffer);
        gl.vertexAttribPointer(this.aVertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormalBuffer);
        gl.vertexAttribPointer(this.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.facesBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mesh.texture);
        gl.uniform1i(this.uSampler, 0);
        gl.uniform3fv(this.uDirectionalLightColor, lights[0].color);
        gl.uniform3fv(this.uDirectionalVector, lights[0].direction);
        gl.uniformMatrix4fv(this.uPMatrix, false, camaraMatrixFlat);
        gl.uniformMatrix4fv(this.uMVMatrix, false, new Float32Array(mesh.trs.flatten()));
        var normalMatrix = mesh.trs.inverse().transpose();
        gl.uniformMatrix4fv(this.uNormalMatrix, false, new Float32Array(normalMatrix.flatten()));
        gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
    };
    return CubeWithTextureAndLightingShader;
}(base_shader_1.Shader));
exports.CubeWithTextureAndLightingShader = CubeWithTextureAndLightingShader;

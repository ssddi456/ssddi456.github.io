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
define(["require", "exports", "./shape", "./shaders/line_vertex_color_shader", "./libs/utils"], function (require, exports, shape_1, line_vertex_color_shader_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.index = [0, 1];
            _this.lineVertexCounts = 2;
            return _this;
        }
        Line.prototype.bindBufferAndDraw = function (shader, gl) {
            throw new Error('Method not implemented.');
        };
        Object.defineProperty(Line.prototype, "points", {
            get: function () {
                return __spread(this.start, this.end);
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.init = function (gl) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.lineBuffer = utils_1.createBuffer(gl);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);
                    this.vertexColorBuffer = utils_1.createBuffer(gl);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesColor), gl.STATIC_DRAW);
                    this.indexBuffer = utils_1.createBuffer(gl);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW);
                    this.shader.init(gl);
                    this.inited = true;
                    return [2 /*return*/];
                });
            });
        };
        Line.prototype.dispose = function (world) {
            var gl = world.gl;
            gl.deleteBuffer(this.lineBuffer);
            gl.deleteBuffer(this.indexBuffer);
            gl.deleteBuffer(this.vertexColorBuffer);
            this.disposed = true;
        };
        Line.prototype.clone = function () {
            var clone = new Line();
            return clone;
        };
        Object.defineProperty(Line, "simepleShader", {
            get: function () {
                if (!Line.singleSimepleShader) {
                    Line.singleSimepleShader = new line_vertex_color_shader_1.LineVertexColorShader();
                }
                return Line.singleSimepleShader;
            },
            enumerable: true,
            configurable: true
        });
        Line.createSimpleLine = function (start, direct, trs) {
            var normalLine = new Line();
            normalLine.start = start;
            normalLine.end = [start[0] + direct[0], start[1] + direct[1], start[2] + direct[2]];
            normalLine.verticesColor = [
                0.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
            ];
            normalLine.shader = Line.simepleShader;
            normalLine.trs = trs.clone();
            return normalLine;
        };
        Line.createSimpleLine2 = function (start, end, trs) {
            var normalLine = new Line();
            normalLine.start = start;
            normalLine.end = end;
            normalLine.verticesColor = [
                0.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
            ];
            normalLine.shader = Line.simepleShader;
            normalLine.trs = trs.clone();
            return normalLine;
        };
        return Line;
    }(shape_1.Shape));
    exports.Line = Line;
});

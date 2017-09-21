import { ClipSpacePlane } from "../libs/plane";
import { Mesh } from "../mesh";
import { ISize, World } from "../world";
import { Shape } from "../shape";
import { Shader } from "../shaders/base_shader";
import { FogWithMergeShader } from '../shaders/fog_with_merge';

export function createMergeCanvas(size: ISize) {

    const mergeCanvas = new (class extends Mesh {
        textureGray: WebGLTexture;
        textureColor: WebGLTexture;

        resolution = new Float32Array([size.width, size.height]);
        center = new Float32Array([size.width / 2, size.height / 2]);
        sight = 30 * 30;

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

    return mergeCanvas;
}

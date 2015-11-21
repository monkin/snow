/// <reference path="Base.ts"/>
/// <reference path="WebGL.ts"/>

namespace snow {
	
	import GL = may.webgl.GL;
	import Set = may.Set;
	import Program = may.webgl.Program;
	import Attributes = may.webgl.Attributes;
	import Uniforms = may.webgl.Uniforms;
	import Buffer = may.webgl.Buffer;
	import BlendEquation = may.webgl.BlendEquation;
	import BlendFunction = may.webgl.BlendFunction;
	import Disposable = may.Disposable;
	
	export declare var Shaders: Set<string>;
	
	export class Snow implements Disposable {
		private program: Program;
		private attributes: Attributes;
		private uniforms: Uniforms;
		private indexes: Buffer;
		private triangles: number = 0;
		
		public constructor(private gl: GL, private count: number) {
			this.program = gl.program(Shaders["snow.v"], Shaders["snow.f"]);
			var attributes = this.program.attributes(),
				points: number[] = [], // vertexes
				orientation: number[] = [], // point position in triangle
				star: number[] = [], // star index
				indexes: number[] = [],
				offset = 0;
			
			this.attributes = attributes;
			this.uniforms = this.program.uniforms();
			
			for (let i = 0; i < count; i++) {
				let rays = 10;
					
				star.push(i);
				points.push(0, 0);
				orientation.push(0, 0, 1);
				
				for (let ray = 0; ray < rays; ray++) {
					star.push(i);
					points.push(Math.sin(2 * Math.PI * ray / rays), Math.cos(2 * Math.PI * ray / rays));
					orientation.push(ray % 2, (ray + 1) % 2, 0);
					indexes.push(offset, offset + ray + 1, offset + 1 + ((ray + 1) % rays));
					this.triangles++;
				}
				
				offset += rays + 1;
			}
			attributes.append("a_point", points);
			attributes.append("a_orientation", orientation);
			attributes.append("a_star", star);
			attributes.apply();
			
			this.indexes = gl.buffer()
					.targetElements()
					.typeUShort()
					.staticDraw()
					.data(indexes)
					.build();
		}
		
		public setTime(time: number) {
			this.uniforms.append("u_time", time);
			return this;
		}
		
		public setRatio(ratio: number) {
			this.uniforms.append("u_ratio", ratio);
			return this;
		}
		
		public draw() {
			this.gl.settings()
					.clearColor([0.4, 0.4, 0.9, 1.0])
					.clearDepth(0)
					//.enableDepthTest()
					.disableDepthTest()
					.enableBlend()
					.blendEquation(BlendEquation.ADD)
					.blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
					.elementArrayBuffer(this.indexes)
					.program(this.program).use(() => {
				this.gl.clearBuffers();
				this.gl.drawTrianglesElemets(this.triangles * 3);
			});
		}
		
		public dispose() {
			if (this.program) {
				this.program.dispose();
				this.program = null;
			}
			if (this.attributes) {
				this.attributes.dispose();
				this.attributes = null;
			}
			if (this.indexes) {
				this.indexes.dispose();
				this.indexes = null;
			}
		}
	}
	
	export function start(canvas: HTMLCanvasElement) {
		var gl = new GL(canvas),
			snow = new Snow(gl, 500),
			requestAnimationFrame = window.requestAnimationFrame || window["mozRequestAnimationFrame"] ||
                              window["webkitRequestAnimationFrame"] || window.msRequestAnimationFrame || setTimeout,
			startTime = new Date(),
			displayWidth  = canvas.clientWidth,
			displayHeight = canvas.clientHeight;
		
		if (canvas.width  != displayWidth ||
				canvas.height != displayHeight) {
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
			gl.handle.viewport(0, 0, canvas.width, canvas.height);
		}
		
		function draw() {
			snow.setRatio(canvas.width / canvas.height)
				.setTime(new Date().getTime() - startTime.getTime())
				.draw();
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
	}
	
}


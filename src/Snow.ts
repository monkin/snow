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
		private bgProgram: Program;
		private bgAttributes: Attributes;
		
		public constructor(private gl: GL, private count: number) {
			// Stars
			
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
				orientation.push(0);
				
				for (let ray = 0; ray < rays; ray++) {
					star.push(i);
					points.push(Math.sin(2 * Math.PI * ray / rays), Math.cos(2 * Math.PI * ray / rays));
					orientation.push((ray % 2) + 1);
					indexes.push(offset, offset + ray + 1, offset + 1 + ((ray + 1) % rays));
					this.triangles++;
				}
				
				offset += rays + 1;
			}
			attributes.append("a_point", points)
				.append("a_orientation", orientation)
				.append("a_star", star)
				.build().apply();
			
			this.indexes = gl.buffer()
					.targetElements()
					.typeUShort()
					.staticDraw()
					.data(indexes)
					.build();
			
			// Background
			
			this.bgProgram = gl.program(Shaders["background.v"], Shaders["background.f"]);
			this.bgAttributes = this.bgProgram.attributes().append("a_point", [
				-1, -1, 1, -1, -1, 1,
				1, -1, 1, 1, -1, 1
			]).build().apply();
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
					.disableBlend()
					.disableDepthTest()
					.program(this.bgProgram)
					.attributes(this.bgAttributes)
					.use(() => {
				this.bgAttributes.apply();
				this.gl.drawTrianglesArrays(6);
			});
			
			this.gl.settings()
					.disableDepthTest()
					.enableBlend()
					.blendEquation(BlendEquation.ADD)
					.blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
					.elementArrayBuffer(this.indexes)
					.program(this.program)
					.attributes(this.attributes).use(() => {
				this.attributes.apply();
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
			if (this.bgAttributes) {
				this.bgAttributes.dispose();
				this.bgAttributes = null;
			}
			if (this.bgProgram) {
				this.bgProgram.dispose();
				this.bgProgram = null;
			}
		}
	}
	
	export function start(canvas: HTMLCanvasElement) {
		var gl = new GL(canvas),
			snow = new Snow(gl, 600),
			requestAnimationFrame = window.requestAnimationFrame || window["mozRequestAnimationFrame"] ||
                              window["webkitRequestAnimationFrame"] || window.msRequestAnimationFrame || setTimeout,
			startTime = new Date();
		
		function resize() {
			var displayWidth  = window.innerWidth,
				displayHeight = window.innerHeight;
			
			if (canvas.width  != displayWidth ||
					canvas.height != displayHeight) {
				canvas.width  = displayWidth;
				canvas.height = displayHeight;
				gl.handle.viewport(0, 0, canvas.width, canvas.height);
			}
		}
		
		window.onresize = resize;
		
		resize();
		
		function draw() {
			snow.setRatio(canvas.width / canvas.height)
				.setTime(new Date().getTime() - startTime.getTime())
				.draw();
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
	}
	
}


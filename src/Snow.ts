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
    import Texture = may.webgl.Texture;
	import Disposable = may.Disposable;
    import using = may.using;
	
	export declare var Shaders: Set<string>;
    
    export class Mouse {
        private destination = [0, 0];
        private speed = 10.0;
        private position = [0, 0];
        private time = new Date().getTime() / 1000;
        public constructor() {
            window.addEventListener("mousemove", (e: MouseEvent) => {
                this.destination = [
                    e.pageX / window.innerWidth * 2 - 1,
                    - e.pageY / window.innerHeight * 2 + 1
                ];
            });
        }
        public getPosition(): number[] {
            var now = new Date().getTime() / 1000,
                destination = this.destination,
                lastTime = this.time,
                position = this.position,
                v = [destination[0] - position[0], destination[1] - position[1]],
                l = Math.sqrt(v[0] * v[0] + v[1] * v[1]),
                d = this.speed * (now - lastTime);
            if (d > l) {
                this.position = this.destination;
            } else {
                var c = d / l,
                    shift = [v[0] * c, v[1] * c];
                this.position = [position[0] + shift[0], position[1] + shift[1]];
            }
            this.time = now;
            return this.position;
        }
    }
	
	export class Background implements Disposable {
		
		private program: Program;
		private uniforms: Uniforms;
		private attributes: Attributes;

		public constructor(public gl: GL) {
			this.program = gl.program(Shaders["background.v"], Shaders["background.f"]);
			this.attributes = this.program.attributes();
			this.uniforms = this.program.uniforms();
			
			this.attributes.append("a_point", [
				-1, -1, 1, -1, -1, 1,
				1, -1, 1, 1, -1, 1
			]).build().apply();
		}
		
		public draw() {
			this.gl.settings()
					.enableBlend()
					.blendEquation(BlendEquation.ADD)
					.blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
					.disableDepthTest()
					.program(this.program)
					.attributes(this.attributes)
					.use(() => {
				this.attributes.apply();
				this.gl.drawTrianglesArrays(6);
			});
		}
		
		public dispose() {
			this.attributes.dispose();
			this.program.dispose();
		}
	}
	
	export class Snow implements Disposable {
		private program: Program;
		private attributes: Attributes;
		private uniforms: Uniforms;
		private indexes: Buffer;
		private triangles: number = 0;
        private normals: Texture;
		
		public constructor(private gl: GL, private count: number) {
            this.normals = gl.texture()
                .width(64).height(64)
                .formatRGB()
                .filterLinear()
                .wrapRepeat()
                .typeByte()
                .build();
            
            using(new Bump(gl, 400), gl.frame(), (bump, frame) => {
                frame.setColorBuffer(this.normals).use(() => {
                    gl.settings().viewport(0, 0, 64, 64).use(() => {
                        bump.draw();
                    });
                });
            });
            
			this.program = gl.program(Shaders["snow.v"], Shaders["snow.f"]);
			var attributes = this.program.attributes(),
				points: number[] = [], // vertexes
				orientation: number[] = [], // point position in triangle
				star: number[] = [], // star index
				indexes: number[] = [],
				offset = 0;
			
			this.attributes = attributes;
			this.uniforms = this.program.uniforms();
            
            this.uniforms.append("u_normals", 0);
            
			for (let i = 0; i < count; i++) {
				let rays = 10,
                    starSeed = Math.random() * 1000;
					
				star.push(starSeed);
				points.push(0, 0);
				orientation.push(0);
				
				for (let ray = 0; ray < rays; ray++) {
					star.push(starSeed);
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
					.disableDepthTest()
					.enableBlend()
					.blendEquation(BlendEquation.ADD)
					.blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
					.elementArrayBuffer(this.indexes)
                    .textures([this.normals])
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
            if (this.normals) {
                this.normals.dispose();
                this.normals = null;
            }
		}
	}
	
	export class Lights implements Disposable {
		private colors: string[] = ["#0d4370","#015dbf","#cb91e0","#000ac9","#3df4f1","#ea8aa4","#39248c",
			"#7ae26f","#319cf9","#f4b0df","#fcc6b0","#ec93f9","#f2b0e4","#077745","#e241c5","#d18e4b","#41a300",
			"#42ea3f","#dc7fef","#edef58","#6af2e4","#41a6c1","#c5cff9","#a09af4","#0e2e72","#dfffb2","#ba4303",
			"#ed0076","#d7f98e","#7388e2","#fc2afc","#23c481","#ef708c","#88e88d","#59f25e","#8de27c","#56a9b7",
			"#61e547","#031996","#efc5aa","#96e06d","#0beac1","#2baa22","#345b9e","#4fcc39","#f4add3","#7fd861",
			"#67db86","#53e2cb","#c673dd","#3eaaf2","#9b003b","#5a2291","#dbfc62","#9bdb6b","#c96310","#bc2528",
			"#f9ef9d","#53bf11","#c2d5f9","#7824c1","#f4b589","#e9ed87","#54ffe8"];
		
		private program: Program;
		private uniforms: Uniforms;
		private attributes: Attributes;
		
		private getRandomColor() {
			return this.colors[Math.floor(Math.random() * this.colors.length)];
		}

		public constructor(public gl: GL, public count: number) {
			this.program = gl.program(Shaders["lights.v"], Shaders["lights.f"]);
			this.attributes = this.program.attributes();
			this.uniforms = this.program.uniforms();
			
			var i, colors: number[] = [],
				points: number[] = [],
				radius: number[] = [];
			for (i = 0; i < this.count; i++) {
				points.push(Math.random() * 2 - 1, Math.random() * 2 - 1);
				radius.push(Math.random() * 0.23 + 0.02);
				let color = this.getRandomColor(),
					r = parseInt(color.substr(1, 2), 16) / 255.0,
					g = parseInt(color.substr(3, 2), 16) / 255.0,
					b = parseInt(color.substr(5, 2), 16) / 255.0;
				colors.push(r, g, b);
			}
			
			this.attributes.append("a_point", points)
				.append("a_radius", radius)
				.append("a_color", colors)
				.build().apply();
                
            this.uniforms.append("u_max_radius", gl.getPointSizeRange()[1]);
		}
		
		public setViewport(...v: number[]) {
			this.uniforms.append("u_viewport", v);
			return this;
		}
        
        public setMousePosition(v: number[]) {
            this.uniforms.append("u_mouse", v);
            return this;
        }
		
		public draw() {
			this.gl.settings()
					.enableBlend()
					.blendEquation(BlendEquation.ADD)
					.blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
					.disableDepthTest()
					.program(this.program)
					.attributes(this.attributes)
					.use(() => {
				this.attributes.apply();
				this.gl.drawPointsArrays(this.count);
			});
		}
		
		public dispose() {
			this.attributes.dispose();
			this.program.dispose();
		}
	}
    
    export class Bump implements Disposable {
		
		private program: Program;
		private uniforms: Uniforms;
		private attributes: Attributes;

		public constructor(public gl: GL, public count: number) {
			this.program = gl.program(Shaders["bump.v"], Shaders["bump.f"]);
			this.attributes = this.program.attributes();
			this.uniforms = this.program.uniforms();
            
            var points: number[] = [],
                colors: number[] = [];
            for (let i = 0; i < count; i++) {
                let r =  50 / (i + 50),
                    color = [Math.random(), Math.random(), 0.9],
                    originX = Math.random() * 2 - 1,
                    originY = Math.random() * 2 - 1;
                for (let j = 0; j < 3; j++) {
                    colors.push.apply(colors, color);
                    points.push(originX + (Math.random() * 3 - 1.5) * r);
                    points.push(originY + (Math.random() * 3 - 1.5) * r);
                }
            }
			
			this.attributes
                .append("a_point", points)
                .append("a_color", colors)
                .build().apply();
		}
		
		public draw() {
			this.gl.settings()
					.disableBlend()
					.disableDepthTest()
                    .clearColor([0, 0, 1, 1])
					.program(this.program)
					.attributes(this.attributes)
					.use(() => {
                this.gl.clearColorBuffer();
				this.attributes.apply();
				this.gl.drawTrianglesArrays(this.count * 3);
			});
		}
		
		public dispose() {
			this.attributes.dispose();
			this.program.dispose();
		}
	}
	
	export function start(canvas: HTMLCanvasElement) {
		var gl = new GL(canvas, { antialias: false }),
            mouse = new Mouse(),
			background = new Background(gl),
			snow = new Snow(gl, 600),
			lights = new Lights(gl, 100),
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
            var mousePosition = mouse.getPosition();
			background.draw();
			lights.setViewport(0, 0, canvas.width, canvas.height)
                .setMousePosition(mousePosition)
				.draw();
			snow.setRatio(canvas.width / canvas.height)
				.setTime(new Date().getTime() - startTime.getTime())
				.draw();
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
        
        
        // Audio
        var audio = <HTMLAudioElement>document.getElementById("audio"),
            audioButton = <HTMLDivElement>document.getElementById("audio_button"),
            autoStart = localStorage.getItem("play") !== "false",
            isPlayed = false;
        
        function setAudioState(state: boolean) {
            if (isPlayed !== state) {
                isPlayed = state;
                localStorage.setItem("play", state ? "true" : "false");
                if (state) {
                    audioButton.classList.remove("audio-off");
                    audioButton.classList.add("audio-on");
                } else {
                    audioButton.classList.remove("audio-on");
                    audioButton.classList.add("audio-off");
                }
            }
        }
        
        audio.addEventListener("canplay", function() {
            if (autoStart) {
                audio.play();
            }
        });
        
        audio.addEventListener("pause", function() {
            setAudioState(false);
        });
        audio.addEventListener("play", function() {
            setAudioState(true);
        });
        audio.addEventListener("playing", function() {
            setAudioState(true);
        });
        
        audioButton.addEventListener("click", function(e: MouseEvent) {
            if (isPlayed) {
                audio.pause();
            } else {
                audio.play();
            }
            e.preventDefault && e.preventDefault();
            e.defaultPrevented = true;
        });
        
        audio.load();
        if (autoStart) {
            audio.play();
        }
	}
	
}


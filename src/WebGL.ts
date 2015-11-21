/// <reference path="Base.ts"/>

module may.webgl {
    import using = may.using;
    import Disposable = may.Disposable;
    
    export var TEXTURES_COUNT = 16;
    
    export class GL {
        public handle: WebGLRenderingContext
        public constructor(source: HTMLCanvasElement|WebGLRenderingContext, settings: any = {}) {
            if (source instanceof HTMLCanvasElement) {
                this.handle = <WebGLRenderingContext>(source.getContext("webgl", settings) || source.getContext("experimental-webgl", settings));
                if (!this.handle) {
                    throw new Error("Could not create WebGL context");
                }
            } else {
                this.handle = <WebGLRenderingContext>source;
            }
        }
        public enableExtensions() {
            this.handle.getExtension("OES_texture_float");
            this.handle.getExtension("OES_texture_float_linear");
            this.handle.getExtension("EXT_color_buffer_float");
            this.handle.getExtension("WEBGL_color_buffer_float");
            return this;
        }
        public program(vertex: string, fragment: string) {
            return new Program(this, vertex, fragment);
        }
        public texture(): TextureBuilder {
            return new TextureBuilder(this);
        }
        public depth(width: number, height: number): DepthBuffer {
            return DepthBuffer.create(this, width, height);
        }
        public buffer() {
            return new BufferBuilder(this);
        }
        public frame() {
            return FrameBuffer.create(this);
        }
        public settings(): Settings {
            return new Settings(this);
        }
        public clearColorBuffer() {
            this.handle.clear(this.handle.COLOR_BUFFER_BIT);
            return this;
        }
        public clearDepthBuffer() {
            this.handle.clear(this.handle.DEPTH_BUFFER_BIT);
            return this;
        }
        /**
         * Clear color and depth buffer
         */
        public clearBuffers() {
            this.handle.clear(this.handle.COLOR_BUFFER_BIT | this.handle.DEPTH_BUFFER_BIT);
            return this;
        }
        public drawPointsArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.POINTS, 0, verticesCount);
            return this;
        }
        public drawLinesArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.LINES, 0, verticesCount);
            return this;
        }
        public drawLineStripArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.LINE_STRIP, 0, verticesCount);
            return this;
        }
        public drawLineLoopArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.LINE_LOOP, 0, verticesCount);
            return this;
        }
        public drawTrianglesArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.TRIANGLES, 0, verticesCount);
            return this;
        }
        public drawTriangleStripArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.TRIANGLE_STRIP, 0, verticesCount);
            return this;
        }
        public drawTriangleFanArrays(verticesCount: number) {
            this.handle.drawArrays(this.handle.TRIANGLE_FAN, 0, verticesCount);
            return this;
        }
        public drawPointsElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.POINTS, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawLinesElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.LINES, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawLineStripElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.LINE_STRIP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawLineLoopElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.LINE_LOOP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawTrianglesElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.TRIANGLES, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawTriangleStripElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.TRIANGLE_STRIP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
        public drawTriangleFanElemets(elemetsCount: number) {
            this.handle.drawElements(this.handle.TRIANGLE_FAN, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
            return this;
        }
    }
    
    export enum BlendEquation {
        ADD = 0x8006,
        SUB = 0x800A,
        RSUB = 0x800B
    }
    
    export enum BlendFunction {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 0x0300,
        ONE_MINUS_SRC_COLOR = 0x0301,
        DST_COLOR = 0x0306,
        ONE_MINUS_DST_COLOR = 0x0307,
        SRC_ALPHA = 0x0302,
        ONE_MINUS_SRC_ALPHA = 0x0303,
        DST_ALPHA = 0x0304,
        ONE_MINUS_DST_ALPHA = 0x0305,
        SRC_ALPHA_SATURATE = 0x0308
    }
    
    export class Settings {
        private v: {
            blend?: boolean
            depthTest?: boolean
            clearColor?: number[]
            clearDepth?: number
            renderBuffer?: WebGLRenderbuffer
            frameBuffer?: WebGLFramebuffer
            viewport?: number[]
            program?: WebGLProgram
            arrayBuffer?: WebGLBuffer
            elementArrayBuffer?: WebGLBuffer
            activeTexture?: number
            textureBinding?: WebGLTexture
            textures?: WebGLTexture[]
            blendEquation?: number[]
            blendFunction?: number[]
        } = {}
        static fields = {
            blend: {
                get: (gl) => gl.getParameter(gl.BLEND),
                set: (gl, value: boolean) => {
                    if (value) {
                        gl.enable(gl.BLEND);
                    } else {
                        gl.disable(gl.BLEND);
                    }
                }
            },
            blendEquation: {
                get: (gl: WebGLRenderingContext) => [gl.getParameter(gl.BLEND_EQUATION_RGB), gl.getParameter(gl.BLEND_EQUATION_ALPHA)],
                set: (gl: WebGLRenderingContext, value: number[]) => {
                    gl.blendEquationSeparate(value[0], value[1]);
                }
            },
            blendFunction: {
                get: (gl: WebGLRenderingContext) => [
                    gl.getParameter(gl.BLEND_SRC_RGB),
                    gl.getParameter(gl.BLEND_DST_RGB),
                    gl.getParameter(gl.BLEND_SRC_ALPHA),
                    gl.getParameter(gl.BLEND_DST_ALPHA)
                ],
                set: (gl: WebGLRenderingContext, value: number[]) => {
                    gl.blendFuncSeparate(value[0], value[1], value[2], value[3]);
                }
            },
            depthTest: {
                get: (gl) => gl.getParameter(gl.DEPTH_TEST),
                set: (gl, value) => {
                    if (value) {
                        gl.enable(gl.DEPTH_TEST);
                    } else {
                        gl.disable(gl.DEPTH_TEST);
                    }
                }
            },
            clearColor: {
                get: (gl) => gl.getParameter(gl.COLOR_CLEAR_VALUE),
                set: (gl, v: number[]) => {
                    gl.clearColor.apply(gl, v);
                }
            },
            clearDepth: {
                get: (gl) => gl.getParameter(gl.DEPTH_CLEAR_VALUE),
                set: (gl, v) => {
                    gl.clearDepth(v);
                }
            },
            renderBuffer: {
                get: (gl) => gl.getParameter(gl.RENDERBUFFER_BINDING),
                set: (gl, v) => {
                    gl.bindRenderbuffer(gl.RENDERBUFFER, v);
                }
            },
            frameBuffer: {
                get: (gl) => gl.getParameter(gl.FRAMEBUFFER_BINDING),
                set: (gl, v) => {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, v);
                }
            },
            viewport: {
                get: (gl) => gl.getParameter(gl.VIEWPORT),
                set: (gl, v) => {
                    gl.viewport.apply(gl, v);
                }
            },
            program: {
                get: (gl) => gl.getParameter(gl.CURRENT_PROGRAM),
                set: (gl, v) => {
                    gl.useProgram(v);
                }
            },
            arrayBuffer: {
                get: (gl) => gl.getParameter(gl.ARRAY_BUFFER_BINDING),
                set: (gl, v) => gl.bindBuffer(gl.ARRAY_BUFFER, v)
            },
            elementArrayBuffer: {
                get: (gl) => gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING),
                set: (gl, v) => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v)
            },
            activeTexture: {
                get: (gl) => gl.getParameter(gl.ACTIVE_TEXTURE),
                set: (gl, v) => gl.activeTexture(v)
            },
            textureBinding: {
                get: (gl) => gl.getParameter(gl.TEXTURE_BINDING_2D),
                set: (gl, v) => gl.bindTexture(gl.TEXTURE_2D, v)
            },
            textures: {
                get: (gl) => {
                    var i, active = Settings.fields.activeTexture,
                        binding = Settings.fields.textureBinding,
                        originalActiveIndex = active.get(gl),
                        result = [];
                    for (i = 0; i < TEXTURES_COUNT; i++) {
                        active.set(gl, gl.TEXTURE0 + i);
                        result[i] = binding.get(gl);
                    }
                    active.set(gl, originalActiveIndex);
                    return result;
                },
                set: (gl, v) => {
                    var i, active = Settings.fields.activeTexture,
                        binding = Settings.fields.textureBinding,
                        originalActiveIndex = active.get(gl);
                    for (i = 0; i < TEXTURES_COUNT; i++) {
                        if (v[i]) {
                            active.set(gl, gl.TEXTURE0 + i);
                            binding.set(gl, v[i]);
                        }
                    }
                    active.set(gl, originalActiveIndex);
                }
            }
        };
    
        constructor(public gl: GL) {}
        
        public enableBlend() {
            this.v.blend = true;
            return this;
        }
        public disableBlend() {
            this.v.blend = false;
            return this;
        }
        public blendEquation(rgb: BlendEquation, alpha: BlendEquation = rgb) {
            this.v.blendEquation = [rgb, alpha];
            return this;
        }
        public blendFunction(srcRgb: BlendFunction, destRgb: BlendFunction, srcAlpha: BlendFunction = srcRgb, destAlpha: BlendFunction = destRgb) {
            this.v.blendFunction = [srcRgb, destRgb, destAlpha, srcAlpha];
            return this;
        }
        public enableDepthTest() {
            this.v.depthTest = true;
            return this;
        }
        public disableDepthTest() {
            this.v.depthTest = false;
            return this;
        }
        public clearColor(color: number[]) {
            this.v.clearColor = color;
            return this;
        }
        public clearDepth(depth: number) {
            this.v.clearDepth = depth;
            return this;
        }
        public renderBuffer(buffer: DepthBuffer) {
            this.v.renderBuffer = buffer.handle;
            return this;
        }
        public frameBuffer(buffer: FrameBuffer) {
            this.v.frameBuffer = buffer.handle;
            return this;
        }
        public viewport(...area: number[]) {
            this.v.viewport = area;
            return this;
        }
        public program(program: Program) {
            this.v.program = program.handle;
            return this;
        }
        public arrayBuffer(buffer: Buffer) {
            this.v.arrayBuffer = buffer.handle;
            return this;
        }
        public elementArrayBuffer(buffer: Buffer) {
            this.v.elementArrayBuffer = buffer.handle;
            return this;
        }
        public activeTexture(index: number) {
            this.v.activeTexture = this.gl.handle.TEXTURE0 + index;
            return this;
        }
        public textureBinding(texture: Texture) {
            this.v.textureBinding = texture.handle;
            return this;
        }
        public textures(textures: Texture[]) {
            var i: number, handles: WebGLTexture[] = [];
            for (i = 0; i < textures.length; i++) {
                handles[i] = textures[i] ? textures[i].handle : null;
            }
            this.v.textures = handles;
            return this;
        }
        public use<T>(callback: { (): T }): T {
            var gl, i, oldValues, result: T, v, _ref;
            gl = this.gl.handle;
            oldValues = {};
            for (i in this.v) {
                v = this.v[i];
                oldValues[i] = Settings.fields[i].get(gl);
                Settings.fields[i].set(gl, v);
            }
            try {
                result = callback();
            } finally {
                for (i in oldValues) {
                    v = oldValues[i];
                    Settings.fields[i].set(gl, v);
                }
            }
            return result;
        }
    }
    
    export class TextureBuilder {
        private v: any
        public constructor(public gl: GL) {
            var glh = this.gl.handle;
            this.v = {
                width: 0,
                height: 0,
                data: null,
                image: null,
                format: glh.RGBA,
                filter: glh.LINEAR,
                wrapS: glh.CLAMP_TO_EDGE,
                wrapT: glh.CLAMP_TO_EDGE,
                type: glh.UNSIGNED_BYTE
            };
        }
    
        public build() {
            var gl = this.gl.handle,
                texture,
                v = this.v;
            if (v.image) {
                v.width = v.image.width;
                v.height = v.image.height;
            }
            if (!v.width) throw new Error("Width not defined");
            if (!v.height) throw new Error("Height not defined");
            texture = new Texture(this.gl, gl.createTexture(), v.width, v.height);
            texture.use(() => {
                var TEXTURE_2D = gl.TEXTURE_2D;
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, v.filter);
                gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MIN_FILTER, v.filter);
                gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_S, v.wrapS);
                gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_T, v.wrapT);
                if (v.image) {
                    (<any>gl).texImage2D(TEXTURE_2D, 0, v.format, v.format, v.type, v.image)
                } else {
                    (<any>gl).texImage2D(TEXTURE_2D, 0, v.format, v.width, v.height, 0, v.format, v.type, v.data || null);
                }
            });
            return texture;
        }
    
        public width(w : Number) {
            this.v.width = w;
            return this;
        }
        public height(h : Number) {
            this.v.height = h;
            return this;
        }
        public formatA() {
            this.v.format = this.gl.handle.ALPHA;
            return this;
        }
        public formatL() {
            this.v.format = this.gl.handle.LUMINANCE;
            return this;
        }
        public formatLA() {
            this.v.format = this.gl.handle.LUMINANCE_ALPHA;
            return this;
        }
        public formatRGB() {
            this.v.format = this.gl.handle.RGB;
            return this;
        }
        public formatRGBA() {
            this.v.format = this.gl.handle.RGBA;
            return this;
        }
        public filterNearest() {
            this.v.filter = this.gl.handle.NEAREST;
            return this;
        }
        public filterLinear() {
            this.v.filter = this.gl.handle.LINEAR;
            return this;
        }
        public wrapSClampToEdge() {
            this.v.wrapS = this.gl.handle.CLAMP_TO_EDGE;
            return this;
        }
        public wrapTClampToEdge() {
            this.v.wrapT = this.gl.handle.CLAMP_TO_EDGE;
            return this;
        }
        public wrapClampToEdge() {
            this.v.wrapS = this.gl.handle.CLAMP_TO_EDGE;
            this.v.wrapT = this.gl.handle.CLAMP_TO_EDGE;
            return this;
        }
        public wrapSRepeat() {
            this.v.wrapS = this.gl.handle.REPEAT;
            return this;
        }
        public wrapTRepeat() {
            this.v.wrapT = this.gl.handle.REPEAT;
            return this;
        }
        public wrapRepeat() {
            this.v.wrapS = this.gl.handle.REPEAT;
            this.v.wrapT = this.gl.handle.REPEAT;
            return this;
        }
        public wrapSMirrored() {
            this.v.wrapS = this.gl.handle.MIRRORED_REPEAT;
            return this;
        }
        public wrapTMirrored() {
            this.v.wrapT = this.gl.handle.MIRRORED_REPEAT;
            return this;
        }
        public wrapMirrored() {
            this.v.wrapS = this.gl.handle.MIRRORED_REPEAT;
            this.v.wrapT = this.gl.handle.MIRRORED_REPEAT;
            return this;
        }
        public image(img : HTMLImageElement) {
            this.v.width = img.width;
            this.v.height = img.height;
            this.v.image = img;
            return this;
        }
        public typeByte() {
            this.v.type = this.gl.handle.UNSIGNED_BYTE;
            return this;
        }
        public typeFloat() {
            this.v.type = this.gl.handle.FLOAT;
            return this;
        }
        public data(data) {
            this.v.data = data;
            return this;
        }
    }
    
    export class Texture extends Identified implements Disposable {
        constructor(public gl: GL, public handle: WebGLTexture, public width: number, public height: number) {
            super();
        }
        public use<R>(callback: { (): R }): R;
        public use<R>(index: number, callback: { (): R }): R;
        public use(...args) {
            var callback, index: number,
                gl = this.gl;
            if (args.length === 1) {
                index = 0;
                callback = args[0];
            } else {
                index = args[0];
                callback = args[1];
            }
            return gl.settings().activeTexture(index).use(()=> {
                return gl.settings().textureBinding(this).use(callback);
            });
        }
        public name(): string {
            return `texture_${this.id.toFixed()}`;
        }
        public dispose() {
            this.gl.handle.deleteTexture(this.handle);
            this.handle = null;
        }
    }
    
    type TypedArray = Int32Array|Uint32Array|Int16Array|Uint16Array|Int8Array|Uint8Array|Float32Array;
    
    export class BufferBuilder {
        private v: {
            data: any,
            elementsCount?: number,
            elementSize?: number,
            usage?: number,
            wrapper?: { new(source: number[]): TypedArray },
            target?: number
        } = {
            data: null
        }
        public constructor(public gl: GL) {
            this.v.wrapper = Float32Array;
            this.v.elementSize = 4;
        }
        public targetArray() {
            this.v.target = this.gl.handle.ARRAY_BUFFER;
            return this;
        }
        public targetElements() {
            this.v.target = this.gl.handle.ELEMENT_ARRAY_BUFFER;
            return this;
        }
        /**
         * The data store contents will be modified once and used at most a few times.
         */
        public streamDraw() {
            this.v.usage = this.gl.handle.STREAM_DRAW;
            return this;
        }
        /**
         * The data store contents will be modified once and used many times.
         */
        public staticDraw() {
            this.v.usage = this.gl.handle.STATIC_DRAW;
            return this;
        }
        /**
         * The data store contents will be modified repeatedly and used many times.
         */
        public dynamicDraw() {
            this.v.usage = this.gl.handle.DYNAMIC_DRAW;
            return this;
        }
        public elementsCount(count: number) {
            this.v.elementsCount = count;
            return this;
        }
        public elementSize(size: number) {
            this.v.elementSize = size;
            return this;
        }
        public data(data: number[]|Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array) {
            this.v.data = data;
            return this;
        }
        public typeByte() {
            this.v.wrapper = Int8Array;
            this.v.elementSize = 1;
            return this;
        }
        public typeUByte() {
            this.v.wrapper = Uint8Array;
            this.v.elementSize = 1;
            return this;
        }
        public typeShort() {
            this.v.wrapper = Int16Array;
            this.v.elementSize = 2;
            return this;
        }
        public typeUShort() {
            this.v.wrapper = Uint16Array;
            this.v.elementSize = 2;
            return this;
        }
        public typeInt() {
            this.v.wrapper = Int32Array;
            this.v.elementSize = 4;
            return this;
        }
        public typeUInt() {
            this.v.wrapper = Uint32Array;
            this.v.elementSize = 4;
            return this;
        }
        public typeFloat() {
            this.v.wrapper = Float32Array;
            this.v.elementSize = 4;
            return this;
        }
        public build() {
            var v = this.v;
            if (!v.usage) throw new Error("Buffer usage not specified");
            if (!v.data && !v.elementsCount)  throw new Error("Buffer data and size not specified");
            if (!v.target) throw new Error("Buffer target not specified");
            
            var nativeData = v.data ? new v.wrapper(v.data) : null,
                handle = this.gl.handle.createBuffer(),
                buffer = new Buffer(this.gl, handle, nativeData ? nativeData.byteLength : v.elementsCount * v.elementSize, nativeData ? nativeData.BYTES_PER_ELEMENT : v.elementSize, v.usage, v.target);
            
            buffer.use(() => {
                this.gl.handle.bufferData(v.target, v.data ? nativeData : v.elementsCount, v.usage);
            });
            
            return buffer;
        }
    }
    
    export class Buffer extends Identified implements Disposable {
        public id: number
        public constructor(public gl: GL, public handle: WebGLBuffer, public bytesSize: number, public elementSize: number, public usage: number, public target: number) {
            super();
        }
        public use<R>(callback: { (): R }): R {
            var gl = this.gl,
                glh = gl.handle;
            if (this.target === glh.ARRAY_BUFFER) {
                return this.gl.settings().arrayBuffer(this).use(callback);
            } else if (this.target === glh.ELEMENT_ARRAY_BUFFER) {
                return this.gl.settings().elementArrayBuffer(this).use(callback);
            } else
                throw new Error("Invalid buffer target");
        }
        public dispose() {
            this.gl.handle.deleteBuffer(this.handle);
            this.handle = null;
        }
    }
    
    export class DepthBuffer extends Identified {
        public static create(gl: GL, width: number, height: number) {
            var glh = gl.handle,
                handle = glh.createRenderbuffer(),
                buffer = new DepthBuffer(gl, handle, width, height);
            buffer.use(() => {
                glh.renderbufferStorage(glh.RENDERBUFFER, glh.DEPTH_COMPONENT16, width, height);
            });
            return buffer;
        }
        public id: number
        public constructor(public gl: GL, public handle: WebGLRenderbuffer, public width: number, public height: number) {
            super();
        }
        public use<T>(callback: { (): T }): T {
            return this.gl.settings().renderBuffer(this).use(callback);
        }
        public dispose() {
            this.gl.handle.deleteRenderbuffer(this.handle);
            this.handle = null;
        }
    }
    
    export class FrameBuffer extends Identified {
        public static create(gl: GL) {
            var handle = gl.handle.createFramebuffer();
            return new FrameBuffer(gl, handle);
        }
        public id: number
        constructor(public gl: GL, public handle: WebGLFramebuffer) {
            super();
        }
        public setColorBuffer(buffer: Texture) {
            this.gl.settings().frameBuffer(this).use(() => {
                var gl = this.gl.handle;
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, buffer.handle, 0);
            });
            return this;
        }
        public setDepthBuffer(buffer: DepthBuffer) {
            this.gl.settings().frameBuffer(this).use(() => {
                var gl = this.gl.handle;
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, buffer.handle);
            });
            return this;
        }
        public use<T>(callback: { (): T }) {
            return this.gl.settings().frameBuffer(this).use(() => {
                return callback();
            });
        }
        public hasColor(): boolean {
            var gl = this.gl.handle;
            return this.use(() => gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) !== gl.NONE);
        }
        public hasDepth(): boolean {
            var gl = this.gl.handle;
            return this.use(() => gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) !== gl.NONE);
        }
        public isComplete(): boolean {
            var gl = this.gl.handle;
            return this.use(() => gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);
        }
        public dispose() {
            this.gl.handle.deleteFramebuffer(this.handle);
            return null;
        }
    }
    
    export class Attributes implements Disposable {
        private stride: number = 0;
        private length: number = -1;
        private data: Set<{ offset: number, size: number, data: number[]|Float32Array }> = {};
        private buffer: Buffer = null;
        public gl: GL;
        public constructor(public program: Program) {
            let gl = program.gl.handle,
                ph = program.handle,
                count = gl.getProgramParameter(ph, gl.ACTIVE_ATTRIBUTES);
            this.gl = program.gl;
            for (let i = 0; i < count; i++) {
                let attribute = gl.getActiveAttrib(ph, i);
                let s: number;
                switch (attribute.type) {
                    case gl.FLOAT:
                        s = 1;
                        break;
                    case gl.FLOAT_VEC2:
                        s = 2;
                        break;
                    case gl.FLOAT_VEC3:
                        s = 3;
                        break;                
                    case gl.FLOAT_VEC4:
                        s = 4;
                        break;
                    default:
                        throw new Error("Attribute '" + attribute.name + "' has unsupported type");
                }
                this.data[attribute.name] = {
                    size: s,
                    offset: this.stride,
                    data: null
                };
                this.stride += s;
            }
        }
        public append(name: string, data: number[]|Float32Array) {
            if (this.buffer) {
                throw new Error(`Can't modify attributes cause 'apply' was called`);
            }
            
            let l = data.length / this.data[name].size;
            if (l !== Math.floor(l)) {
                throw new Error(`Invlid attribute '${name}' length`);
            }
            if (this.length === -1) {
                this.length = l;
            } else if (this.length !== l) {
                throw new Error(`Attribute '${name}' length mismatch`);
            }
            this.data[name].data = data;
            return this;
        }
        public apply() {
            var data = this.data,
                gl = this.gl.handle;
            
            if (!this.buffer) {
                let l = this.length,
                    s = this.stride;
                for (let name in data) {
                    if (!data[name].data) {
                        throw new Error(`Attribute '${name}' not defined`);
                    }
                }
                
                let content = new Float32Array(l * s);
                for (let i = 0; i < l; i++) {
                    var o = i * s;
                    for (let name in data) {
                        let item = data[name],
                            is = item.size,
                            io = o + item.offset,
                            id = item.data;
                        for (let j = 0; j < is; j++) {
                            content[io + j] = id[i * is + j];
                        }
                    }
                }
                
                this.buffer = this.program.gl.buffer()
                        .targetArray()
                        .typeFloat()
                        .streamDraw()
                        .data(content)
                        .build();
            }
            
            let ph = this.program.handle;
            this.program.use(() => this.buffer.use(() => {
                for (let name in data) {
                    let location = gl.getAttribLocation(ph, name),
                        item = data[name];
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, item.size, gl.FLOAT, false, this.stride * 4, item.offset * 4);
                }
            }));
        }
        public dispose() {
            if (this.buffer) {
                this.buffer.dispose();
            }
        }
    }
    
    export class Uniforms {
        public gl: GL;
        private info: Set<WebGLActiveInfo> = {};
        public constructor(public program: Program) {
            this.gl = program.gl;
            var glh = this.gl.handle;
            var uniformsCount = glh.getProgramParameter(program.handle, glh.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformsCount; i++) {
                let uniform = glh.getActiveUniform(program.handle, i);
                this.info[uniform.name] = uniform;
            }
        }
        public append(name: string, value: any) {
            var gl = this.gl.handle,
                location = gl.getUniformLocation(this.program.handle, name),
                info = this.info[name];

            if (!info) {
                console.warn(`Uniform '${name}' not found`);
                return this;
            }

            this.program.use(() => {
                switch (info.type) {
                    case gl.FLOAT:
                        return gl.uniform1f(location, value);
                    case gl.INT:
                        return gl.uniform1i(location, value);
                    case gl.FLOAT_VEC2:
                        return gl.uniform2fv(location, new Float32Array(value));
                    case gl.INT_VEC2:
                        return gl.uniform2iv(location, new Int32Array(value));
                    case gl.FLOAT_VEC3:
                        return gl.uniform3fv(location, new Float32Array(value));
                    case gl.INT_VEC3:
                        return gl.uniform3iv(location, new Int32Array(value));
                    case gl.FLOAT_VEC4:
                        return gl.uniform4fv(location, new Float32Array(value));
                    case gl.INT_VEC4:
                        return gl.uniform4iv(location, new Int32Array(value));
                    case gl.SAMPLER_2D:
                        return gl.uniform1i(location, value);
                    default:
                        throw new Error("Uniform '" + name + "' has unsupported type");
                }
            });
            return this;
        }
    }
    
    export class Program extends may.Identified {
        public handle: WebGLProgram
        public vertex: Shader
        public fragment: Shader
        private uniformsInfo: { [name: string]: WebGLActiveInfo }
        public constructor(public gl: GL, vertex: string, fragment: string) {
            super();
            var attribute: WebGLActiveInfo,
                uniform: WebGLActiveInfo,
                i: number;
            var glh = this.gl.handle;
            this.handle = glh.createProgram();
            this.vertex = new Shader(this.gl, glh.VERTEX_SHADER, vertex).attach(this);
            this.fragment = new Shader(this.gl, glh.FRAGMENT_SHADER, fragment).attach(this);
            glh.linkProgram(this.handle);
            if (!glh.getProgramParameter(this.handle, glh.LINK_STATUS)) {
                throw new Error(glh.getProgramInfoLog(this.handle));
            }
        }
    
        public uniforms() {
            return new Uniforms(this);
        }
        
        public attributes(): Attributes {
            return new Attributes(this);
        }
    
        public use<T>(callback: { (): T }): T {
            return this.gl.settings().program(this).use(callback);
        }
    
        public dispose() {
            this.gl.handle.deleteProgram(this.handle);
            this.handle = null;
            this.vertex.dispose();
            this.vertex = null;
            this.fragment.dispose();
            this.fragment = null;
            return null;
        }
    }
    
    export class Shader extends may.Identified {
        handle: WebGLShader
        constructor(public gl: GL, public type: number, source: string) {
            super();
            var glh = this.gl.handle;
            this.handle = glh.createShader(this.type);
            glh.shaderSource(this.handle, source);
            glh.compileShader(this.handle);
            if (!glh.getShaderParameter(this.handle, glh.COMPILE_STATUS)) {
                throw new Error(glh.getShaderInfoLog(this.handle));
            }
        }
        public attach(program: Program) {
            this.gl.handle.attachShader(program.handle, this.handle);
            return this;
        }
        public dispose() {
            this.gl.handle.deleteShader(this.handle);
            this.handle = null;
        }
    }
}

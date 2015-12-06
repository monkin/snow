var may;
(function (may) {
    var Identified = (function () {
        function Identified() {
            this.id = Identified.sequence++;
        }
        Identified.sequence = 1;
        return Identified;
    })();
    may.Identified = Identified;
    function using() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var l = args.length - 1, result;
        try {
            result = args[l].apply(null, args);
        }
        finally {
            for (var i = 0; i < l; i++) {
                args[i].dispose();
            }
        }
        return result;
    }
    may.using = using;
})(may || (may = {}));
/// <reference path="Base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var may;
(function (may) {
    var webgl;
    (function (webgl) {
        webgl.TEXTURES_COUNT = 16;
        var GL = (function () {
            function GL(source, settings) {
                if (settings === void 0) { settings = {}; }
                if (source instanceof HTMLCanvasElement) {
                    this.handle = (source.getContext("webgl", settings) || source.getContext("experimental-webgl", settings));
                    if (!this.handle) {
                        throw new Error("Could not create WebGL context");
                    }
                }
                else {
                    this.handle = source;
                }
            }
            GL.prototype.enableExtensions = function () {
                this.handle.getExtension("OES_texture_float");
                this.handle.getExtension("OES_texture_float_linear");
                this.handle.getExtension("EXT_color_buffer_float");
                this.handle.getExtension("WEBGL_color_buffer_float");
                return this;
            };
            GL.prototype.program = function (vertex, fragment) {
                return new Program(this, vertex, fragment);
            };
            GL.prototype.texture = function () {
                return new TextureBuilder(this);
            };
            GL.prototype.depth = function (width, height) {
                return DepthBuffer.create(this, width, height);
            };
            GL.prototype.buffer = function () {
                return new BufferBuilder(this);
            };
            GL.prototype.frame = function () {
                return FrameBuffer.create(this);
            };
            GL.prototype.settings = function () {
                return new Settings(this);
            };
            GL.prototype.clearColorBuffer = function () {
                this.handle.clear(this.handle.COLOR_BUFFER_BIT);
                return this;
            };
            GL.prototype.clearDepthBuffer = function () {
                this.handle.clear(this.handle.DEPTH_BUFFER_BIT);
                return this;
            };
            /**
             * Clear color and depth buffer
             */
            GL.prototype.clearBuffers = function () {
                this.handle.clear(this.handle.COLOR_BUFFER_BIT | this.handle.DEPTH_BUFFER_BIT);
                return this;
            };
            GL.prototype.drawPointsArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.POINTS, 0, verticesCount);
                return this;
            };
            GL.prototype.drawLinesArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.LINES, 0, verticesCount);
                return this;
            };
            GL.prototype.drawLineStripArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.LINE_STRIP, 0, verticesCount);
                return this;
            };
            GL.prototype.drawLineLoopArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.LINE_LOOP, 0, verticesCount);
                return this;
            };
            GL.prototype.drawTrianglesArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.TRIANGLES, 0, verticesCount);
                return this;
            };
            GL.prototype.drawTriangleStripArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.TRIANGLE_STRIP, 0, verticesCount);
                return this;
            };
            GL.prototype.drawTriangleFanArrays = function (verticesCount) {
                this.handle.drawArrays(this.handle.TRIANGLE_FAN, 0, verticesCount);
                return this;
            };
            GL.prototype.drawPointsElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.POINTS, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawLinesElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.LINES, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawLineStripElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.LINE_STRIP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawLineLoopElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.LINE_LOOP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawTrianglesElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.TRIANGLES, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawTriangleStripElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.TRIANGLE_STRIP, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            GL.prototype.drawTriangleFanElemets = function (elemetsCount) {
                this.handle.drawElements(this.handle.TRIANGLE_FAN, elemetsCount, this.handle.UNSIGNED_SHORT, 0);
                return this;
            };
            return GL;
        })();
        webgl.GL = GL;
        (function (BlendEquation) {
            BlendEquation[BlendEquation["ADD"] = 32774] = "ADD";
            BlendEquation[BlendEquation["SUB"] = 32778] = "SUB";
            BlendEquation[BlendEquation["RSUB"] = 32779] = "RSUB";
        })(webgl.BlendEquation || (webgl.BlendEquation = {}));
        var BlendEquation = webgl.BlendEquation;
        (function (BlendFunction) {
            BlendFunction[BlendFunction["ZERO"] = 0] = "ZERO";
            BlendFunction[BlendFunction["ONE"] = 1] = "ONE";
            BlendFunction[BlendFunction["SRC_COLOR"] = 768] = "SRC_COLOR";
            BlendFunction[BlendFunction["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
            BlendFunction[BlendFunction["DST_COLOR"] = 774] = "DST_COLOR";
            BlendFunction[BlendFunction["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
            BlendFunction[BlendFunction["SRC_ALPHA"] = 770] = "SRC_ALPHA";
            BlendFunction[BlendFunction["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
            BlendFunction[BlendFunction["DST_ALPHA"] = 772] = "DST_ALPHA";
            BlendFunction[BlendFunction["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
            BlendFunction[BlendFunction["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
        })(webgl.BlendFunction || (webgl.BlendFunction = {}));
        var BlendFunction = webgl.BlendFunction;
        var Settings = (function () {
            function Settings(gl) {
                this.gl = gl;
                this.v = {};
            }
            Settings.prototype.enableBlend = function () {
                this.v.blend = true;
                return this;
            };
            Settings.prototype.disableBlend = function () {
                this.v.blend = false;
                return this;
            };
            Settings.prototype.blendEquation = function (rgb, alpha) {
                if (alpha === void 0) { alpha = rgb; }
                this.v.blendEquation = [rgb, alpha];
                return this;
            };
            Settings.prototype.blendFunction = function (srcRgb, destRgb, srcAlpha, destAlpha) {
                if (srcAlpha === void 0) { srcAlpha = srcRgb; }
                if (destAlpha === void 0) { destAlpha = destRgb; }
                this.v.blendFunction = [srcRgb, destRgb, destAlpha, srcAlpha];
                return this;
            };
            Settings.prototype.enableDepthTest = function () {
                this.v.depthTest = true;
                return this;
            };
            Settings.prototype.disableDepthTest = function () {
                this.v.depthTest = false;
                return this;
            };
            Settings.prototype.clearColor = function (color) {
                this.v.clearColor = color;
                return this;
            };
            Settings.prototype.clearDepth = function (depth) {
                this.v.clearDepth = depth;
                return this;
            };
            Settings.prototype.renderBuffer = function (buffer) {
                this.v.renderBuffer = buffer.handle;
                return this;
            };
            Settings.prototype.frameBuffer = function (buffer) {
                this.v.frameBuffer = buffer.handle;
                return this;
            };
            Settings.prototype.viewport = function () {
                var area = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    area[_i - 0] = arguments[_i];
                }
                this.v.viewport = area;
                return this;
            };
            Settings.prototype.program = function (program) {
                this.v.program = program.handle;
                return this;
            };
            Settings.prototype.arrayBuffer = function (buffer) {
                this.v.arrayBuffer = buffer.handle;
                return this;
            };
            /**
             * Bind attributes array buffer
             */
            Settings.prototype.attributes = function (attributes) {
                if (!attributes.buffer) {
                    throw new Error("Attributes shuld be builded before attaching it to settings");
                }
                else {
                    this.v.arrayBuffer = attributes.buffer.handle;
                    return this;
                }
            };
            Settings.prototype.elementArrayBuffer = function (buffer) {
                this.v.elementArrayBuffer = buffer.handle;
                return this;
            };
            Settings.prototype.activeTexture = function (index) {
                this.v.activeTexture = this.gl.handle.TEXTURE0 + index;
                return this;
            };
            Settings.prototype.textureBinding = function (texture) {
                this.v.textureBinding = texture.handle;
                return this;
            };
            Settings.prototype.textures = function (textures) {
                var i, handles = [];
                for (i = 0; i < textures.length; i++) {
                    handles[i] = textures[i] ? textures[i].handle : null;
                }
                this.v.textures = handles;
                return this;
            };
            Settings.prototype.use = function (callback) {
                var gl, i, oldValues, result, v, _ref;
                gl = this.gl.handle;
                oldValues = {};
                for (i in this.v) {
                    v = this.v[i];
                    oldValues[i] = Settings.fields[i].get(gl);
                    Settings.fields[i].set(gl, v);
                }
                try {
                    result = callback();
                }
                finally {
                    for (i in oldValues) {
                        v = oldValues[i];
                        Settings.fields[i].set(gl, v);
                    }
                }
                return result;
            };
            Settings.fields = {
                blend: {
                    get: function (gl) { return gl.getParameter(gl.BLEND); },
                    set: function (gl, value) {
                        if (value) {
                            gl.enable(gl.BLEND);
                        }
                        else {
                            gl.disable(gl.BLEND);
                        }
                    }
                },
                blendEquation: {
                    get: function (gl) { return [gl.getParameter(gl.BLEND_EQUATION_RGB), gl.getParameter(gl.BLEND_EQUATION_ALPHA)]; },
                    set: function (gl, value) {
                        gl.blendEquationSeparate(value[0], value[1]);
                    }
                },
                blendFunction: {
                    get: function (gl) { return [
                        gl.getParameter(gl.BLEND_SRC_RGB),
                        gl.getParameter(gl.BLEND_DST_RGB),
                        gl.getParameter(gl.BLEND_SRC_ALPHA),
                        gl.getParameter(gl.BLEND_DST_ALPHA)
                    ]; },
                    set: function (gl, value) {
                        gl.blendFuncSeparate(value[0], value[1], value[2], value[3]);
                    }
                },
                depthTest: {
                    get: function (gl) { return gl.getParameter(gl.DEPTH_TEST); },
                    set: function (gl, value) {
                        if (value) {
                            gl.enable(gl.DEPTH_TEST);
                        }
                        else {
                            gl.disable(gl.DEPTH_TEST);
                        }
                    }
                },
                clearColor: {
                    get: function (gl) { return gl.getParameter(gl.COLOR_CLEAR_VALUE); },
                    set: function (gl, v) {
                        gl.clearColor.apply(gl, v);
                    }
                },
                clearDepth: {
                    get: function (gl) { return gl.getParameter(gl.DEPTH_CLEAR_VALUE); },
                    set: function (gl, v) {
                        gl.clearDepth(v);
                    }
                },
                renderBuffer: {
                    get: function (gl) { return gl.getParameter(gl.RENDERBUFFER_BINDING); },
                    set: function (gl, v) {
                        gl.bindRenderbuffer(gl.RENDERBUFFER, v);
                    }
                },
                frameBuffer: {
                    get: function (gl) { return gl.getParameter(gl.FRAMEBUFFER_BINDING); },
                    set: function (gl, v) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, v);
                    }
                },
                viewport: {
                    get: function (gl) { return gl.getParameter(gl.VIEWPORT); },
                    set: function (gl, v) {
                        gl.viewport.apply(gl, v);
                    }
                },
                program: {
                    get: function (gl) { return gl.getParameter(gl.CURRENT_PROGRAM); },
                    set: function (gl, v) {
                        gl.useProgram(v);
                    }
                },
                arrayBuffer: {
                    get: function (gl) { return gl.getParameter(gl.ARRAY_BUFFER_BINDING); },
                    set: function (gl, v) { return gl.bindBuffer(gl.ARRAY_BUFFER, v); }
                },
                elementArrayBuffer: {
                    get: function (gl) { return gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING); },
                    set: function (gl, v) { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v); }
                },
                activeTexture: {
                    get: function (gl) { return gl.getParameter(gl.ACTIVE_TEXTURE); },
                    set: function (gl, v) { return gl.activeTexture(v); }
                },
                textureBinding: {
                    get: function (gl) { return gl.getParameter(gl.TEXTURE_BINDING_2D); },
                    set: function (gl, v) { return gl.bindTexture(gl.TEXTURE_2D, v); }
                },
                textures: {
                    get: function (gl) {
                        var i, active = Settings.fields.activeTexture, binding = Settings.fields.textureBinding, originalActiveIndex = active.get(gl), result = [];
                        for (i = 0; i < webgl.TEXTURES_COUNT; i++) {
                            active.set(gl, gl.TEXTURE0 + i);
                            result[i] = binding.get(gl);
                        }
                        active.set(gl, originalActiveIndex);
                        return result;
                    },
                    set: function (gl, v) {
                        var i, active = Settings.fields.activeTexture, binding = Settings.fields.textureBinding, originalActiveIndex = active.get(gl);
                        for (i = 0; i < webgl.TEXTURES_COUNT; i++) {
                            if (v[i]) {
                                active.set(gl, gl.TEXTURE0 + i);
                                binding.set(gl, v[i]);
                            }
                        }
                        active.set(gl, originalActiveIndex);
                    }
                }
            };
            return Settings;
        })();
        webgl.Settings = Settings;
        var TextureBuilder = (function () {
            function TextureBuilder(gl) {
                this.gl = gl;
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
            TextureBuilder.prototype.build = function () {
                var gl = this.gl.handle, texture, v = this.v;
                if (v.image) {
                    v.width = v.image.width;
                    v.height = v.image.height;
                }
                if (!v.width)
                    throw new Error("Width not defined");
                if (!v.height)
                    throw new Error("Height not defined");
                texture = new Texture(this.gl, gl.createTexture(), v.width, v.height);
                texture.use(function () {
                    var TEXTURE_2D = gl.TEXTURE_2D;
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                    gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, v.filter);
                    gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MIN_FILTER, v.filter);
                    gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_S, v.wrapS);
                    gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_T, v.wrapT);
                    if (v.image) {
                        gl.texImage2D(TEXTURE_2D, 0, v.format, v.format, v.type, v.image);
                    }
                    else {
                        gl.texImage2D(TEXTURE_2D, 0, v.format, v.width, v.height, 0, v.format, v.type, v.data || null);
                    }
                });
                return texture;
            };
            TextureBuilder.prototype.width = function (w) {
                this.v.width = w;
                return this;
            };
            TextureBuilder.prototype.height = function (h) {
                this.v.height = h;
                return this;
            };
            TextureBuilder.prototype.formatA = function () {
                this.v.format = this.gl.handle.ALPHA;
                return this;
            };
            TextureBuilder.prototype.formatL = function () {
                this.v.format = this.gl.handle.LUMINANCE;
                return this;
            };
            TextureBuilder.prototype.formatLA = function () {
                this.v.format = this.gl.handle.LUMINANCE_ALPHA;
                return this;
            };
            TextureBuilder.prototype.formatRGB = function () {
                this.v.format = this.gl.handle.RGB;
                return this;
            };
            TextureBuilder.prototype.formatRGBA = function () {
                this.v.format = this.gl.handle.RGBA;
                return this;
            };
            TextureBuilder.prototype.filterNearest = function () {
                this.v.filter = this.gl.handle.NEAREST;
                return this;
            };
            TextureBuilder.prototype.filterLinear = function () {
                this.v.filter = this.gl.handle.LINEAR;
                return this;
            };
            TextureBuilder.prototype.wrapSClampToEdge = function () {
                this.v.wrapS = this.gl.handle.CLAMP_TO_EDGE;
                return this;
            };
            TextureBuilder.prototype.wrapTClampToEdge = function () {
                this.v.wrapT = this.gl.handle.CLAMP_TO_EDGE;
                return this;
            };
            TextureBuilder.prototype.wrapClampToEdge = function () {
                this.v.wrapS = this.gl.handle.CLAMP_TO_EDGE;
                this.v.wrapT = this.gl.handle.CLAMP_TO_EDGE;
                return this;
            };
            TextureBuilder.prototype.wrapSRepeat = function () {
                this.v.wrapS = this.gl.handle.REPEAT;
                return this;
            };
            TextureBuilder.prototype.wrapTRepeat = function () {
                this.v.wrapT = this.gl.handle.REPEAT;
                return this;
            };
            TextureBuilder.prototype.wrapRepeat = function () {
                this.v.wrapS = this.gl.handle.REPEAT;
                this.v.wrapT = this.gl.handle.REPEAT;
                return this;
            };
            TextureBuilder.prototype.wrapSMirrored = function () {
                this.v.wrapS = this.gl.handle.MIRRORED_REPEAT;
                return this;
            };
            TextureBuilder.prototype.wrapTMirrored = function () {
                this.v.wrapT = this.gl.handle.MIRRORED_REPEAT;
                return this;
            };
            TextureBuilder.prototype.wrapMirrored = function () {
                this.v.wrapS = this.gl.handle.MIRRORED_REPEAT;
                this.v.wrapT = this.gl.handle.MIRRORED_REPEAT;
                return this;
            };
            TextureBuilder.prototype.image = function (img) {
                this.v.width = img.width;
                this.v.height = img.height;
                this.v.image = img;
                return this;
            };
            TextureBuilder.prototype.typeByte = function () {
                this.v.type = this.gl.handle.UNSIGNED_BYTE;
                return this;
            };
            TextureBuilder.prototype.typeFloat = function () {
                this.v.type = this.gl.handle.FLOAT;
                return this;
            };
            TextureBuilder.prototype.data = function (data) {
                this.v.data = data;
                return this;
            };
            return TextureBuilder;
        })();
        webgl.TextureBuilder = TextureBuilder;
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(gl, handle, width, height) {
                _super.call(this);
                this.gl = gl;
                this.handle = handle;
                this.width = width;
                this.height = height;
            }
            Texture.prototype.use = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var callback, index, gl = this.gl;
                if (args.length === 1) {
                    index = 0;
                    callback = args[0];
                }
                else {
                    index = args[0];
                    callback = args[1];
                }
                return gl.settings().activeTexture(index).use(function () {
                    return gl.settings().textureBinding(_this).use(callback);
                });
            };
            Texture.prototype.name = function () {
                return "texture_" + this.id.toFixed();
            };
            Texture.prototype.dispose = function () {
                this.gl.handle.deleteTexture(this.handle);
                this.handle = null;
            };
            return Texture;
        })(may.Identified);
        webgl.Texture = Texture;
        var BufferBuilder = (function () {
            function BufferBuilder(gl) {
                this.gl = gl;
                this.v = {
                    data: null
                };
                this.v.wrapper = Float32Array;
                this.v.elementSize = 4;
            }
            BufferBuilder.prototype.targetArray = function () {
                this.v.target = this.gl.handle.ARRAY_BUFFER;
                return this;
            };
            BufferBuilder.prototype.targetElements = function () {
                this.v.target = this.gl.handle.ELEMENT_ARRAY_BUFFER;
                return this;
            };
            /**
             * The data store contents will be modified once and used at most a few times.
             */
            BufferBuilder.prototype.streamDraw = function () {
                this.v.usage = this.gl.handle.STREAM_DRAW;
                return this;
            };
            /**
             * The data store contents will be modified once and used many times.
             */
            BufferBuilder.prototype.staticDraw = function () {
                this.v.usage = this.gl.handle.STATIC_DRAW;
                return this;
            };
            /**
             * The data store contents will be modified repeatedly and used many times.
             */
            BufferBuilder.prototype.dynamicDraw = function () {
                this.v.usage = this.gl.handle.DYNAMIC_DRAW;
                return this;
            };
            BufferBuilder.prototype.elementsCount = function (count) {
                this.v.elementsCount = count;
                return this;
            };
            BufferBuilder.prototype.elementSize = function (size) {
                this.v.elementSize = size;
                return this;
            };
            BufferBuilder.prototype.data = function (data) {
                this.v.data = data;
                return this;
            };
            BufferBuilder.prototype.typeByte = function () {
                this.v.wrapper = Int8Array;
                this.v.elementSize = 1;
                return this;
            };
            BufferBuilder.prototype.typeUByte = function () {
                this.v.wrapper = Uint8Array;
                this.v.elementSize = 1;
                return this;
            };
            BufferBuilder.prototype.typeShort = function () {
                this.v.wrapper = Int16Array;
                this.v.elementSize = 2;
                return this;
            };
            BufferBuilder.prototype.typeUShort = function () {
                this.v.wrapper = Uint16Array;
                this.v.elementSize = 2;
                return this;
            };
            BufferBuilder.prototype.typeInt = function () {
                this.v.wrapper = Int32Array;
                this.v.elementSize = 4;
                return this;
            };
            BufferBuilder.prototype.typeUInt = function () {
                this.v.wrapper = Uint32Array;
                this.v.elementSize = 4;
                return this;
            };
            BufferBuilder.prototype.typeFloat = function () {
                this.v.wrapper = Float32Array;
                this.v.elementSize = 4;
                return this;
            };
            BufferBuilder.prototype.build = function () {
                var _this = this;
                var v = this.v;
                if (!v.usage)
                    throw new Error("Buffer usage not specified");
                if (!v.data && !v.elementsCount)
                    throw new Error("Buffer data and size not specified");
                if (!v.target)
                    throw new Error("Buffer target not specified");
                var nativeData = v.data ? new v.wrapper(v.data) : null, handle = this.gl.handle.createBuffer(), buffer = new Buffer(this.gl, handle, nativeData ? nativeData.byteLength : v.elementsCount * v.elementSize, nativeData ? nativeData.BYTES_PER_ELEMENT : v.elementSize, v.usage, v.target);
                buffer.use(function () {
                    _this.gl.handle.bufferData(v.target, v.data ? nativeData : v.elementsCount, v.usage);
                });
                return buffer;
            };
            return BufferBuilder;
        })();
        webgl.BufferBuilder = BufferBuilder;
        var Buffer = (function (_super) {
            __extends(Buffer, _super);
            function Buffer(gl, handle, bytesSize, elementSize, usage, target) {
                _super.call(this);
                this.gl = gl;
                this.handle = handle;
                this.bytesSize = bytesSize;
                this.elementSize = elementSize;
                this.usage = usage;
                this.target = target;
            }
            Buffer.prototype.use = function (callback) {
                var gl = this.gl, glh = gl.handle;
                if (this.target === glh.ARRAY_BUFFER) {
                    return this.gl.settings().arrayBuffer(this).use(callback);
                }
                else if (this.target === glh.ELEMENT_ARRAY_BUFFER) {
                    return this.gl.settings().elementArrayBuffer(this).use(callback);
                }
                else
                    throw new Error("Invalid buffer target");
            };
            Buffer.prototype.dispose = function () {
                this.gl.handle.deleteBuffer(this.handle);
                this.handle = null;
            };
            return Buffer;
        })(may.Identified);
        webgl.Buffer = Buffer;
        var DepthBuffer = (function (_super) {
            __extends(DepthBuffer, _super);
            function DepthBuffer(gl, handle, width, height) {
                _super.call(this);
                this.gl = gl;
                this.handle = handle;
                this.width = width;
                this.height = height;
            }
            DepthBuffer.create = function (gl, width, height) {
                var glh = gl.handle, handle = glh.createRenderbuffer(), buffer = new DepthBuffer(gl, handle, width, height);
                buffer.use(function () {
                    glh.renderbufferStorage(glh.RENDERBUFFER, glh.DEPTH_COMPONENT16, width, height);
                });
                return buffer;
            };
            DepthBuffer.prototype.use = function (callback) {
                return this.gl.settings().renderBuffer(this).use(callback);
            };
            DepthBuffer.prototype.dispose = function () {
                this.gl.handle.deleteRenderbuffer(this.handle);
                this.handle = null;
            };
            return DepthBuffer;
        })(may.Identified);
        webgl.DepthBuffer = DepthBuffer;
        var FrameBuffer = (function (_super) {
            __extends(FrameBuffer, _super);
            function FrameBuffer(gl, handle) {
                _super.call(this);
                this.gl = gl;
                this.handle = handle;
            }
            FrameBuffer.create = function (gl) {
                var handle = gl.handle.createFramebuffer();
                return new FrameBuffer(gl, handle);
            };
            FrameBuffer.prototype.setColorBuffer = function (buffer) {
                var _this = this;
                this.gl.settings().frameBuffer(this).use(function () {
                    var gl = _this.gl.handle;
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, buffer.handle, 0);
                });
                return this;
            };
            FrameBuffer.prototype.setDepthBuffer = function (buffer) {
                var _this = this;
                this.gl.settings().frameBuffer(this).use(function () {
                    var gl = _this.gl.handle;
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, buffer.handle);
                });
                return this;
            };
            FrameBuffer.prototype.use = function (callback) {
                return this.gl.settings().frameBuffer(this).use(function () {
                    return callback();
                });
            };
            FrameBuffer.prototype.hasColor = function () {
                var gl = this.gl.handle;
                return this.use(function () { return gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) !== gl.NONE; });
            };
            FrameBuffer.prototype.hasDepth = function () {
                var gl = this.gl.handle;
                return this.use(function () { return gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) !== gl.NONE; });
            };
            FrameBuffer.prototype.isComplete = function () {
                var gl = this.gl.handle;
                return this.use(function () { return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; });
            };
            FrameBuffer.prototype.dispose = function () {
                this.gl.handle.deleteFramebuffer(this.handle);
                return null;
            };
            return FrameBuffer;
        })(may.Identified);
        webgl.FrameBuffer = FrameBuffer;
        /**
         * This class helps pass multiple attributes in one buffer
         */
        var Attributes = (function () {
            function Attributes(program) {
                this.program = program;
                this.stride = 0;
                this.length = -1;
                this.data = {};
                this.buffer = null;
                var gl = program.gl.handle, ph = program.handle, count = gl.getProgramParameter(ph, gl.ACTIVE_ATTRIBUTES);
                this.gl = program.gl;
                for (var i = 0; i < count; i++) {
                    var attribute = gl.getActiveAttrib(ph, i);
                    var s = void 0;
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
            /**
             * Set attribute values
             */
            Attributes.prototype.append = function (name, data) {
                if (this.buffer) {
                    throw new Error("Can't modify attributes cause 'apply' was called");
                }
                var l = data.length / this.data[name].size;
                if (l !== Math.floor(l)) {
                    throw new Error("Invlid attribute '" + name + "' length");
                }
                if (this.length === -1) {
                    this.length = l;
                }
                else if (this.length !== l) {
                    throw new Error("Attribute '" + name + "' length mismatch");
                }
                this.data[name].data = data;
                return this;
            };
            /**
             * Build attributes data buffer
             */
            Attributes.prototype.build = function () {
                var data = this.data, gl = this.gl.handle, l = this.length, s = this.stride;
                for (var name_1 in data) {
                    if (!data[name_1].data) {
                        throw new Error("Attribute '" + name_1 + "' not defined");
                    }
                }
                var content = new Float32Array(l * s);
                for (var i = 0; i < l; i++) {
                    var o = i * s;
                    for (var name_2 in data) {
                        var item = data[name_2], is = item.size, io = o + item.offset, id = item.data;
                        for (var j = 0; j < is; j++) {
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
                return this;
            };
            /**
             * Set program attributes
             */
            Attributes.prototype.apply = function () {
                var _this = this;
                if (!this.buffer) {
                    throw new Error("Attributes should are builded first");
                }
                else {
                    var data = this.data, gl = this.gl.handle, ph = this.program.handle;
                    this.program.use(function () { return _this.buffer.use(function () {
                        for (var name_3 in data) {
                            var location_1 = gl.getAttribLocation(ph, name_3), item = data[name_3];
                            gl.enableVertexAttribArray(location_1);
                            gl.vertexAttribPointer(location_1, item.size, gl.FLOAT, false, _this.stride * 4, item.offset * 4);
                        }
                    }); });
                    return this;
                }
            };
            Attributes.prototype.dispose = function () {
                if (this.buffer) {
                    this.buffer.dispose();
                }
            };
            return Attributes;
        })();
        webgl.Attributes = Attributes;
        var Uniforms = (function () {
            function Uniforms(program) {
                this.program = program;
                this.info = {};
                this.gl = program.gl;
                var glh = this.gl.handle;
                var uniformsCount = glh.getProgramParameter(program.handle, glh.ACTIVE_UNIFORMS);
                for (var i = 0; i < uniformsCount; i++) {
                    var uniform = glh.getActiveUniform(program.handle, i);
                    this.info[uniform.name] = uniform;
                }
            }
            Uniforms.prototype.append = function (name, value) {
                var gl = this.gl.handle, location = gl.getUniformLocation(this.program.handle, name), info = this.info[name];
                if (!info) {
                    console.warn("Uniform '" + name + "' not found");
                    return this;
                }
                this.program.use(function () {
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
            };
            return Uniforms;
        })();
        webgl.Uniforms = Uniforms;
        var Program = (function (_super) {
            __extends(Program, _super);
            function Program(gl, vertex, fragment) {
                _super.call(this);
                this.gl = gl;
                var attribute, uniform, i;
                var glh = this.gl.handle;
                this.handle = glh.createProgram();
                this.vertex = new Shader(this.gl, glh.VERTEX_SHADER, vertex).attach(this);
                this.fragment = new Shader(this.gl, glh.FRAGMENT_SHADER, fragment).attach(this);
                glh.linkProgram(this.handle);
                if (!glh.getProgramParameter(this.handle, glh.LINK_STATUS)) {
                    throw new Error(glh.getProgramInfoLog(this.handle));
                }
            }
            Program.prototype.uniforms = function () {
                return new Uniforms(this);
            };
            Program.prototype.attributes = function () {
                return new Attributes(this);
            };
            Program.prototype.use = function (callback) {
                return this.gl.settings().program(this).use(callback);
            };
            Program.prototype.dispose = function () {
                this.gl.handle.deleteProgram(this.handle);
                this.handle = null;
                this.vertex.dispose();
                this.vertex = null;
                this.fragment.dispose();
                this.fragment = null;
                return null;
            };
            return Program;
        })(may.Identified);
        webgl.Program = Program;
        var Shader = (function (_super) {
            __extends(Shader, _super);
            function Shader(gl, type, source) {
                _super.call(this);
                this.gl = gl;
                this.type = type;
                var glh = this.gl.handle;
                this.handle = glh.createShader(this.type);
                glh.shaderSource(this.handle, source);
                glh.compileShader(this.handle);
                if (!glh.getShaderParameter(this.handle, glh.COMPILE_STATUS)) {
                    throw new Error(glh.getShaderInfoLog(this.handle));
                }
            }
            Shader.prototype.attach = function (program) {
                this.gl.handle.attachShader(program.handle, this.handle);
                return this;
            };
            Shader.prototype.dispose = function () {
                this.gl.handle.deleteShader(this.handle);
                this.handle = null;
            };
            return Shader;
        })(may.Identified);
        webgl.Shader = Shader;
    })(webgl = may.webgl || (may.webgl = {}));
})(may || (may = {}));
/// <reference path="Base.ts"/>
/// <reference path="WebGL.ts"/>
var snow;
(function (snow_1) {
    var GL = may.webgl.GL;
    var BlendEquation = may.webgl.BlendEquation;
    var BlendFunction = may.webgl.BlendFunction;
    var Snow = (function () {
        function Snow(gl, count) {
            // Stars
            this.gl = gl;
            this.count = count;
            this.triangles = 0;
            this.program = gl.program(snow_1.Shaders["snow.v"], snow_1.Shaders["snow.f"]);
            var attributes = this.program.attributes(), points = [], // vertexes
            orientation = [], // point position in triangle
            star = [], // star index
            indexes = [], offset = 0;
            this.attributes = attributes;
            this.uniforms = this.program.uniforms();
            for (var i = 0; i < count; i++) {
                var rays = 10;
                star.push(i);
                points.push(0, 0);
                orientation.push(0);
                for (var ray = 0; ray < rays; ray++) {
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
            this.bgProgram = gl.program(snow_1.Shaders["background.v"], snow_1.Shaders["background.f"]);
            this.bgAttributes = this.bgProgram.attributes().append("a_point", [
                -1, -1, 1, -1, -1, 1,
                1, -1, 1, 1, -1, 1
            ]).build().apply();
        }
        Snow.prototype.setTime = function (time) {
            this.uniforms.append("u_time", time);
            return this;
        };
        Snow.prototype.setRatio = function (ratio) {
            this.uniforms.append("u_ratio", ratio);
            return this;
        };
        Snow.prototype.draw = function () {
            var _this = this;
            this.gl.settings()
                .disableBlend()
                .disableDepthTest()
                .program(this.bgProgram)
                .attributes(this.bgAttributes)
                .use(function () {
                _this.bgAttributes.apply();
                _this.gl.drawTrianglesArrays(6);
            });
            this.gl.settings()
                .disableDepthTest()
                .enableBlend()
                .blendEquation(BlendEquation.ADD)
                .blendFunction(BlendFunction.SRC_ALPHA, BlendFunction.ONE_MINUS_SRC_ALPHA, BlendFunction.ONE, BlendFunction.ONE)
                .elementArrayBuffer(this.indexes)
                .program(this.program)
                .attributes(this.attributes).use(function () {
                _this.attributes.apply();
                _this.gl.drawTrianglesElemets(_this.triangles * 3);
            });
        };
        Snow.prototype.dispose = function () {
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
        };
        return Snow;
    })();
    snow_1.Snow = Snow;
    function start(canvas) {
        var gl = new GL(canvas), snow = new Snow(gl, 500), requestAnimationFrame = window.requestAnimationFrame || window["mozRequestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] || window.msRequestAnimationFrame || setTimeout, startTime = new Date();
        function resize() {
            var displayWidth = window.innerWidth, displayHeight = window.innerHeight;
            if (canvas.width != displayWidth ||
                canvas.height != displayHeight) {
                canvas.width = displayWidth;
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
    snow_1.start = start;
})(snow || (snow = {}));

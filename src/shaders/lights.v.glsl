precision highp float;

attribute vec2 a_point;
attribute vec3 a_color;
attribute float a_radius;

uniform vec4 u_viewport;

varying vec3 v_color;
varying vec2 v_point;
varying float v_radius;

void main() {
	v_color = a_color;
	v_radius = a_radius;
	v_point = (a_point + vec2(1, 1)) * 0.5 * u_viewport.zw;
	gl_PointSize = a_radius * min(u_viewport.z, u_viewport.w);
    gl_Position = vec4(a_point, 0, 1);
}
precision highp float;

attribute vec2 a_point;
attribute vec3 a_color;
attribute float a_radius;

uniform vec4 u_viewport;
uniform float u_time;
uniform float u_max_radius;

varying vec3 v_color;
varying vec2 v_point;
varying float v_radius;

void main() {
    vec2 direction = vec2(cos(u_time / 4500.0), sin(u_time / 2250.0)); 
    vec2 shift = direction / (a_radius * 200.0);
	v_color = a_color;
	v_point = ((a_point + shift) + vec2(1, 1)) * 0.5 * u_viewport.zw;
	gl_PointSize = min(a_radius * min(u_viewport.z, u_viewport.w), u_max_radius);
    v_radius = gl_PointSize / min(u_viewport.z, u_viewport.w);
    gl_Position = vec4(a_point + shift, 0, 1);
}
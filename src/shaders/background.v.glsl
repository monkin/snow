precision highp float;

attribute vec2 a_point;
varying float point_x;

void main() {
	point_x = a_point.x;
    gl_Position = vec4(a_point, 0, 1);
}
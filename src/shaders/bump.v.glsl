precision highp float;

attribute vec2 a_point;
attribute vec3 a_color;

varying vec3 v_color;

void main() {
    v_color = normalize(a_color);
    gl_Position = vec4(a_point, 0, 1);
}
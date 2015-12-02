precision highp float;

varying float point_x;

void main() {
    float f =  0.7 + point_x * point_x * 0.3;
    gl_FragColor = vec4(vec3(0.4, 0.4, 0.9) * f, 1);
}
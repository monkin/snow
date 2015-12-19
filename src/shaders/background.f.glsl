precision highp float;

varying float point_x;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

void main() {
    float f =  (0.7 + point_x * point_x * 0.3)  + rand(sin(gl_FragCoord.x) + gl_FragCoord.y) * 0.15;
    gl_FragColor = vec4(vec3(0.2, 0.2, 0.6) * f, 1);
}
precision highp float;

#define M_PI 3.1415926535897932384626433832795

uniform float u_ratio;
uniform float u_time;

varying vec2 v_orientation;
varying float v_star;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

float distance_to_line(vec4 line, vec2 testPt) {
    vec2 pt1 = line.xy;
    vec2 pt2 = line.zw;
    vec2 lineDir = pt2 - pt1;
    vec2 perpDir = vec2(lineDir.y, -lineDir.x);
    vec2 dirToPt1 = pt1 - testPt;
    return abs(dot(normalize(perpDir), dirToPt1));
}

vec4 random_line(float seed) {
    float angle = M_PI * rand(seed);
    float x1 = rand(seed + 1.05);
    return vec4(x1, 0, x1 + cos(angle), sin(angle));
}

void main() {
    float x = u_ratio * u_time;
    //gl_FragColor = vec4(v_orientation, 0, 1.0);
    float distance = 100.0;
    for (float i = 0.0; i < 20.0; i += 1.0) {
        distance = min(distance, distance_to_line(random_line(v_star + 2.137 * i), v_orientation));
    }
    float alpha = max(1.0 - distance * distance * distance * 10000.0, 0.0) * (0.5 + 0.5 * (1.0 - gl_FragCoord.z) * (1.0 - gl_FragCoord.z));
    gl_FragColor = vec4(1, 1, 1, alpha);
}
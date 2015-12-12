precision highp float;

#define M_PI 3.1415926535897932384626433832795
#define MIN_RIPPLE 0.0
#define MAX_RIPPLE (3.0 * M_PI)

uniform float u_ratio;
uniform float u_time;

varying vec2 v_orientation;
varying float v_star;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

float rand(float seed, float v1, float v2) {
    return rand(seed) * (v2 - v1) + v1;
}

mat2 create_rotation_matrix(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
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
    float y1 = rand(seed + 1.1);
    return vec4(x1, y1, x1 + cos(angle), y1 + sin(angle));
}


vec4 normal_line(vec4 line) {
    return vec4(line.x, line.y, line.x + (line.w - line.y), line.y - (line.z - line.x));
}

void main() {
    float x = u_ratio * u_time;
    float r = 100.0;
    
    if (length(v_orientation) < 0.9) {
        for (float i = 0.0; i < 3.0; i += 1.0) {
            vec2 twirl_center = vec2(rand(v_star + 0.1 * i), rand(v_star + 0.2 * i));
            float twirl_angle = rand(v_star + 0.3 * i, MIN_RIPPLE, MAX_RIPPLE) * distance(v_orientation, twirl_center);
            vec2 twirl_point = (v_orientation - twirl_center) * create_rotation_matrix(twirl_angle) + twirl_center;
        
            vec4 line1 = random_line(v_star + 2.137 * i);
            vec4 line2 = normal_line(line1);
            r = min(r, distance_to_line(line1, twirl_point));
            r = min(r, distance_to_line(line2, twirl_point));
        }
        float alpha = max(1.0 - r * r * r * 500.0, 0.0) * (0.5 + 0.5 * (1.0 - gl_FragCoord.z));
        gl_FragColor = vec4(1, 1, 1, alpha * alpha);
    } else {
        gl_FragColor = vec4(0);
    }
}
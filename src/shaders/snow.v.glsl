precision highp float;

#define M_PI 3.1415926535897932384626433832795
#define MIN_RPS 1.0
#define MAX_RPS 2.0
#define MIN_SPIN_RADIUS 0.1
#define MAX_SPIN_RADIUS 0.3
#define MIN_SPIN_RPS -0.15
#define MAX_SPIN_RPS 0.15
#define FALL_SPEED 0.4

mat4 create_rotation_matrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

float rand(float seed, float v1, float v2) {
    return rand(seed) * (v2 - v1) + v1;
}

vec3 rand_axis(float seed) {
    float phi = rand(seed, 0.0, 2.0 * M_PI);
    float theta = rand(seed + 2.17, 0.2 * M_PI, 0.8 * M_PI);
    float sin_theta = sin(theta);
    return vec3(sin_theta * cos(phi), sin_theta * sin(phi), cos(theta));
}

float loop(float v, float min_v, float max_v) {
    return mod(v - min_v, max_v - min_v) + min_v;
}

uniform float u_ratio;
uniform float u_time;

attribute vec2 a_point;
attribute float a_orientation;
attribute float a_star;

varying vec2 v_orientation;
varying float v_star;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_bitangent;
varying vec3 v_position;
varying vec2 v_bump;

void main() {
    
    // v_orientation
    if (a_orientation == 0.0) {
        v_orientation = vec2(0, 0);
    } else if (a_orientation == 1.0) {
        v_orientation = vec2(0, 1);
    } else {
        float angle = 2.0 * M_PI / 10.0;
        v_orientation = vec2(cos(angle), sin(angle));
    }
    
    // v_star
    v_star = a_star;
    
    // gl_Position
    float rotation_speed = rand(a_star, MIN_RPS, MAX_RPS);
    vec3 rotation_axis = rand_axis(a_star + 0.1);
    mat4 rotation_matrix = create_rotation_matrix(rotation_axis, rotation_speed * u_time * 0.001 + rand(a_star + 7.0));
    vec4 rotated_point = vec4(a_point / 8.5, 0, 1) * rotation_matrix / vec4(u_ratio, 1, 1, 1);
    
    float spin_radius = rand(a_star + 0.5, MIN_SPIN_RADIUS, MAX_SPIN_RADIUS);
    float fall_speed = FALL_SPEED - spin_radius;
    float fall_offset = fall_speed * u_time * 0.001;
    vec4 offset = vec4(
        rand(a_star + 0.2, -1.0 - (1.0 / u_ratio), 1.0 + (1.0 / u_ratio)),
        loop(rand(a_star + 0.3, -2.0, 2.0) - fall_offset, -2.0, 2.0),
        rand(a_star + 0.4, -0.8, 0.2),
        0);
    vec4 shifted_point = rotated_point + offset;
    
    float spin_angle = rand(a_star + 0.6, MIN_SPIN_RPS, MAX_SPIN_RPS) * 2.0 * M_PI * u_time * 0.001;
    vec4 spinned_point = shifted_point + vec4(sin(spin_angle) * spin_radius, 0, cos(spin_angle) * spin_radius, 0);
    
    float factor = 1.0 / (1.4 + spinned_point.z * 0.7);
    vec4 factor_point = spinned_point * vec4(factor, factor, 1, 1);
    
    v_normal = (vec4(0, 0, 1, 1) * rotation_matrix).xyz;
    v_tangent = (vec4(0, 1, 0, 1) * rotation_matrix).xyz;
    v_bitangent = (vec4(1, 0, 0, 1) * rotation_matrix).xyz;
    v_position = vec3(spinned_point.xy, 1.0 / spinned_point.z);
    
    v_bump = vec2(rand(a_star + a_orientation), rand(a_star + a_orientation + 18.0));
    
    gl_Position = vec4(factor_point.xy, clamp(factor_point.z, -1.0, 1.0), 1);
}
precision highp float;

varying vec3 v_color;
varying vec2 v_point;
varying float v_radius;

uniform vec4 u_viewport;

void main() {
    float scale = min(u_viewport.z, u_viewport.w);
    float scaled_radius = v_radius * scale * 0.5;
    float max_alpha =  (v_radius + 0.2) / 1.5;
    float d = distance(gl_FragCoord.xy, v_point);
    float d_factor = d / scaled_radius;
    float alpha = (d_factor < 0.8)
        ? 1.0
        : (0.2 - (d_factor - 0.8)) * 5.0;
    gl_FragColor = vec4(v_color, alpha * alpha * alpha * max_alpha);
}
#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;

/**
 * 2 つのベクトルをつなぐ線形補間
 */
void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy;
  vec3 RED = vec3(1.0, 0.0, 0.0); // 赤
  vec3 BLUE = vec3(0.0, 0.0, 1.0); // 青
  vec3 col = mix(RED, BLUE, pos.x); // x座標上の線形補間
  fragColor = vec4(col, 1.0);
}

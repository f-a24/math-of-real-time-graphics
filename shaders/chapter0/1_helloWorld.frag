#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution; // ビューポート解像度

/**
 * glsl-canvas におけるフラグメント座標とビューポート解像度
 */
void main() {
  // フラグメント座標を正規化
  vec2 pos = gl_FragCoord.xy / u_resolution.xy;
  fragColor = vec4(1.0, pos, 1.0);
}

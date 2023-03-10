#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;

/**
 * 3 つのベクトルをつなぐ線形補間
 */
void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy;
  vec3[3] col3 = vec3[]( // ベクトルの配列
    vec3(1.0, 0.0, 0.0), // col3[0]:赤
    vec3(0.0, 0.0, 1.0), // col3[1]:青
    vec3(0.0, 1.0, 0.0) // col3[2]:緑
  );
  pos.x *= 2.0; // x座標範囲を[0,2]空間にスケール
  int ind = int(pos.x); // 配列のインデックス
  // x軸に沿った赤、青、緑の補間
  vec3 col = mix(col3[ind], col3[ind + 1], fract(pos.x));
  fragColor = vec4(col, 1.0);
}

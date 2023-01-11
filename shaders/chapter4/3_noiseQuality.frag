#version 300 es
/**
 * 勾配のとり方による品質比較
 */

precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
int channel;

// 対角線方向に制限した4つの勾配
vec2[4] diag = vec2[]( // 0.70710678 = 1.0 / sqrt(2.0)
  vec2(0.70710678, 0.70710678),
  vec2(-0.70710678, 0.70710678),
  vec2(0.70710678, -0.70710678),
  vec2(-0.70710678, -0.70710678)
);

// 軸方向に制限した4つの勾配
vec2[4] axis = vec2[](vec2(1, 0), vec2(-1, 0), vec2(0, 1), vec2(0, -1));
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
const uint UINT_MAX = 0xffffffffu;
uvec2 uhash22(uvec2 n) {
  n ^= n.yx << u.xy;
  n ^= n.yx >> u.xy;
  n *= k.xy;
  n ^= n.yx << u.xy;
  return n * k.xy;
}
float gnoise21(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float[4] v;
  for (int j = 0; j < 2; j++) {
    for (int i = 0; i < 2; i++) {
      uvec2 m = floatBitsToUint(n + vec2(i, j));
      uint ind = uhash22(m).x >> 30;
      if (channel == 0) {
        // 左：対角線方向に勾配を制限した勾配ノイズ
        v[i + 2 * j] = dot(diag[ind], f - vec2(i, j));
      } else {
        // 右：軸線方向に勾配を制限した勾配ノイズ
        v[i + 2 * j] = dot(axis[ind], f - vec2(i, j));
      }
    }
  }
  f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
  return 0.5 * mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]) + 0.5;
}

void main() {
  vec2 pos = gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  channel = int(gl_FragCoord.x * 2.0 / u_resolution.x);
  pos = 10.0 * pos + u_time;
  float v = gnoise21(pos); // ノイズの値を取得
  if (v > 0.85 || v < 0.15) {
    // 値が[0.15, 0.85]区間を外れるとき
    fragColor.rgb = vec3(1.0, 0.0, 0.0);
  } else {
    fragColor.rgb = vec3(v);
  }
  fragColor.a = 1.0;
}

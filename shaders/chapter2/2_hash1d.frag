#version 300 es
/**
 * 1 変数ハッシュ関数
 */

precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;

uint k = 0x456789abu; // 算術積に使う大きな桁数の定数
const uint UINT_MAX = 0xffffffffu; // 符号なし整数の最大値

// 符号なし整数のハッシュ関数
uint uhash11(uint n) {
  n ^= n << 1; // 1左シフトしてXOR
  n ^= n >> 1; // 1右シフトしてXOR
  n *= k; // 算術積
  n ^= n << 1; // 1左シフトしてXOR
  return n * k; // 算術積
}

// 浮動小数点数のハッシュ関数
float hash11(float p) {
  uint n = floatBitsToUint(p); // ビット列を符号なし整数に変換
  return float(uhash11(n)) / float(UINT_MAX); // 値の正規化
}

void main() {
  float time = floor(60.0 * u_time); // 1秒に60カウント
  vec2 pos = gl_FragCoord.xy + time; // フラグメント座標をずらす
  fragColor.rgb = vec3(hash11(pos.x));
  fragColor.a = 1.0;
}

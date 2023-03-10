#version 300 es
/**
 * レガシー乱数
 */

precision highp float;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
int channel;

// 1 in, 1 out
float fractSin11(float x) {
  return fract(1000.0 * sin(x));
}
// 2 in, 1 out
float fractSin21(vec2 xy) {
  return fract(sin(dot(xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 pos = gl_FragCoord.xy;
  pos += floor(60.0 * u_time); // フラグメント座標を時間変動
  // ビューポートを分割して各チャンネルを表示
  channel = int(2.0 * gl_FragCoord.x / u_resolution.x);
  if (channel == 0) {
    // 左: 1変数
    fragColor = vec4(fractSin11(pos.x));
  } else {
    // 右: 2変数
    fragColor = vec4(fractSin21(pos.xy / u_resolution.xy));
  }
  fragColor.a = 1.0;
}

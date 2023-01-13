#version 300 es
/**
 * レイキャスティング
 */

precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  // 中心が原点、短辺が[-1,1]区間となるようにフラグメント座標を正規化
  vec2 p =
    (gl_FragCoord.xy * 2.0 - u_resolution) /
    min(u_resolution.x, u_resolution.y);

  // カメラの設定
  vec3 cPos = vec3(0.0, 0.0, 0.0); // 配置位置
  vec3 cDir = vec3(0.0, 0.0, -1.0); // 撮影する方向
  vec3 cUp = vec3(0.0, 1.0, 0.0); // カメラの上方向

  // カメラから飛ばすレイの設定
  vec3 cSide = cross(cDir, cUp); // クロス積（cDirとcUpは正規直交）
  float targetDepth = 1.0; // スクリーンまでの距離
  // カメラからスクリーンのマス目へ向かうベクトル
  vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;

  // 地面との交差判定
  vec3 groundNormal = vec3(0.0, 1.0, 0.0); // 地面の法線
  if (dot(ray, groundNormal) < 0.0) {
    // レイと法線のなす角度が90度より大きい場合交差する
    fragColor.rgb = vec3(1.0);
  } else {
    // 90度以下の場合交差しない
    fragColor.rgb = vec3(0.0);
  }
  fragColor.a = 1.0;
}

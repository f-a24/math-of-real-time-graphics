#version 300 es
/**
 * テクスチャマッピング
 */

precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
const float PI = 3.14159265359;

/* 回転関数 START */
vec2 rot2(vec2 p, float t) {
  return vec2(cos(t) * p.x - sin(t) * p.y, sin(t) * p.x + cos(t) * p.y);
}
vec3 rotX(vec3 p, float t) {
  return vec3(p.x, rot2(p.yz, t));
}
vec3 rotY(vec3 p, float t) {
  return vec3(p.y, rot2(p.zx, t)).zxy;
}
vec3 rotZ(vec3 p, float t) {
  return vec3(rot2(p.xy, t), p.z);
}
/* 回転関数 END */

// 市松模様テクスチャ
float text(vec2 st) {
  return mod(floor(st.s) + floor(st.t), 2.0);
}
void main() {
  vec2 p =
    (gl_FragCoord.xy * 2.0 - u_resolution) /
    min(u_resolution.x, u_resolution.y);
  vec3 cPos = vec3(0.0, 0.0, 0.0);
  // マウスポインタy座標を回転角に対応
  float t = -0.5 * PI * (u_mouse.y / u_resolution.y);
  // カメラの向きをx軸を中心に回転
  vec3 cDir = rotX(vec3(0.0, 0.0, -1.0), t);
  // カメラの上方向をx軸を中心に回転
  vec3 cUp = rotX(vec3(0.0, 1.0, 0.0), t);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.0;
  vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth - cPos;
  ray = normalize(ray); // レイを正規化
  vec3 groundNormal = vec3(0.0, 1.0, 0.0); // 地面の法線
  // マウスポインタx座標をカメラと地面の距離に対応
  float groundHeight = 1.0 + u_mouse.x / u_resolution.x;
  // 交差判定
  if (dot(ray, groundNormal) < 0.0) {
    // レイと地面の交点
    vec3 hit = cPos - ray * groundHeight / dot(ray, groundNormal);
    // 交点のzx座標をテクスチャ座標に対応
    fragColor.rgb = vec3(text(hit.zx));
  } else {
    fragColor.rgb = vec3(0.0);
  }
  fragColor.a = 1.0;
}

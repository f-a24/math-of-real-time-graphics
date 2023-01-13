#version 300 es
/**
 * レイマーチングによるレイと SDF 形状の交差
 */

precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
float circleSDF(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}
float contour(float v) {
  return step(abs(v), 0.002);
}
float point(vec2 p, vec2 c) {
  return step(length(p - c), 0.01);
}
float line(vec2 p, vec2 c, vec2 d) {
  return step(abs(dot(p - c, vec2(-d.y, d.x))), 0.002);
}
void main() {
  vec2 pos = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.yy;
  vec2 cPos = vec2(-0.5, 0.0); // カメラの位置
  vec2 oPos = vec2(1.0, 0.0); // オブジェクトの位置
  vec2 ray = oPos - cPos;
  ray.y += 2.0 * u_mouse.y / u_resolution.y - 1.0;
  ray = normalize(ray);
  float rad = 0.8;
  vec2 rPos = cPos;
  fragColor.rgb = contour(circleSDF(pos, oPos, rad)) * vec3(1); // オブジェクトの円を描画
  fragColor.rgb += line(pos, cPos, ray) * vec3(0, 0, 1); // 線を描画
  for (int i = 0; i < 50; i++) {
    fragColor.rgb += point(pos, rPos) * vec3(1.0, 0.0, 0.0); // 光線の位置を描画
    float dist = circleSDF(rPos, oPos, rad);
    if (dist < 0.01) {
      break;
    }
    // SDF値の半径で円を描く
    fragColor.rgb += contour(circleSDF(pos, rPos, dist)) * vec3(0.5, 0.5, 0.0);
    rPos += dist * ray;
    if (rPos.x > oPos.x + rad) {
      break;
    }
  }
  fragColor.a = 1.0;
}

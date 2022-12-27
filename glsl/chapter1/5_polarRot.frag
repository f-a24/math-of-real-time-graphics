#version 300 es
precision highp float;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
const float PI = 3.14159265;

/**
 * 時間変容するグラデーション
 */

float atan2(float y, float x){
    return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}
vec2 xy2pol(vec2 xy){
    return vec2(atan2(xy.y, xy.x), length(xy));
}
// 引数は(偏角,動径)の組み合わせからなるベクトル
vec2 pol2xy(vec2 pol){
    return pol.y * vec2(cos(pol.x), sin(pol.x));
}
vec3 tex(vec2 st){
    float time = 0.2 * u_time; // 時間の速度調整
    // (0.5, 0.5, 0.1)を中心とした、z=1平面上の半径0.5の円上を動くベクトル
    vec3 circ = vec3(pol2xy(vec2(time, 0.5)) + 0.5, 1.0);
    // スウィズル演算子を使ってcircの成分をずらし、3つのベクトルをつくる
    vec3[3] col3 = vec3[](circ.rgb, circ.gbr, circ.brg);
    st.s = st.s / PI + 1.0;
    st.s += time; // 偏角を時間とともに動かす
    int ind = int(st.s);
    vec3 col = mix(col3[ind % 2], col3[(ind + 1) % 2], fract(st.s));
    return mix(col3[2], col, st.t);
}
void main(){
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;
    pos = 2.0 * pos - vec2(1.0);
    pos = xy2pol(pos);    
    fragColor = vec4(tex(pos), 1.0);
}
#version 300 es
precision highp float;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
const float PI = 3.1415926; // 円周率を定数値として定義する

/**
 * 偏角を求める関数
 */
float atan2(float y, float x){ // 値の範囲は(-PI,PI]
    if (x == 0.0){
        return sign(y) * PI / 2.0;
    } else {
        return atan(y, x);
    }
    // 注：三項演算子を使えば、上記のif節を使わずに次の1行で書ける
    // return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

/**
 * 直交座標と極座標の変換
 */
vec2 xy2pol(vec2 xy){
    return vec2(atan2(xy.y, xy.x), length(xy));
}

/**
 * 極座標を使ったテクスチャマッピング
 */
vec3 tex(vec2 st){ // s:偏角, t:動径
    vec3[3] col3 = vec3[](
        vec3(0.0, 0.0, 1.0), // col3[0]:青
        vec3(1.0, 0.0, 0.0), // col3[1]:赤
        vec3(1.0) // col3[2]:白（ベクトルの成分がすべて同じ値となる場合の記法）
    );
    st.s = st.s / PI + 1.0; // 偏角の範囲を[0,2)区間に変換
    int ind = int(st.s); // 偏角を配列のインデックスに対応
    // 偏角に沿って赤、青、赤を補間
    vec3 col = mix(
        col3[ind % 2],
        col3[(ind + 1) % 2],
        fract(st.s)
    );
    return mix(col3[2], col, st.t); // 動径に沿ってcolと白を補間
}
void main(){
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;
    pos = 2.0 * pos.xy - vec2(1.0); // フラグメント座標範囲を[-1,1]区間に変換
    pos = xy2pol(pos); // 極座標に変換
    fragColor = vec4(tex(pos), 1.0); // テクスチャマッピング
}
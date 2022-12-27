#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;

/**
 * 2次元区間上の双線形補間
 */
void main(){
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;
    vec3[4] col4 = vec3[](
        vec3(1.0, 0.0, 0.0), // col4[0]:赤
        vec3(0.0, 0.0, 1.0), // col4[1]:青
        vec3(0.0, 1.0, 0.0), // col4[2]:緑
        vec3(1.0, 1.0, 0.0) // col4[3]:黄
    );
    
    vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y);
    fragColor = vec4(col, 1.0);
}
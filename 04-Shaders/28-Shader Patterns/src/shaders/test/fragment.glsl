#define PI 3.1415926535897932384626433832795
varying vec2 uvOut;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}   

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    /* //Pattern 1
    gl_FragColor = vec4(uvOut, 1.0, 1.0); */

    /* //Pattern 2
    gl_FragColor = vec4(uvOut, 0.0, 1.0); */

    /* //Pattern 3
    gl_FragColor = vec4(uvOut.x, uvOut.x, uvOut.x, 1.0); */

    /* //Pattern 3 alternate
    float strength = uvOut.x; */

    /* //Pattern 4
    float strength = uvOut.y; */

    /* //Pattern 5
    float strength = 1.0 - uvOut.y; */

    /* //Pattern 6
    float strength = uvOut.y * 10.0; */ 

    /* //Pattern 7
    float strength = mod(uvOut.y * 10.0, 1.0); */

    /* //Pattern 8
    float strength = mod(uvOut.y * 10.0, 1.0);
    // strength = strength < 0.5 ? 0.0 : 1.0; Doing if else in shader is bad for performance
    strength = step(0.5, strength); */

    /* //Pattern 9
    float strength = mod(uvOut.y * 10.0, 1.0);
    strength = step(0.8, strength);  */

    /* //Pattern 10
    float strength = mod(uvOut.x * 10.0, 1.0);
    strength = step(0.8, strength);  */

    /* //Pattern 11
    float strength = step(0.8, mod(uvOut.x * 10.0, 1.0));
    strength += step(0.8, mod(uvOut.y * 10.0, 1.0)); */

    /* //Pattern 12
    float strength = step(0.8, mod(uvOut.x * 10.0, 1.0));
    strength *= step(0.8, mod(uvOut.y * 10.0, 1.0)); */

    /* //Pattern 13
    float strength = step(0.4, mod(uvOut.x * 10.0, 1.0));
    strength *= step(0.8, mod(uvOut.y * 10.0, 1.0)); */

    //Pattern 14
   /*  float barX = step(0.4, mod(uvOut.x * 10.0, 1.0));
    barX *= step(0.8, mod(uvOut.y * 10.0, 1.0));

    float barY = step(0.8, mod(uvOut.x * 10.0, 1.0));
    barY *= step(0.4, mod(uvOut.y * 10.0, 1.0));

    float strength = barX + barY; */

    /* //Pattern 15
    float barX = step(0.4, mod(uvOut.x * 10.0, 1.0));
    barX *= step(0.8, mod(uvOut.y * 10.0 + 0.2, 1.0));

    float barY = step(0.8, mod(uvOut.x * 10.0 + 0.2, 1.0));
    barY *= step(0.4, mod(uvOut.y * 10.0, 1.0));

    float strength = barX + barY; */

    /* //Pattern 16
    float strength = abs(uvOut.x - 0.5); */

    /* //Pattern 17
    float strength = min(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5)); */

    /* //Pattern 18
    float strength = max(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5)); */

    /* //Pattern 19
    float strength = step(0.2, max(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5)));  */

    /* //Pattern 20
    // float strength = step(0.4, max(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5))); alternate
    float square1 = step(0.2, max(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5)));
    float square2 = 1.0 - step(0.25, max(abs(uvOut.x - 0.5), abs(uvOut.y - 0.5)));
    float strength = square1 * square2; */

    /* //Pattern 21
    float strength = floor(uvOut.x * 10.0) / 10.0; */

    /* //Pattern 22
    float strength = floor(uvOut.x * 10.0) / 10.0;
    strength *= floor(uvOut.y * 10.0) / 10.0; */

    /* //Pattern 23
    float strength = random(uvOut); */

    /* //Pattern 24
    vec2 gridUV = vec2(floor(uvOut.x * 10.0) / 10.0, floor(uvOut.y * 10.0) / 10.0);
    float strength = random(gridUV); */

    /* //Pattern 25
    vec2 gridUV = vec2(floor(uvOut.x * 10.0) / 10.0, floor((uvOut.y + uvOut.x * 0.5) * 10.0) / 10.0);
    float strength = random(gridUV); */

    /* //Pattern 26
    float strength = length(uvOut); */

    /* //Pattern 27
    float strength = distance(uvOut, vec2(0.5)); */

    /* //Pattern 28
    float strength = 1.0 - distance(uvOut, vec2(0.5)); */

    /* //Pattern 29
    float strength = 0.015 / distance(uvOut, vec2(0.5)); */

    /* //Pattern 30
    vec2 lightUV = vec2(
        uvOut.x * 0.1 + 0.45,
        uvOut.y * 0.5 + 0.25
    );
    float strength = 0.015 / distance(lightUV, vec2(0.5)); */

    /* //Pattern 31
    vec2 lightUvX = vec2(uvOut.x * 0.1 + 0.45, uvOut.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(uvOut.y * 0.1 + 0.45, uvOut.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY; */

    /* //Pattern 32
    vec2 rotatedUv = rotate(uvOut, PI/4.0, vec2(0.5, 0.5));

    vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY; */

    /* //Pattern 33
    float strength = step(0.25, distance(uvOut, vec2(0.5))); */

    /* //Pattern 34
    float strength = abs(distance(uvOut, vec2(0.5)) - 0.25); */

    /* //Pattern 35
    float strength = step(0.01, abs(distance(uvOut, vec2(0.5)) - 0.25)); */

    /* //Pattern 36
    float strength = 1.0 - step(0.01, abs(distance(uvOut, vec2(0.5)) - 0.25)); */

    /* //Pattern 37
    vec2 wavedUv = vec2(
        uvOut.x,
        uvOut.y + sin(uvOut.x * 30.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); */

    /* //Pattern 38
    vec2 wavedUv = vec2(
        uvOut.x + sin(uvOut.y * 30.0) * 0.1,
        uvOut.y + sin(uvOut.x * 30.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); */

    /* //Pattern 39
    vec2 wavedUv = vec2(
        uvOut.x + sin(uvOut.y * 100.0) * 0.1,
        uvOut.y + sin(uvOut.x * 100.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); */

    /* //Pattern 40
    float angle = atan(uvOut.x, uvOut.y);
    float strength = angle; */

    /* //Pattern 41
    float angle = atan(uvOut.x - 0.5, uvOut.y - 0.5);
    float strength = angle; */

    /* //Pattern 42
    float angle = atan(uvOut.x - 0.5, uvOut.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;
    float strength = angle; */

    /* //Pattern 43
    float angle = atan(uvOut.x - 0.5, uvOut.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;
    angle *= 20.0;
    angle = mod(angle, 1.0);
    float strength = angle; */

    /* //Pattern 44
    float angle = atan(uvOut.x - 0.5, uvOut.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;
    float strength = sin(angle * 100.0); */

    /* //Pattern 45
    float angle = atan(uvOut.x - 0.5, uvOut.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;
    float sinusoid = sin(angle * 100.0);

    float radius = 0.25 + sinusoid * 0.02;
    float strength = 1.0 - step(0.01, abs(distance(uvOut, vec2(0.5)) - radius)); */

    /* //Pattern 46
    float strength = cnoise(uvOut * 10.0); */

    /* //Pattern 47
    float strength = step(0.0, cnoise(uvOut * 10.0)); */

    /* //Pattern 48
    float strength = 1.0 - abs(cnoise(uvOut * 10.0)); */

    /* //Pattern 49
    float strength = sin(cnoise(uvOut * 10.0) * 20.0); */

    //Pattern 50
    float strength = step(0.9, sin(cnoise(uvOut * 10.0) * 20.0));

    // clamp strength
    strength = clamp(strength, 0.0, 1.0);

    // Color Version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(uvOut, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
    
    /* // Black & White Version
    gl_FragColor = vec4(vec3(strength), 1.0); */
}
precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec4 uColor;

varying vec2 vUv;
varying vec4 vColor;

#pragma glslify: snoise_1_2 = require(glsl-noise/simplex/2d)

float rand1(float n) {
	return fract(sin(n) * 43758.5453123);
}

float rand2(float n) {
	return fract(sin(n) * 23718.5253123);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
	vUv = uv;

	// Randomise color
	float randFloat1 = 2.0 * (rand1(pindex) - 0.5); // [-1,1] random
	float randFloat2 = 2.0 * (rand2(pindex) - 0.5); // [-1,1] random

	vec3 colorHSV = rgb2hsv(uColor.xyz);
	colorHSV[0] = mod(colorHSV[0] + 0.03 * randFloat1, 1.0); // hue
	colorHSV[2] = clamp(colorHSV[2] + 0.1 * randFloat2, 0.0, 1.0); // value (brightness)
	vColor = vec4(hsv2rgb(colorHSV), uColor.w);

	// displacement
	vec3 displaced = offset;
	// randomise
	// displaced.xy += vec2(rand1(pindex) - 0.5, rand1(offset.x + pindex) - 0.5) * uRandom;
	// float rndz = (rand1(pindex) + snoise_1_2(vec2(pindex * 0.1, uTime * 0.1)));
	// displaced.z += rndz * (rand1(pindex) * 2.0 * uDepth);

	// particle size
	float psize = (snoise_1_2(vec2(0.5*uTime, pindex) * 0.5) + 2.0);
	psize = uSize*(1.0 + rand2(pindex));



	// final position
	vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
	mvPosition.xyz += position * psize;
	vec4 finalPosition = projectionMatrix * mvPosition;

	gl_Position = finalPosition;
}

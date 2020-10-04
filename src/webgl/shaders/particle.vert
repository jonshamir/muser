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

void main() {
	vUv = uv;
	vColor = uColor;

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

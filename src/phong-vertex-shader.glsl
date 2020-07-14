attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
// Pass color as attribute and forward it
// to the fragment shader
// TODO

uniform mat4 M;
uniform mat4 V;
uniform mat4 N; // normal matrix

varying vec3 v_normal;
varying vec3 v_color;

// Pass the vertex position in view space
// to the fragment shader
// TODO

void main() {
  gl_Position = V * M * vec4(a_position, 1.0);
  
  // Pass the color and transformed vertex position through
  // TODO
  vec3 some_normal_vector = normalize(v_normal);
  mat3 test = mat3(N);
  mat3 testest = normalize(test);

  v_normal = (N * vec4(a_normal, 0)).xyz;
  v_color = a_color;
}

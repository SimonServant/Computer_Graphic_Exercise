attribute vec3 a_position;
attribute vec4 a_color;
// TODO [exercise 9]
uniform mat4 M;

varying vec4 v_color;

void main() {
  gl_Position = M*vec4(a_position, 1);
  //gl_Position = a_position
  // TODO [exercise 9]
  v_color = a_color;
  }

attribute vec3 a_position; 
attribute vec2 a_texCoord; 
varying vec2 v_texCoord; 

uniform mat4 M; 
uniform mat4 V; 

void main() {
  gl_Position = V * M * vec4(a_position, 1.0);
  v_texCoord = a_texCoord;
}

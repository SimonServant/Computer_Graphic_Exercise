precision mediump float;

// Receive color and position values
// TODO

varying vec3 v_normal;
varying vec3 colorVar;
varying vec3 positionVar;

const vec3 lightPos = vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;
const float kA = 0.3;
const float kD = 0.6;
const float kS = 0.7;

void main(void) {
  gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  vec3 cameraPosition = vec3(0, 0, 0);


  // Phong lighting calculation

  // normal vector of intersection
  // v_normal

  // point of intersection
  // positionVar
  vec3 lightVector = normalize(lightPos - positionVar);

  // vector from camera to intersection
  vec3 cameraVector = normalize(positionVar - cameraPosition); 
  
  // ambiente lighting
  float ambienteIntensity = 1.0;
  vec3 ambiente = colorVar * ambienteIntensity * kA;
  

  // diffuse lighting
  vec3 diffuse = vec3(0, 0, 0);
  float diffuseIntensity = 1.0;
  float dotProduct = dot(v_normal, lightVector);

  // if the dot product is bigger than 0 ... only then compute the actual value of "diffuse" 
  // ... because else the value is always 0

  diffuse = colorVar * diffuseIntensity * kD * max(0.0, dotProduct);


  // specular reflection
  vec3 specular = vec3(0, 0, 0);
  // vector from the intersection to the viewers eye

  vec3 r = normalize(lightVector - v_normal * 2.0 * dot(lightVector, v_normal));

  specular = colorVar * kS * pow(max(0.0, dot(r, cameraVector)), shininess);

  // compute the phong-color value
  vec3 phong = ambiente + diffuse + specular;

  // set the color value
  gl_FragColor.x = phong.x;
  gl_FragColor.y = phong.y;
  gl_FragColor.z = phong.z;
  
}

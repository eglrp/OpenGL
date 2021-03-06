#version 330 core
struct Material
{
    sampler2D diffuse;
    sampler2D specular;
	sampler2D emission;
    float shininess;
};

/*
//平行光
struct Light
{
    //vec3 position;
	vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};*/

/*
//定点光
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};
*/

//聚光灯
struct Light {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;
  
    float constant;
    float linear;
    float quadratic;
  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;       
};

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;

out vec4 color;

uniform Material material;
uniform Light light;
uniform vec3 viewPos;
//uniform float time;

void main()
{
	// 环境光
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));

    // 漫反射光
    vec3 norm = normalize(Normal);        
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));  

    // 镜面高光
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
	
	vec3 emission = vec3(texture(material.emission, TexCoords));

	// Spotlight (soft edges)
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = (light.cutOff - light.outerCutOff);
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    diffuse  *= intensity;
    specular *= intensity;

	// Attenuation
    float distance    = length(light.position - FragPos);
    float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    ambient  *= attenuation; 
    diffuse  *= attenuation;
    specular *= attenuation;   
            
    color = vec4(ambient + diffuse + specular, 1.0f);  
}
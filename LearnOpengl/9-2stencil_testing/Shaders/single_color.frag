// Fragment shader:
// ================
#version 330 core
in vec2 TexCoords;

out vec4 outColor;

uniform sampler2D texture1;

void main()
{             
    outColor = vec4(0.04, 0.28, 0.26, 1.0);
}
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

double sigmoid(double x) { return 1 / (1 + pow(2.718, -x)); }

double get_height_classification(double a, double b, double height, int age) {
  double x = (height * a) - (age * b);
  return sigmoid(x);
}

typedef struct param {
  char* name;
  double value;
} t_param;

int get_parameter(int argc, char** argv, t_param* param) {
  for (int i = 1; i < argc - 1; i++) {
    if (strcmp(argv[i], param->name) == 0) {
      param->value = atof(argv[i + 1]);
      return 1;
    }
  }
  return 0;
}

int main(int argc, char **argv) {
  t_param a_param = {"--a", 0};
  t_param b_param = {"--b", 0};

  t_param height = {"--height", 0};
  t_param age = {"--age", 0};

  int found_params[4] = {
    get_parameter(argc, argv, &a_param),
    get_parameter(argc, argv, &b_param),
    get_parameter(argc, argv, &height),
    get_parameter(argc, argv, &age)
  };

  for (int i = 0; i < 4; i++) {
    if (found_params[i] == 0) {
      printf("Missing parameter: %s\n", (i == 0) ? a_param.name : (i == 1) ? b_param.name : (i == 2) ? height.name : age.name);
      exit(0);
    }
  }

  

  printf("%f\n", get_height_classification(a_param.value, b_param.value, height.value, (int)age.value));

  return 0;
}

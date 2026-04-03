#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Função Sigmoide
double sigmoid(double x) { return 1 / (1 + exp(-x)); }

// Derivada da Função Sigmoide: f(x) * (1 - f(x))
double sigmoid_derivative(double output) { return output * (1 - output); }

double get_z(double a, double b, double height, int age) {
  return (height * a) - (age * b);
}

typedef struct param {
  char *name;
  double value;
} t_param;

int get_parameter(int argc, char **argv, t_param *param) {
  for (int i = 1; i < argc - 1; i++) {
    if (strcmp(argv[i], param->name) == 0) {
      param->value = atof(argv[i + 1]);
      return 1;
    }
  }
  return 0;
}

int main(int argc, char **argv) {
  t_param a_param = {"--a", 0.5};
  t_param b_param = {"--b", 0.5};
  t_param height = {"--height", 1.77};
  t_param age = {"--age", 18};
  t_param target = {"--target", 1.0};
  t_param lr = {"--lr", 0.1}; // Learning Rate (Taxa de aprendizado)

  get_parameter(argc, argv, &a_param);
  get_parameter(argc, argv, &b_param);
  get_parameter(argc, argv, &height);
  get_parameter(argc, argv, &age);
  get_parameter(argc, argv, &target);
  get_parameter(argc, argv, &lr);

  printf("Configuração Inicial:\n");
  printf("a: %f, b: %f, height: %f, age: %f, target: %f\n\n", a_param.value, b_param.value, height.value, age.value, target.value);

  // Executa 1000 iterações de treino
  for (int i = 0; i < 1000; i++) {
    double z = get_z(a_param.value, b_param.value, height.value, (int)age.value);
    double output = sigmoid(z);
    double error = target.value - output;

    // Cálculo do gradiente (Derivada parcial)
    // dE/da = error * sigmoid_derivative * height
    // dE/db = error * sigmoid_derivative * (-age)
    double d_sigmoid = sigmoid_derivative(output);
    
    a_param.value += lr.value * error * d_sigmoid * height.value;
    b_param.value += lr.value * error * d_sigmoid * (-age.value);

    if (i % 100 == 0) {
      printf("Iteração %d - Output: %f, Error: %f\n", i, output, error);
    }
  }

  printf("\nValores Finais:\n");
  printf("a: %f, b: %f\n", a_param.value, b_param.value);
  printf("Predição final: %f\n", sigmoid(get_z(a_param.value, b_param.value, height.value, (int)age.value)));

  return 0;
}

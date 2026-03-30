# Início

Computadores, em sua essência, são calculadoras. Sua principal função é realizar cálculos matemáticos. Uma CPU faz basicamente três coisas:

- Escreve dados na memória;
- Lê dados na memória;
- Realiza operações aritméticas (todas as outras operações são variações da adição).

Isso nos traz alguns desafios. Por serem calculadoras extremamente rápidas e poderosas, os computadores são excelentes em problemas que uma calculadora resolveria. No entanto, tarefas que nós, seres humanos, executamos com facilidade — como o reconhecimento facial — nem sempre são simples para as máquinas:

- Computadores costumam ser ineficientes em comparar imagens de forma direta.
- Seres humanos são naturalmente bons em comparar e identificar padrões visuais.

Portanto, o objetivo da área de inteligência artificial é justamente criar algoritmos para resolver esses problemas que são fáceis para seres humanos, mas difíceis para computadores.

# Predictors (Preditores)

Existem duas interpretações principais na literatura sobre o que é um *predictor*:

1. Na literatura acadêmica clássica, o preditor é a função inteira que recebe uma entrada $x$ e retorna uma saída $y$. Nesse contexto, refinamos o preditor para torná-lo mais preciso a partir de um erro (geralmente a diferença entre o resultado esperado e o gerado).
2. Dependendo do contexto, *predictors* também podem ser vistos como os valores de entrada de uma função. Por exemplo, na função:

$$
f(x) = ax
$$

- $f(x) \to$ saída (*output*)
- $x \to$ preditor / entrada (*input*)
- $a \to$ peso (*weight*)

### Refinamento

É possível refinar um preditor a partir de evidências de relações lineares. Uma das formas de fazer isso é a seguinte:

- Coletamos informações verídicas, como a conversão de quilômetros para milhas:

$$
200\text{ km} = 124.27\text{ miles}
$$

- Sabendo que a relação entre km e milhas é linear (proporcional), podemos gerar uma função que recebe quilômetros e retorna milhas:

$$
f(\text{kilometers}) \to \text{miles}
$$

Caso não soubéssemos a fórmula exata, poderíamos começar com um "chute". Vamos considerar um peso (*weight*) inicial de 0.5:

$$
f(x) = 0.5x
$$

Para $x = 200$, o resultado esperado seria $124.27$. Vamos verificar a saída da nossa função:

$$
f(200) = 100
$$

O valor está próximo, mas ainda não é o correto. Podemos calcular a distância entre o resultado obtido e o desejado para medir o ajuste necessário no parâmetro $a$:

$$
\text{error} = t - f(x)
$$
Onde $t$ é o *target* (alvo). No nosso caso:

$$
e = 124.274 - 100 = 24.274
$$

A distância é de $24.274$. A partir desse erro, podemos calcular o quanto precisamos ajustar nosso coeficiente:

$$
\Delta a = e / x
$$
$$
\Delta a = \frac{24.274}{200} = 0.12137
$$

Ao adicionarmos $\Delta a$ ao nosso coeficiente original, teremos um parâmetro mais preciso:

$$
f(x) = (a + \Delta a)x
$$
$$
f(x) = (0.5 + 0.12137)x = 0.62137x
$$

Dessa forma, refinamos o preditor para alcançar uma precisão maior. De forma geral, os preditores funcionam assim e servem de base para a construção de classificadores e, futuramente, redes neurais. Eles são úteis para identificar padrões corretos. 

Considere esta situação: seu amigo lhe entrega um cubo de 2 cm, mas o local onde o cubo deve entrar tem exatamente 1,5 cm. Se você criar um preditor (uma função linear) que relacione o tamanho do cubo com o do buraco, poderá identificar qual encaixe é o correto. Em escala massiva, redes neurais utilizam esse princípio para parametrização.

## Classificadores

Podemos usar preditores como parâmetros para classificar objetos. Por exemplo, para classificar pessoas como "baixas" ou "altas" baseando-nos em dois parâmetros: idade e altura.

- Menores de 18 anos: abaixo de 1,70 m = baixo; acima de 1,70 m = alto.
- Maiores de 18 anos: abaixo de 1,75 m = baixo; acima de 1,75 m = alto.

Precisamos encontrar uma relação matemática que classifique esses dados. Para facilitar o processamento computacional, costumamos encapsular a saída em um formato binário (0 ou 1) usando funções logísticas. Um exemplo clássico é a **Função Sigmoide**:

$$
A(x) = \frac{1}{1+e^{-x}}
$$

Ao representarmos essa função graficamente, temos uma curva em formato de "S":

<p align="center">
<img src="./img/sigmoid_function.png" alt="Função Sigmoide"/>
</p>

Para valores de $x$ maiores que 0, $y$ tende a 1; para valores menores que 0, $y$ tende a 0.

O desafio é encontrar uma função linear que represente a relação entre altura/idade e a classificação. Como o requisito de altura muda com a idade, podemos dizer que a idade "penaliza" a altura no cálculo. O formato da função seria algo como:

$$
z = (x_1 \cdot a) - (x_2 \cdot b)
$$

Onde $x_1$ é a altura e $x_2$ é a idade.

Ao aplicarmos exemplos reais (como um homem de 18 anos com 1,77 m, que deve resultar em $z$ tendendo a 1), podemos ajustar os coeficientes $a$ e $b$ através do processo de erro e refinamento que vimos anteriormente.

# Derivada

Um dos assuntos que acabou de ser introduzido na faculdade foi o conceito de limite. Uma definição rápida de limite seria o comportamento de uma função quando ela se aproxima de um ponto $x$. No entanto, um dos conceitos que é interessante saber, justamente porque podemos utilizar na construção de classificadores pra redes neurais, é o conceito de derivada, justamente pra conseguirmos otimizar nossas funções lineares com maior facilidade.

Bom, imagine que você está dirigindo em uma estrada e quer saber sua velocidade exata em um momento específico, como no terceiro minuto da viagem.

Se você calcular apenas a distância total percorrida e dividir pelo tempo total, vai encontrar a velocidade média.

Mas isso não mostra a velocidade exata naquele instante. Para entender melhor, vamos transformar essa ideia em uma função matemática.

Pense na distância percorrida (em quilômetros) como algo que depende do tempo (em horas), e essa relação pode ser expressa assim a partir da formula geral de movimento retilíneo uniformemente variado:
$$
s(t) = s_0 + v_0t + \frac{a}{2}t^2\\
$$
$$
s_0 = 0\\
v_0 = 2\\
a = 4\\
s(t) = 0 + 2t + \frac{4}{2}t^2\\
$$
$$
s(t) = 2t + 2t^2
$$
Onde $t$ representa o tempo em horas e $s(t)$ a distância em quilômetros.

Agora vme a pergunta "qual é a sua velocidade exatamente no instante em que $t = 1$ hora?"

Se calculássemos a velocidade média entre $t = 1 e $t = 1,1$, por exemplo, fariamos:

$$
v

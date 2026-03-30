# Modelo Conceitual - Bancos de Dados

O modelo conceitual é a etapa antecessora da implementação e estruturação direta no SGBD escolhido (PostgreSQL, MySQL...). Ele consiste na estruturação abstrata das entidades e de como elas se relacionam no seu domínio de negócio (regras de negócio).

<p align="center">
<img src="/posts/database/img/modelo-conceitual.png" alt="Modelo Conceitual"/>
</p>

## Estruturação do modelo conceitual

Por convenção, usamos a notação de Chen para representar o modelo conceitual; ao menos é a notação que usamos na minha faculdade. Portanto, a partir daqui, tudo o que eu disser sobre como representar o modelo conceitual é baseado nessa notação. Existem outras notações, como a de Bachman, mas não vou entrar em detalhes sobre elas aqui.

No entanto, antes de entender como desenhar e representar o modelo conceitual, é importante entender os seus componentes básicos, que são as entidades, os relacionamentos e os atributos. Esses componentes são fundamentais para a construção do modelo conceitual e para a representação das regras de negócio do sistema.

## Entidades

Entidades são os objetos ou conceitos do mundo real que possuem uma existência independente e podem ser identificadas por características ou atributos. Por exemplo, em um sistema de gerenciamento de biblioteca, as entidades podem ser "Livro", "Autor" e "Usuário". Cada entidade representa um conjunto de objetos que compartilham características comuns.

Entidades podem ser representadas por retângulos no modelo conceitual, e o nome da entidade é escrito dentro do retângulo. Além disso, as entidades podem ter atributos, que são as características ou propriedades que descrevem a entidade. Por exemplo, a entidade "Livro" pode ter atributos como "Título", "Autor" e "Ano de Publicação". Os atributos são representados por elipses conectadas à entidade por linhas.
<p align="center">
<img src="/posts/database/img/entidade-atributos-1.png" alt="Entidade e Atributos"/>
</p>

### Classificação de entidades

Podemos classificar as entidades em três tipos: entidades fortes, entidades fracas e entidades associativas.

#### Entidades fortes

São entidades independentes; elas possuem atributos-chave e não dependem de nenhuma outra entidade para existir. Por exemplo, a entidade "Livro" é uma entidade forte, pois ela possui atributos-chave como "ID do Livro" e não depende de nenhuma outra entidade para existir.

#### Entidades fracas

Já as entidades fracas são entidades que dependem de outra entidade para existir, ou seja, elas não possuem atributos-chave próprios e são identificadas por meio de uma relação com outra entidade. Por exemplo, a entidade "Empréstimo" pode ser considerada uma entidade fraca, pois ela depende da existência de um "Usuário" e de um "Livro" para existir. Ela não possui um identificador único próprio, mas é identificada pela combinação do "ID do Usuário" e do "ID do Livro". Na prática, em bancos de dados relacionais, criaríamos a tabela de entidades com uma chave estrangeira (foreign key) e com um cascade delete para garantir a integridade referencial. Assim, quando um usuário ou um livro for deletado, os empréstimos relacionados a eles também serão deletados automaticamente.

#### Entidades associativas

Já as entidades associativas são aquelas que representam uma relação entre duas ou mais entidades e possuem atributos próprios. Por exemplo, a entidade "Matrícula" pode ser considerada uma entidade associativa, pois ela representa a relação entre um "Aluno" e uma "Disciplina", e possui atributos próprios como "Data de Matrícula" e "Nota". Ela é identificada por meio da combinação do "ID do Aluno" e do "ID do Disciplina", mas também possui atributos que descrevem a relação entre essas entidades. Entidades associativas são representadas por um losango no modelo conceitual dentro de um retângulo, e os atributos são representados por elipses conectadas ao losango por linhas.

## Atributos

Atributos consistem em propriedades e características das entidades. Eles são representados por elipses conectadas à entidade por linhas. Existem diferentes tipos de atributos, como atributos simples, compostos, derivados, chaves e multivalorados.

### Atributos simples

Atributos simples são aqueles que não podem ser divididos em partes menores. Por exemplo, o atributo "Nome" de um "Usuário" é um atributo simples, pois ele não pode ser dividido em partes menores. Eles são representados por elipses simples conectadas à entidade por linhas. Na prática, em bancos de dados relacionais, os atributos simples são representados por colunas em uma tabela.

### Atributos compostos

Atributos compostos são aqueles que podem ser divididos em partes menores. Por exemplo, o nome completo de um usuário pode ser dividido em nome e sobrenome. Eles são representados por elipses compostas conectadas à entidade por linhas. Na prática, em um banco de dados relacional, é comum que atributos compostos sejam representados por colunas separadas na tabela, como "Nome" e "Sobrenome", em vez de uma única coluna "Nome Completo". Isso facilita a consulta e a manipulação dos dados.

<p align="center">
  <img src="/posts/database/img/atributo-composto.png" alt="Atributo Composto"/>
</p>

```sql
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL
);
```

### Atributos-chave

Atributos-chave são aqueles que identificam de forma única uma entidade. Por exemplo, o e-mail de um usuário pode ser considerado um atributo-chave, pois ele é único para cada usuário. Eles são representados por elipses simples conectadas à entidade por linhas, e o nome do atributo-chave é sublinhado. Na prática, em bancos de dados relacionais, os atributos-chave são representados por colunas com restrições de unicidade (UNIQUE) ou como chaves primárias (PRIMARY KEY), que gerariam um índice clusterizado ou normal.

```sql
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  nome VARCHAR(255) NOT NULL
);
```

### Atributos derivados

Atributos derivados são aqueles que podem ser calculados a partir de outros atributos. Por exemplo, a idade de um usuário pode ser derivada a partir da data de nascimento. Eles são representados por elipses simples conectadas à entidade por linhas pontilhadas, e o nome do atributo derivado é escrito entre parênteses. Na prática, em bancos de dados relacionais, os atributos derivados podem ser representados por colunas calculadas ou por consultas que realizam o cálculo a partir de outros atributos.

```sql
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  idade INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento))) STORED
);
```

## Relacionamentos

Relacionamentos representam as associações entre as entidades. Eles são representados por losangos conectados, podendo ser classificados em relacionamentos binários, ternários e n-ários, dependendo do número de entidades envolvidas. Além disso, os relacionamentos podem ter atributos próprios, que são representados por elipses conectadas ao losango por linhas. Alguns relacionamentos são representados como uma entidade; nesse caso, eles se tornam uma entidade associativa, como vimos anteriormente. Por exemplo, a relação entre "Aluno" e "Disciplina" pode ser representada por um relacionamento binário, e a relação entre "Aluno", "Disciplina" e "Professor" pode ser representada por um relacionamento ternário. Relacionamentos n-ários envolvem mais de três entidades, mas são menos comuns na prática. Relacionamentos frequentemente são representados por chaves estrangeiras (foreign keys) em bancos de dados relacionais, onde a chave estrangeira em uma tabela referencia a chave primária de outra tabela para estabelecer a relação entre elas. Por exemplo, uma tabela de professor:

```sql
CREATE TABLE professor (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  disciplina_id INT,
  CONSTRAINT fk_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina(id)
);

CREATE TABLE disciplina (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE matricula_disciplina (
  aluno_id INT,
  disciplina_id INT,
  data_matricula DATE,
  nota DECIMAL(5,2),
  PRIMARY KEY (aluno_id, disciplina_id),
  CONSTRAINT fk_aluno FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
  CONSTRAINT fk_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina(id)
);

CREATE TABLE aluno (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  matricula_id INT,
  CONSTRAINT fk_matricula FOREIGN KEY (matricula_id) REFERENCES matricula_disciplina(aluno_id)
);
```

Nesse exemplo, foram criadas três entidades e uma entidade associativa, que é a tabela `matricula_disciplina`, que representa a relação entre `aluno` e `disciplina` e possui atributos próprios como `data_matricula` e `nota`. A tabela `professor` tem uma chave estrangeira para a tabela `disciplina`, representando a relação entre professor e disciplina. A tabela `aluno` tem uma chave estrangeira para a tabela `matricula_disciplina`, representando a relação entre aluno e matrícula. Se fôssemos representar isso no modelo conceitual, seria desta forma:
<p align="center">
  <img src="/posts/database/img/modelo-conceitual-exemplo-sem-cardinalidade.png" height="400" alt="Modelo Conceitual Exemplo"/>
</p>

### Relacionamento identificador

No exemplo, eu não usei esse tipo de relacionamento, mas sim uma entidade associativa. No entanto, é possível representar uma relação entre a entidade aluno e a entidade matrícula com um losango duplo. Esse tipo de relacionamento, onde uma das entidades é fraca, ou seja, depende da existência de outra entidade para existir, é chamado de relacionamento identificador, e a entidade fraca é conectada ao losango por uma linha dupla. No exemplo, a entidade `matrícula` seria uma entidade fraca, pois ela depende da existência de um `aluno` para existir. O relacionamento entre `aluno` e `matrícula` seria representado por um losango duplo, indicando que a existência de uma matrícula depende da existência de um aluno.
<p align="center">
  <img src="/posts/database/img/relacionamento-identificador.png" alt="relacionamento identificador"/>
</p>

Como mencionado anteriormente, esse tipo de relacionamento pode ser representado com um cascade delete em bancos de dados relacionais, para garantir a integridade referencial. Assim, quando um aluno for deletado, as matrículas relacionadas a ele também serão deletadas automaticamente.

```sql
CREATE TABLE aluno (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE matricula (
  id SERIAL PRIMARY KEY,
  aluno_id INT,
  data_matricula DATE,
  nota DECIMAL(5,2),
  CONSTRAINT fk_aluno FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
);
```

### Autorrelacionamento

O autorrelacionamento ocorre quando uma entidade se relaciona consigo mesma. Por exemplo, em uma empresa, um funcionário pode ser o gerente de outro funcionário. Nesse caso, a entidade "Funcionário" teria um autorrelacionamento para representar essa hierarquia. O autorrelacionamento é representado por um losango conectado à entidade por uma linha que retorna para a mesma entidade. No exemplo do funcionário, o losango representaria a relação de supervisão entre os funcionários, indicando que um funcionário pode ser o gerente de outro funcionário.
<p align="center">
  <img src="/posts/database/img/autorelacionamento.png" alt="Auto Relacionamento"/>
</p>

Isso pode ser representado em um banco de dados relacional com uma chave estrangeira que referencia a própria tabela. Por exemplo, a tabela `funcionario` poderia ter uma coluna `gerente_id` que é uma chave estrangeira referenciando a coluna `id` da mesma tabela `funcionario`, indicando que um funcionário pode ser o gerente de outro funcionário.

```sql
CREATE TABLE funcionario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  gerente_id INT,
  CONSTRAINT fk_gerente FOREIGN KEY (gerente_id) REFERENCES funcionario(id)
);
```

## Cardinalidade

A cardinalidade representa a quantidade de instâncias de uma entidade que podem estar associadas a instâncias de outra entidade em um relacionamento. Ela é representada por símbolos próximos às linhas que conectam as entidades ao relacionamento. Os símbolos mais comuns são:

- 1: Representa uma relação de um para um (1:1), onde uma instância de uma entidade está associada a no máximo uma instância de outra entidade, e vice-versa.
- N ou M: Representa uma relação de um para muitos (1:N), onde uma instância de uma entidade pode estar associada a várias instâncias de outra entidade, mas cada instância da outra entidade está associada a no máximo uma instância da primeira entidade.
- N:N ou M:N: Representa uma relação de muitos para muitos, onde várias instâncias de uma entidade podem estar associadas a várias instâncias de outra entidade.
- 0..1: Representa uma relação opcional, onde uma instância de uma entidade pode estar associada a no máximo uma instância de outra entidade, mas essa associação é opcional.

A cardinalidade é escrita nos dois cantos da linha que conecta as entidades ao relacionamento, indicando a quantidade de instâncias de cada entidade que podem estar associadas à outra entidade. Por exemplo, em um relacionamento entre "Aluno" e "Disciplina", a cardinalidade pode ser representada como 1:N, indicando que um aluno pode estar matriculado em várias disciplinas, mas cada disciplina pode ter vários alunos matriculados. A notação é escrita no início da linha que conecta a entidade "Aluno" ao relacionamento, indicando que um aluno pode estar associado a várias disciplinas, e no início da linha que conecta a entidade "Disciplina" ao relacionamento, indicando que uma disciplina pode estar associada a vários alunos.

- **Observação:** No modelo de Chen com notação de cardinalidade mínima e máxima $(min, max)$, a regra de ouro é: os números estão sempre ao lado da entidade que eles descrevem.

<p align="center">
  <img src="/posts/database/img/cardinalidade.png" alt="Cardinalidade"/>
</p>

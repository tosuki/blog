# Modelo Lógico

O modelo lógico é a etapa intermediária entre o **modelo conceitual** (abstrato) e o **modelo físico** (implementação). Diferente do modelo conceitual, que foca na regra de negócio, o modelo lógico descreve a estrutura de dados que será utilizada, definindo tabelas, colunas, tipos de dados e chaves.

Embora o modelo lógico ainda seja, em grande parte, independente de um SGBD (Sistema Gerenciador de Banco de Dados) específico, ele já está vinculado a um **paradigma** (como o Relacional, Orientado a Objetos ou Documental). No contexto relacional, esta etapa é fundamental para aplicar regras de normalização e garantir a integridade dos dados.

---

## Transformação do Conceitual para o Lógico

Abaixo, um exemplo de como uma representação abstrata se torna uma estrutura de tabelas:

<p align="center">
  <img src="./img/modelo-logico@1.png" alt="Modelo Conceitual" />
</p>
<p align="center">
  <img src="./img/modelo-logico@2.png" alt="Modelo Lógico" />
</p>

### Regras de Mapeamento de Cardinalidade

1. **Relacionamentos 1:1**: A chave primária de uma tabela é importada como chave estrangeira na outra. A escolha de qual tabela recebe a FK depende da regra de obrigatoriedade.
2. **Relacionamentos 1:N**: A chave primária do lado "1" torna-se uma chave estrangeira no lado "N". Por exemplo, em "Cliente (1) -> Pedido (N)", o `id_cliente` vai para a tabela `Pedido`.
3. **Relacionamentos M:N**: Gera obrigatoriamente uma **tabela associativa** (ou tabela de ligação). Esta nova tabela conterá, no mínimo, as chaves primárias de ambas as entidades relacionadas como chaves estrangeiras, compondo uma chave primária composta.

---

## Perspectiva Técnica e Baixo Nível

Para garantir que o banco de dados seja performático e livre de redundâncias, o modelo lógico deve endereçar conceitos técnicos profundos:

### 1. Normalização de Dados

A normalização organiza as tabelas para minimizar a redundância e dependências incoerentes.

#### Primeira Forma Normal (1FN)

Exige que todos os atributos sejam **atômicos** (indivisíveis) e que não existam grupos repetitivos.

- **O que significa ser Atômico?** Um atributo é atômico quando ele representa uma única unidade de informação para o domínio do problema. Por exemplo, armazenar uma lista de telefones em uma única coluna separada por vírgula viola a 1FN.
- **Por que a Atomicidade é Crucial (Baixo Nível)?**
  - **Seções Críticas e Concorrência**: Em ambientes de alto **paralelismo**, quando múltiplos processos ou threads tentam acessar ou modificar o mesmo registro, a falta de atomicidade cria **seções críticas** complexas. Se um dado não é atômico (ex: uma string longa que precisa ser "parseada"), o SGBD precisa travar o registro por mais tempo, aumentando a contenção de recursos.
  - **Data Races e Inconsistência**: Se dois processos tentam atualizar partes diferentes de um campo não-atômico simultaneamente, ocorre um **data race**. Sem a separação em unidades atômicas, é impossível garantir que uma atualização parcial não sobrescreva outra de forma inconsistente.
  - **Otimização de Query**: Dados atômicos permitem o uso eficiente de índices. Buscar um valor dentro de uma lista não-atômica exige um *Full Table Scan* ou operações de string custosas na CPU, degradando a performance.

#### Segunda Forma Normal (2FN)

Além da 1FN, exige que todos os atributos não-chave possuam **dependência funcional total** da chave primária. Isso se aplica especificamente a tabelas com **Chaves Primárias Compostas** (quando a PK é formada por mais de uma coluna).

- **O que é uma Chave Composta?** Em SQL, definimos uma chave composta quando uma única coluna não é suficiente para identificar um registro de forma única. Exemplo: `PRIMARY KEY (pedido_id, produto_id)`.

**Exemplo de Violação da 2FN (Dependência Parcial)**:

```sql
    -- Tabela que viola a 2FN
CREATE TABLE itens_pedido (
  pedido_id INT,
  produto_id INT,
  quantidade INT,
  nome_produto VARCHAR(100),
  PRIMARY KEY (pedido_id, produto_id)
);
```

No exemplo acima, `nome_produto` depende apenas de `produto_id`, e não da combinação de `pedido_id` e `produto_id`. Isso é uma **dependência parcial**.

**Impacto Técnico e Performance**:

- **Anomalias de Atualização**: Se o nome de um produto mudar, você terá que atualizar múltiplas linhas em `itens_pedido`, aumentando o risco de inconsistências.
- **Eficiência de Cache (Buffer Pool)**: Dados redundantes (como o nome do produto repetido em cada pedido) "sujam" a memória RAM do SGBD, forçando mais operações de I/O de disco.
- **Manutenção de Índices**: Índices em tabelas não-2FN são fisicamente maiores e mais lentos, pois o motor do banco gerencia mais entradas para valores logicamente idênticos.

**Solução (Normalização)**: Movemos o atributo de dependência parcial para uma nova tabela.

```sql
CREATE TABLE produtos (
  produto_id INT PRIMARY KEY,
  nome_produto VARCHAR(100)
);

CREATE TABLE itens_pedido (
  pedido_id INT,
  produto_id INT,
  quantidade INT,
  PRIMARY KEY (pedido_id, produto_id),
  FOREIGN KEY (produto_id) REFERENCES produtos(produto_id)
);

```

#### Terceira Forma Normal (3FN)

Além da 2FN, exige que não existam **dependências transitivas**. Um atributo não-chave não deve depender de outro atributo não-chave; ele deve depender exclusivamente da chave primária ("A chave, a chave toda, e nada mais que a chave").

- **O problema da Transitividade**: Se o atributo `B` depende de `A`, e `A` depende da PK, então `B` depende da PK de forma indireta. Isso fragiliza a estrutura lógica e gera redundância de dicionário.
- **Impacto em Baixo Nível**:
  - **Redução de I/O de Escrita**: Ao mover dados transitivos para tabelas separadas, as linhas da tabela principal tornam-se menores. Linhas menores significam que mais registros cabem em uma única **Página de Dados** (geralmente 8KB ou 16KB no PostgreSQL/MySQL), reduzindo o número de IOPS necessários para ler ou gravar grandes volumes de dados.
  - **Write Amplification**: Tabelas desnormalizadas sofrem de maior *Write Amplification*, onde uma pequena mudança lógica resulta em grandes alterações físicas nos arquivos de dados e nos logs de transação (WAL - Write Ahead Logging).
  - **Joins vs. Tabelas "Gordas"**: Embora a 3FN exija mais JOINs, realizar um JOIN entre chaves primárias indexadas é, em nível de CPU, frequentemente mais eficiente do que processar uma tabela excessivamente larga que causa *Cache Misses* constantes devido ao seu tamanho.

### 2. Tipagem e Restrições (Constraints)

No nível lógico, as definições de domínio são rigorosas:

- **Chave Primária (PK)**: Identificador único e imutável. Garante a integridade da entidade.
- **Chave Estrangeira (FK)**: Garante a **Integridade Referencial**, impedindo que um registro aponte para um dado inexistente.
- **NOT NULL**: Garante que campos essenciais (como `email` ou `senha`) nunca fiquem vazios.
- **UNIQUE**: Garante que não existam valores duplicados (ex: CPF ou SKU), mesmo que não sejam a PK.
- **CHECK**: Define regras lógicas no nível da coluna (ex: `preco > 0` ou `status IN ('ativo', 'inativo')`).

### 3. Integridade Referencial e Ações em Cascata

Definimos como o banco deve se comportar em operações de `UPDATE` ou `DELETE`:

- **ON DELETE CASCADE**: Se o registro pai for excluído, todos os registros filhos relacionados também serão.
- **ON DELETE SET NULL**: Se o pai for excluído, a referência no filho torna-se nula.
- **RESTRICT/NO ACTION**: Impede a exclusão do pai enquanto houver filhos vinculados.

---

## Ferramentas de Modelagem

No fluxo de desenvolvimento moderno, utilizamos ferramentas on-line e de desktop para automatizar a geração do esquema, como o <a href="https://dbdiagram.io/home">dbdiagram.io</a>. Essas ferramentas facilitam a visualização e permitem exportar o **DML/DDL (SQL)** diretamente para o banco de dados, servindo como documentação viva do projeto.

# Feature: Post Linking (Próximo Registro)

Esta funcionalidade permite conectar posts de forma sequencial ou temática, exibindo um botão flutuante no canto inferior direito que direciona o leitor para o próximo conteúdo relevante.

## 1. Estratégia de Implementação

### 1.1 Metadados (posts/posts.json)
Adicionaremos dois novos campos opcionais aos objetos no arquivo `posts.json`:
- `next_file`: O nome do arquivo `.md` do post que será linkado.
- `next_label`: (Opcional) O texto que aparecerá no botão. Se omitido, usaremos um padrão como "Próximo Registro →".

### 1.2 Lógica de Carregamento (js/app.js)
A função `loadPost` será atualizada para:
1. Carregar a lista de metadados em `posts.json`.
2. Identificar o post atual pelo nome do arquivo.
3. Verificar se existe a propriedade `next_file`.
4. Se existir, criar dinamicamente um elemento de botão e injetá-lo no DOM.

### 1.3 Estilização (css/main.css)
Criaremos uma classe `.floating-next-post` com as seguintes características:
- `position: fixed` para ficar sempre visível no canto inferior direito.
- Estética alinhada ao tema Okaabe (vermelho sangue, bordas nítidas, fontes Cinzel/Roboto).
- Efeitos de hover para interatividade.

## 2. Exemplo de Configuração no JSON

```json
{
    "title": "Conceitos Básicos de Bancos de Dados",
    "date": "2026-03-29",
    "file": "db-concepts.md",
    "summary": "...",
    "next_file": "sql-advanced.md",
    "next_label": "Aprofundar em SQL →"
}
```

## 3. Benefícios
- Melhora a navegabilidade do blog.
- Incentiva a leitura contínua de séries de posts.
- Mantém a interface limpa e focada no conteúdo.

# Project Specification: Okaabe's Chronicles

## 1. Visão Geral
Um blog estático minimalista, focado em performance e estética "Gótica/Vitoriana" (inspirada em Hellsing/Alucard), sem dependências de frameworks pesados (No-SPA).

## 2. Estrutura de Arquivos
- `/index.html`: Página inicial com a lista de registros.
- `/post.html`: Template para visualização de um registro completo.
- `/js/app.js`: Lógica central (carregamento de posts, Markdown, Temas).
- `/css/main.css`: Estilização baseada em variáveis CSS.
- `/posts/`: Diretório raiz dos conteúdos.
  - `posts.json`: Índice global de metadados dos posts.
  - `[categoria]/`: Pastas aninhadas para organização temática.
    - `[post].md`: Conteúdo em Markdown.
    - `img/`: Assets locais exclusivos do post.

## 3. Padrões Técnicos
- **Vanilla JavaScript:** Nenhuma biblioteca de UI (React/Vue).
- **Markdown:** Renderizado via `marked.js`. **Nota importante:** Devido à configuração do servidor, o diretório base para resolução de caminhos de imagem (`src`) é sempre a raiz do projeto (./). Portanto, imagens em `assets/img/` devem ser referenciadas como `./img/` no Markdown, pois o servidor mapeia essa rota internamente. Além disso, links devem ser criados utilizando o elemento HTML `<a>` em vez da sintaxe Markdown `[texto](url)` ou `![]()`.
- **LaTeX:** Suporte a fórmulas matemáticas via `KaTeX`.
- **Temas:** Variáveis CSS (`--bg-color`, `--primary-color`, etc.) com alternância via `data-theme`. Default: `light`.
- **Organização:** Posts devem ser agrupados em pastas se possuírem assets próprios.
- **Ordenação:** Os posts são exibidos do mais recente para o mais antigo (ordem decrescente por data).

## 4. O que já foi feito
- [x] Configuração base HTML/CSS/JS.
- [x] Sistema de troca de temas (Light/Dark).
- [x] Renderização de Markdown com realce de sintaxe (Prism.js).
- [x] Suporte a pastas aninhadas e assets relativos no Markdown.
- [x] Organização inicial dos posts existentes.
- [x] Gif de preview no README.
- [x] Sistema de Paginação com ordenação decrescente por data.
- [x] Sistema de Busca por texto e Filtro por categoria.
- [x] **Post Linking (Próximo Registro):** Botão flutuante para navegar entre posts relacionados.
- [x] **Galeria de Imagens:** Visualização em grid com Lightbox para assets do blog.
- [x] **RSS Feed:** Geração de feed XML via script Python para leitores de RSS.

## 6. Planejamento: Sistema de Paginação (Concluído)
### Objetivo
Evitar o carregamento excessivo de DOM na página inicial conforme o número de posts cresce.

### Estratégia de Implementação
1. **Configuração:** Definir uma constante `POSTS_PER_PAGE` (ex: 5).
2. **Estado:** Manter o `currentPage` na URL (ex: `index.html?page=1`) para permitir compartilhamento de links de páginas específicas.
3. **Lógica de Carregamento:**
   - Alterar `loadPostList` para ler o parâmetro `page` da URL.
   - Realizar o `slice()` no array de posts vindo do `posts.json`.
   - Calcular o total de páginas: `Math.ceil(posts.length / POSTS_PER_PAGE)`.
4. **UI de Navegação:**
   - Adicionar botões "Anterior" e "Próximo" ao final da lista.
   - Desabilitar botões se não houver página anterior/próxima.
   - Estilizar os botões seguindo a estética do blog (bordas vermelhas, fonte Cinzel).
5. **Transição:** Adicionar um efeito suave de fade ao trocar de página.

## 7. Planejamento: Sistema de Busca e Filtro (Concluído)
### Objetivo
Permitir que o usuário localize registros específicos rapidamente sem navegar por todas as páginas.

### Estratégia de Implementação
1. **Categorias Dinâmicas:** Extrair categorias automaticamente das pastas no `posts.json` (ex: "database/", "math/").
2. **UI (index.html):**
   - Barra de busca lateral ou acima da lista de posts.
   - Lista de tags/categorias clicáveis.
3. **Lógica (`js/app.js`):**
   - **Filtro Combinado:** Aplicar busca por texto e filtro de categoria antes da paginação.
   - **Parâmetros de URL:** `?q=texto` e `?cat=categoria`.
   - **Feedback:** Mostrar "Exibindo X resultados para 'Y'" ou "Nenhum resultado para 'Z'".
4. **UX:** Botão para limpar filtros e restaurar a lista completa.

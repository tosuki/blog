# Okaabe's Chronicles - Blog Estático

Este é um blog estático minimalista inspirado na estética de Alucard (Hellsing).

## Como funciona?
- **No-SPA:** O blog utiliza HTML/CSS/JS simples, sem frameworks pesados, garantindo compatibilidade total com GitHub Pages e Cloudflare Pages.
- **Markdown & LaTeX:** Os posts são escritos em Markdown. Suporte a fórmulas matemáticas via KaTeX.
- **Temas:** Suporte a Dark/Light Mode através de variáveis CSS.

## Como adicionar um novo Post?
1. Crie um novo arquivo `.md` dentro da pasta `/posts`.
2. Edite o arquivo `/posts/posts.json` e adicione uma nova entrada para o seu post:
   ```json
   {
       "title": "Seu Título",
       "date": "2026-XX-XX",
       "file": "seu-arquivo.md",
       "summary": "Um breve resumo do post."
   }
   ```
3. Suba as alterações para o seu repositório Git.

## Tecnologias Utilizadas
- [Marked.js](https://marked.js.org/) para renderização de Markdown.
- [Prism.js](https://prismjs.com/) para destaque de sintaxe em blocos de código.
- [KaTeX](https://katex.org/) para suporte a LaTeX.
- Google Fonts (Cinzel & Roboto).

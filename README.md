# Okaabe's Chronicles - Blog Estático

![Preview](assets/preview.gif)

Este é um blog estático minimalista inspirado na estética de Alucard (Hellsing).

## Como funciona?
- **No-SPA:** O blog utiliza HTML/CSS/JS simples, sem frameworks pesados, garantindo compatibilidade total com GitHub Pages e Cloudflare Pages.
- **Markdown & LaTeX:** Os posts são escritos em Markdown. Suporte a fórmulas matemáticas via KaTeX.
- **Temas:** Suporte a Dark/Light Mode através de variáveis CSS.

## Como adicionar um novo Post?
1. Crie uma pasta para o seu post (ex: `/posts/meu-tema`).
2. Adicione o arquivo `.md` dentro dessa pasta (ex: `/posts/meu-tema/meu-post.md`).
3. Adicione os assets visuais na pasta central `/assets/img/`.
4. No Markdown, referencie as imagens de forma simples: `![Legenda](./img/foto.png)`. O blog redirecionará automaticamente para a pasta correta.
5. Edite o arquivo `/posts/posts.json` e adicione a nova entrada:
   ```json
   {
       "title": "Seu Título",
       "date": "2026-XX-XX",
       "file": "meu-tema/meu-post.md",
       "summary": "Um breve resumo do post."
   }
   ```
6. Suba as alterações para o seu repositório Git.

## Tecnologias Utilizadas
- [Marked.js](https://marked.js.org/) para renderização de Markdown.
- [Prism.js](https://prismjs.com/) para destaque de sintaxe em blocos de código.
- [KaTeX](https://katex.org/) para suporte a LaTeX.
- Google Fonts (Cinzel & Roboto).

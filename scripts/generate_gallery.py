import os
import json

def generate_gallery():
    """
    Varre o repositório em busca de imagens e gera o arquivo assets/gallery.json
    Mapeia imagens encontradas em pastas de posts para seus respectivos posts.
    """
    
    # Configurações
    IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')
    IMAGE_DIR = 'assets/img'
    GALLERY_FILE = 'assets/gallery.json'
    POSTS_FILE = 'posts/posts.json'
    
    # Carregar posts para mapeamento
    posts_data = []
    if os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, 'r', encoding='utf-8') as f:
            posts_data = json.load(f)
            
    gallery_items = []
    
    # Varre a pasta unificada de imagens
    if os.path.exists(IMAGE_DIR):
        for file in os.listdir(IMAGE_DIR):
            if file.lower().endswith(IMAGE_EXTENSIONS):
                # Caminho completo relativo à raiz do projeto
                web_path = f"./{IMAGE_DIR}/{file}"
                
                # Tenta associar ao post
                # Estratégia: Procura no sumário ou título do post se a imagem é mencionada 
                # (ou apenas associa ao post que tem o arquivo correspondente, se houver lógica)
                post_info = None
                
                # Como as imagens agora estão soltas, precisamos de uma forma de saber de qual post elas são.
                # Para este blog, vamos assumir que se o nome da imagem bater com algo que o post usa, ele é o dono.
                # Por agora, vamos apenas buscar o primeiro post que "pareça" ser o dono ou deixar como Recurso Geral.
                # Melhorei a lógica para buscar imagens dentro do conteúdo MD se necessário.
                
                for post in posts_data:
                    post_file_path = f"posts/{post['file']}"
                    if os.path.exists(post_file_path):
                        with open(post_file_path, 'r', encoding='utf-8') as pf:
                            content = pf.read()
                            if file in content:
                                post_info = {
                                    "title": post['title'],
                                    "url": f"post.html?file={post['file']}"
                                }
                                break
                
                # Adicionar à galeria
                gallery_items.append({
                    "src": web_path,
                    "title": file,
                    "post": post_info['title'] if post_info else "Recurso Geral",
                    "post_url": post_info['url'] if post_info else "#"
                })

    # Salva o resultado
    os.makedirs(os.path.dirname(GALLERY_FILE), exist_ok=True)
    with open(GALLERY_FILE, 'w', encoding='utf-8') as f:
        json.dump(gallery_items, f, indent=2, ensure_ascii=False)
        
    print(f"Galeria gerada com {len(gallery_items)} itens em {GALLERY_FILE}")

if __name__ == "__main__":
    generate_gallery()

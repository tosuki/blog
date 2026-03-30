import base64
import os
import re
import mimetypes
import argparse

def embed_images(target_path, img_base_dir="."):
    """
    Procura por referências de imagens em arquivos Markdown e as converte para Base64.
    """
    if os.path.isdir(target_path):
        files = [os.path.join(target_path, f) for f in os.listdir(target_path) if f.endswith('.md')]
    else:
        files = [target_path]

    for file_path in files:
        if not os.path.exists(file_path):
            print(f"Arquivo não encontrado: {file_path}")
            continue
            
        print(f"Processando {file_path}...")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        def replace_match(match):
            img_path = match.group(1)
            
            # Resolve o caminho da imagem:
            # 1. Se começar com /, remove a barra para buscar a partir do img_base_dir
            # 2. Caso contrário, busca relativo ao diretório do arquivo markdown
            if img_path.startswith('/'):
                full_path = os.path.join(img_base_dir, img_path.lstrip('/'))
            else:
                full_path = os.path.join(os.path.dirname(file_path), img_path)

            if os.path.exists(full_path):
                mime_type, _ = mimetypes.guess_type(full_path)
                if not mime_type:
                    mime_type = "image/png" # Fallback
                
                with open(full_path, "rb") as img_f:
                    data = img_f.read()
                    b64 = base64.b64encode(data).decode("utf-8")
                    print(f"  Incorporando: {img_path} ({mime_type})")
                    return f'src="data:{mime_type};base64,{b64}"'
            else:
                print(f"  Aviso: Imagem não encontrada em {full_path}")
                return match.group(0)
                
        # Regex para capturar src="path/to/image"
        new_content = re.sub(r'src="([^" \n]+\.(?:png|jpg|jpeg|gif|webp|svg))"', replace_match, content, flags=re.IGNORECASE)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Sucesso: {file_path} atualizado.")
        else:
            print(f"Nenhuma alteração necessária para {file_path}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Converte imagens locais em Markdown para Base64.")
    parser.add_argument("target", help="Arquivo .md ou diretório contendo arquivos .md")
    parser.add_argument("--base-dir", default=".", help="Diretório base para resolver caminhos que começam com '/' (padrão: .)")
    
    args = parser.parse_args()
    embed_images(args.target, args.base_dir)

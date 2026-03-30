import os
import json
from datetime import datetime
import email.utils

def generate_rss():
    """
    Gera o arquivo rss.xml a partir de posts/posts.json
    """
    
    # Configurações
    BASE_URL = "https://tosuki.github.io/blog/"
    BLOG_TITLE = "Okaabe's Chronicles"
    BLOG_DESCRIPTION = "Um blog estático minimalista, focado em performance e estética Gótica/Vitoriana."
    POSTS_FILE = 'posts/posts.json'
    RSS_FILE = 'rss.xml'
    
    if not os.path.exists(POSTS_FILE):
        print(f"Erro: {POSTS_FILE} não encontrado.")
        return
        
    with open(POSTS_FILE, 'r', encoding='utf-8') as f:
        posts_data = json.load(f)
        
    # Ordenar por data decrescente
    posts_data.sort(key=lambda x: x['date'], reverse=True)
    
    # Cabeçalho do RSS
    last_build_date = email.utils.formatdate(datetime.now().timestamp(), usegmt=True)
    
    rss_items = []
    for post in posts_data:
        # Converter YYYY-MM-DD para RFC 822
        try:
            dt = datetime.strptime(post['date'], "%Y-%m-%d")
            pub_date = email.utils.formatdate(dt.timestamp(), usegmt=True)
        except ValueError:
            pub_date = last_build_date
            
        post_url = f"{BASE_URL}post.html?file={post['file']}"
        
        item = f"""    <item>
      <title>{post['title']}</title>
      <link>{post_url}</link>
      <guid isPermaLink="true">{post_url}</guid>
      <pubDate>{pub_date}</pubDate>
      <description><![CDATA[{post['summary']}]]></description>
    </item>"""
        rss_items.append(item)
        
    rss_content = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>{BLOG_TITLE}</title>
  <link>{BASE_URL}</link>
  <description>{BLOG_DESCRIPTION}</description>
  <language>pt-br</language>
  <lastBuildDate>{last_build_date}</last_build_date>
  <atom:link href="{BASE_URL}rss.xml" rel="self" type="application/rss+xml" />
  
{"\n".join(rss_items)}
</channel>
</rss>"""

    with open(RSS_FILE, 'w', encoding='utf-8') as f:
        f.write(rss_content)
        
    print(f"RSS Feed gerado com sucesso em {RSS_FILE} ({len(posts_data)} itens)")

if __name__ == "__main__":
    generate_rss()

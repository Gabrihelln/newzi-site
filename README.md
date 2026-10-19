# Newzi - site

Landing page do Newzi, feita a partir do mockup aprovado (`news/design/landing-page/newzi-landing-mockup.png`).
É um site estático: HTML, CSS e um pouco de JavaScript, sem build e sem dependências.

## Rodar localmente

```sh
python -m http.server 4321
```

Depois abra http://localhost:4321.

## Estrutura

```
index.html            landing page
privacidade.html      política de privacidade
termos.html           termos de uso
excluir-conta.html    como excluir a conta e o que é apagado
assets/css/styles.css estilos (desktop igual ao mockup em 1440 px; tablet e celular abaixo de 1100/860/720 px)
assets/js/main.js     links das lojas e páginas legais, menu do celular, preço anual/mensal, onda do player
assets/img/           logo, ícone do app, telas do app (WebP) e imagem de compartilhamento (og.jpg)
assets/fonts/         Inter e Newsreader em WOFF2, só com os caracteres latinos (licenças OFL junto)
```

As telas do celular vêm de `news/design/landing-page/screens/` (Início) e `news/design/onboarding/png/`
(onboarding). Para trocar uma tela, gere o PNG de novo e converta para WebP com 780 px de largura.

## Antes de publicar

Preencha os links no topo de `assets/js/main.js`. Enquanto estiverem vazios, os botões levam à seção de download:

- `ios`: página do Newzi na App Store;
- `terms`, `privacy` e `delete-account` já apontam para `termos.html`, `privacidade.html` e `excluir-conta.html`
  (a App Store pede a política de privacidade e um jeito de excluir a conta). Antes de publicar, troque nessas
  três páginas cada `[PREENCHER: …]` (razão social, CNPJ, endereço, e-mail de contato, encarregado, idade mínima,
  país do servidor e foro);
- `press` e `contact`: imprensa e contato (página ou `mailto:`).

Quando o app chegar ao Google Play, troque o botão "Em breve no Google Play" por um link `class="store"`.

As páginas já usam `https://newzi.app` no `og:image`, no `og:url` e no `canonical`, e o site tem
`robots.txt` e `sitemap.xml`. Se o domínio mudar, troque nesses lugares.

## Publicar na VPS (Nginx)

A configuração fica em `deploy/nginx-newzi.app.conf`. Ela serve a pasta `/var/www/newzi-site`, manda
`www.newzi.app` para `newzi.app` e bloqueia `.git`, `deploy/` e o `README.md`.

1. DNS: registros `A` (e `AAAA`, se a VPS tiver IPv6) de `newzi.app` e `www.newzi.app` apontando para a VPS.
   Confira com `dig +short newzi.app` e `dig +short www.newzi.app`.

2. Na VPS, baixe o site e ative a configuração:

   ```sh
   sudo git clone https://github.com/Gabrihelln/newzi-site.git /var/www/newzi-site
   sudo cp /var/www/newzi-site/deploy/nginx-newzi.app.conf /etc/nginx/sites-available/newzi.app
   sudo ln -s /etc/nginx/sites-available/newzi.app /etc/nginx/sites-enabled/newzi.app
   sudo nginx -t && sudo systemctl reload nginx
   ```

   Se já existir um `server` com `default_server` ou com `server_name newzi.app` (por exemplo
   `/etc/nginx/sites-enabled/default`), remova ou ajuste antes, senão o Nginx avisa de conflito.

3. HTTPS com Let's Encrypt (precisa do DNS já apontando e das portas 80 e 443 abertas):

   ```sh
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d newzi.app -d www.newzi.app --redirect
   sudo certbot renew --dry-run
   ```

4. Teste:

   ```sh
   curl -I http://newzi.app            # 301 para https://newzi.app/
   curl -I https://www.newzi.app       # 301 para https://newzi.app/
   curl -I https://newzi.app           # 200
   curl -I https://newzi.app/privacidade.html
   curl -I https://newzi.app/README.md # 403
   curl -I https://newzi.app/.git/config # 403
   ```

Para atualizar depois de um `git push`:

```sh
cd /var/www/newzi-site && sudo git pull
```

Não é preciso recarregar o Nginx para mudanças no site, só quando a configuração mudar.

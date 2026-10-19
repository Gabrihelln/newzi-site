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

Na `og:image` do `index.html`, use o endereço completo do site quando ele tiver domínio
(por exemplo `https://newzi.app/assets/img/og.jpg`), porque as redes sociais não leem caminhos relativos.

## Publicar

Qualquer hospedagem de arquivos estáticos serve. No VPS com Nginx, copie a pasta para o servidor e aponte um
`server` para ela:

```nginx
server {
    server_name newzi.app www.newzi.app;
    root /var/www/newzi-site;
    index index.html;
    location /assets/ { expires 30d; add_header Cache-Control "public"; }
}
```

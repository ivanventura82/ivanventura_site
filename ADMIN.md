# Painel de projetos

A implementação usa Decap CMS 3.16.2, a conta GitHub com permissão de escrita e o serviço OAuth da Netlify. Não existe senha nem token de escrita no código. A rota `/admin/` exibe o login; somente contas autorizadas pelo GitHub podem salvar/publicar.

## Ativação necessária

1. Na conta proprietária do GitHub, registrar um OAuth App: nome `Ivan Ventura — Projetos`, homepage `https://ivanventura.com.br`, callback **`https://api.netlify.com/auth/done`**.
2. Na Netlify do site existente: **Project configuration → Access & security → OAuth → Install provider → GitHub**. Inserir Client ID e Client Secret diretamente ali. Nunca colocar o secret no repositório nem na conversa.
3. Publicar esta versão e abrir `https://ivanventura.com.br/admin/`. Entrar com a conta que tem escrita em `ivanventura82/ivanventura_site`.
4. Fazer o teste autenticado: criar projeto de teste, anexar original, salvar rascunho, reabrir e confirmar prévia. Confirmar que master e site público não mudaram. Excluir o rascunho. A etapa de autenticação/salvamento remoto não foi validada enquanto o provedor não estiver conectado.

Documentação oficial: https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/ e https://decapcms.org/docs/github-backend/.

## Rotina do editor

Em Projetos, criar ou abrir um projeto. Preencher os dados, enviar a capa original, adicionar páginas à galeria e arrastá-las para reordenar. A segunda foto de cada página é opcional. A prévia ao lado confere fotos, textos e composições; não reproduz a navegação animada. Salvar rascunho mantém a versão pública anterior. Publicar integra a alteração e inicia a atualização da Netlify; aguardar a publicação concluir.

**Privacidade:** este repositório é público. O login restringe a edição, não a leitura do repositório. Rascunhos do fluxo editorial são branches/pull requests públicos. Fotos originais também são legíveis no GitHub. Não usar para material confidencial. Para rascunhos e originais confidenciais, primeiro configurar um repositório privado e seu acesso pela hospedagem.

## Dados e imagens

- `content/projetos/*.json` passa a ser a fonte de edição; um registro por projeto.
- `src/projetos.json` conserva o arquivo anterior para referência; não editar esse arquivo como fonte após a ativação.
- `ordem` preserva a sequência dos 66 projetos; os endereços existentes permanecem iguais.
- `content/uploads` recebe JPG, PNG e WebP (até 50 MB e 100 megapixels por imagem). Não aceita RAW, HEIC, GIF ou SVG. Fotos HEIC precisam ser exportadas para JPG.
- `npm run build` executa `scripts/prepare-content.cjs` antes do Webpack. Gera `.generated/projetos.json` no formato já utilizado pelo site e quatro arquivos WebP por foto nova: base, 720w, 1024w e 1920w. Não corta, não amplia imagens pequenas, aplica orientação EXIF e remove metadados.
- O arquivo base é uma cópia da versão até 1920px. Os originais não são enviados à pasta pública `dist`; o navegador continua recebendo somente os tamanhos otimizados. Originais permanecem no histórico público do GitHub.
- Fotos existentes são reutilizadas sem recompressão. A construção falha antes da publicação se há caminho inválido, nova imagem ausente, identificação duplicada ou imagem não suportada; a Netlify mantém a versão anterior.
- Instalar dependências com o lockfile atualizado. Sharp exige Node >=18.17; usar Node 20 ou 22 na Netlify.
- A visualização do conteúdo protege contra HTML nos textos. Layouts e módulos de animação públicos não foram alterados.

## Verificação realizada

Build Webpack concluído. Testes: equivalência semântica dos 66 projetos, ordem e endereços preservados, composição dupla, geração WebP nas três larguras, foto pequena sem ampliação, escape de texto, rejeição de caminho inválido, nova imagem ausente e identificador repetido.

Foram detectadas 15 referências antigas sem arquivo correspondente em Museu da Água, Notre Dame e Fazenda Restaurante. Foram preservadas, sem inventar fotos ou remover páginas. As novas imagens são validadas estritamente; referências antigas ausentes geram aviso.

## Retorno

Reverter o commit de integração restaura o Webpack e a fonte de dados anteriores. A integração deve ser feita só depois de o login estar configurado e o teste autenticado passar.

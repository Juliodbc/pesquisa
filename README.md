# Perfil Mobile

Aplicativo Ionic Vue 3 com TypeScript, Capacitor e Firebase Authentication, Cloud Firestore e Storage.

## Executar no navegador

1. Instale Node.js LTS e execute `npm install`.
2. Copie `.env.example` para `.env` e preencha as credenciais do app Web no Firebase Console.
3. No Firebase Console, crie um projeto, habilite Authentication com provedor E-mail/senha, crie o banco Firestore e habilite Storage.
4. Publique `firestore.rules` e `storage.rules` pelo Firebase Console ou Firebase CLI (`firebase deploy --only firestore:rules,storage`).
5. Execute `npm run dev` para abrir o app no navegador.

Os valores `VITE_FIREBASE_*` são configuração pública do app Web Firebase, não credenciais administrativas. Nunca coloque chave privada ou service account no frontend. As regras restringem documentos e arquivos ao UID autenticado.

## Android com Capacitor

Depois de preencher `.env`, execute `npm run build`, `npx cap add android` (uma vez), `npx cap sync android` e `npx cap open android`. No Android Studio, compile e execute em um dispositivo ou emulador. A seleção de imagem usa o plugin Capacitor Camera e a galeria do sistema.

## Arquivos

- `src/services/firebase.ts`: inicializa os SDKs conforme variáveis de ambiente.
- `src/services/session.ts`: restaura sessão e cria conta com perfil inicial.
- `src/services/profile.ts`: lê/grava perfil, envia imagem para Storage e mantém uma cópia JPEG reduzida em base64 no documento `images/{uid}` do Firestore.
- `src/router/index.ts`: rotas públicas e protegidas por sessão.
- `src/views/LoginPage.vue`, `CadastroPage.vue`, `RecuperarSenhaPage.vue`: autenticação.
- `src/views/BoasVindasPage.vue`, `PerfilPage.vue`: início, edição e persistência do perfil.
- `src/theme/variables.css`: identidade visual responsiva.
- `firestore.rules`, `storage.rules`: autorização dos dados por UID.

## Roteiro de verificação manual

1. Com variáveis e serviços Firebase configurados, criar conta com nome, e-mail e senha; confirmar usuário no Authentication e documento `users/{uid}` no Firestore.
2. Tentar cadastro com senhas diferentes e verificar a validação; entrar com as credenciais e conferir saudação.
3. Solicitar recuperação para um e-mail cadastrado e conferir a mensagem enviada pelo Firebase.
4. Atualizar nome, nickname, data de nascimento e foto; reabrir ou entrar de novo e verificar persistência.
5. Sair e tentar abrir `/inicio` ou `/perfil`; confirmar redirecionamento para login.
6. No Firestore, confirmar que `images/{uid}` contém `image` (string base64) e que a foto continua sendo exibida após novo login. Essa coleção/documento é criado automaticamente no primeiro salvamento da foto; não precisa ser criado manualmente.
7. Verificar que regras negam leitura/escrita em documentos e caminhos Storage pertencentes a outro UID.
8. Compilar com `npm run build` e executar no navegador; sincronizar e validar seleção de imagem no Android.

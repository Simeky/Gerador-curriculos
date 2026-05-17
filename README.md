# Gerador de Currículos

## Visão Geral

O Gerador de Currículos é uma aplicação web desenvolvida em Next.js que permite aos usuários criar, editar, visualizar e gerenciar currículos de forma dinâmica. A solução oferece formulário inteligente, visualização em tempo real, sugestões de melhoria e integração com Firestore para persistência de dados.

## Funcionalidades Principais

- Criação de currículo com campos pessoais, experiência, formação e habilidades
- Edição de currículo existente com atualização direta no banco de dados
- Visualização prévia do currículo com layout de impressão/PDF
- Sugestões em tempo real para aprimorar o currículo
- Busca e filtro de currículos salvos
- Persistência de dados usando Firestore

## Tecnologias

- Next.js (App Router)
- React
- Firebase Firestore
- TypeScript
- React Hook Form
- Yup
- Tailwind CSS
- Lucide Icons
- Sonner para notificações

## Estrutura do Projeto

- `src/app` - Rotas principais da aplicação
  - `sistema/curriculos/gerador` - Página de criação de currículo
  - `sistema/curriculos/editar` - Página de edição de currículo
  - `sistema/curriculos/lista` - Listagem de currículos
  - `sistema/curriculos/detalhes` - Exibição de detalhes do currículo
- `src/components` - Componentes reutilizáveis
  - `FormCurriculo` - Formulário de criação/edição
  - `PreviewCurriculo` - Visualização do currículo
  - `RealTimeSuggestions` - Sugestões em tempo real
- `src/lib` - Lógica de serviço e utilitários
  - `CurriculoService.ts` - Operações Firestore
  - `SuggestionsService.ts` - Regras de sugestão de currículo
  - `validationSchemas.ts` - Validação compartilhada

## Configuração
Rodar Localmente:
1. Crie o arquivo de ambiente .env

2. Configure as variáveis do Firebase no `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

3. Instale dependências:

```bash
npm install
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra no navegador:

```text
http://localhost:3000
```

## Fluxo de Edição de Currículo

- A lista de currículos permite selecionar um registro para edição
- A página de edição carrega os dados existentes com base no `id`
- Ao salvar, a aplicação usa o endpoint `PUT /api/curriculo?id={id}` para atualizar o mesmo currículo
- O botão de salvar no formulário passa a chamar o fluxo de atualização em vez de criar um novo registro

---
Disponível em gerador-curriculos-lcr4.vercel.app
Desenvolvido para gerar currículos profissionais de forma rápida e intuitiva.

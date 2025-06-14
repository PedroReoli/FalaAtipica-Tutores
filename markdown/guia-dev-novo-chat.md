# Guia para Desenvolvedores (Novo Chat Cursor)

Este documento serve para orientar qualquer desenvolvedor que for assumir ou continuar o projeto FalaAtípica - Tutores em outro chat do Cursor.

## Contexto
- O FalaAtípica é uma tecnologia assistiva para crianças não verbais.
- Este repositório é dedicado ao app dos tutores (pais, responsáveis, educadores).
- O projeto está pronto para MVP, com arquitetura modular, integração Supabase e Pix.

## Estrutura do Projeto
- Telas separadas por domínio em subpastas (`src/screens/Auth`, `Home`, `Profile`, etc).
- Componentes reutilizáveis em `src/components`.
- Serviços (Supabase, Pix) em `src/services`.
- Temas e variáveis em `src/styles`.

## Como Contribuir
1. Sempre siga a arquitetura de pastas e use os componentes do tema.
2. Para novas telas, crie arquivos na subpasta correspondente.
3. Use o `index.ts` de `src/screens` para centralizar exports.
4. Integrações com Supabase devem ser feitas via `src/services/supabase.ts`.
5. Para pagamentos, use ou expanda `src/services/paymentService.ts`.
6. Documente decisões importantes em `markdown/Chat-Context.md`.

## Fluxos Importantes
- Cadastro, login, gerenciamento de crianças, progresso, dicas, suporte e upgrade de plano já estão prontos.
- Upload de conteúdo é feito apenas via plataforma web dos profissionais.

## Dúvidas?
- Consulte os arquivos markdown para regras de negócio, estrutura de banco e contexto.
- Siga sempre o padrão visual e de código já estabelecido. 
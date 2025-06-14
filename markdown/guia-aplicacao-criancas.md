# Guia para Aplicação das Crianças (Kids)

Este documento orienta o desenvolvimento do app infantil do FalaAtípica.

## Objetivo
- Proporcionar comunicação alternativa e aumentativa para crianças não verbais.
- Interface visual, sonora, gamificada e extremamente simples.

## Regras de Negócio
- A criança só acessa conteúdos visuais/sonoros liberados pelo tutor/profissional.
- Não há acesso a configurações, edição ou dados sensíveis.
- Não há login: acesso direto ao conteúdo.
- Todo conteúdo é seguro, sem links externos.

## Telas Principais
- **Tela Inicial:** Escolha de categoria (Comidas, Animais, Ações, etc).
- **Tela de Itens:** Grade de imagens/sons (ex: água, suco, pão, etc).
- **Jogos:**
  - Jogo 1: Sombra Misteriosa (associação imagem-som, reforço positivo)
  - Jogo 2: Fale Comigo! (divisão da palavra em sílabas, microfone, reforço positivo)
- **Feedback:** Reforço visual e auditivo imediato após cada interação.

## Integração
- Consome conteúdos e progresso via Supabase (apenas leitura).
- Não permite upload, edição ou exclusão.
- Recebe atualizações de conteúdo feitas pelo tutor/profissional.

## Acessibilidade
- Botões grandes, contraste alto, navegação por toque.
- Feedback sonoro e visual em todas as ações.

## Segurança
- Sem coleta de dados pessoais.
- Sem propagandas ou links externos.

## Referências
- Veja `markdown/regras-negocio.md` para detalhes dos jogos e regras.
- Consulte o app dos tutores para exemplos de integração visual e de dados. 
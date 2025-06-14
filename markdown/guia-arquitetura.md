# Guia de Arquitetura do Projeto FalaAtípica

## Visão Geral
- Projeto dividido em três plataformas: Tutores (este repo), Crianças (Kids) e Plataforma Web (Profissionais).
- Cada plataforma tem seu próprio repositório, mas compartilham princípios de arquitetura e integração.

## Estrutura de Pastas (Tutores)
- `src/screens`: Telas separadas por domínio em subpastas.
- `src/components`: Componentes reutilizáveis.
- `src/services`: Integração com Supabase, Pix, etc.
- `src/styles`: Temas, variáveis e estilos globais.
- `src/types`: Tipos e interfaces TypeScript.
- `src/utils`: Funções utilitárias.

## Boas Práticas
- Sempre use as cores e componentes do tema.
- Separe lógica de apresentação (componentes) da lógica de dados (serviços).
- Documente decisões importantes no markdown.
- Use contextos para autenticação, tema e dados globais.

## Expansão para Outras Plataformas
- O app das crianças deve consumir apenas dados de leitura do Supabase.
- O painel web pode usar a mesma estrutura de banco, mas com permissões e visualizações diferentes.
- Compartilhe componentes e estilos entre plataformas sempre que possível.

## Referências
- Veja os arquivos markdown para regras de negócio, banco e contexto. 
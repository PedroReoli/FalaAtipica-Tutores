# Estrutura do Banco de Dados - FalaAtípica

Este documento descreve a modelagem do banco de dados para o ecossistema FalaAtípica, visando compatibilidade com Supabase e PostgreSQL local.

## Objetivos
- Permitir fácil migração entre Supabase e PostgreSQL local.
- Atender às regras de negócio das três plataformas (Tutores, Kids, Plataforma Web).
- Garantir segurança, escalabilidade e flexibilidade.

## Entidades Principais
- **usuarios**: Tutores, profissionais, responsáveis.
- **criancas**: Crianças vinculadas a um ou mais tutores.
- **imagens_sons**: Conteúdos personalizados (imagens, sons, categorias).
- **progresso**: Registro de interações, tempo de uso, badges.
- **instituicoes**: (Plataforma Web) Escolas, clínicas, etc.
- **vinculos**: Relação entre usuários, crianças e instituições.

## Relacionamentos
- Um usuário pode ter várias crianças vinculadas.
- Uma criança pode estar vinculada a mais de um tutor (ex: pais separados).
- Instituições podem gerenciar múltiplos usuários e crianças.

## Observações
- Scripts SQL estarão na pasta `/sql`.
- Sempre alinhar mudanças de estrutura com as regras de negócio descritas em `regras-negocio.md`.

---

> Atualize este documento conforme a modelagem evoluir ou novas necessidades surgirem. 
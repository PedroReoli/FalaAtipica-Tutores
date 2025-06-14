# Guia para Plataforma Web (Profissionais)

Este documento orienta o desenvolvimento do painel web do FalaAtípica para profissionais de saúde e educação.

## Objetivo
- Monitorar uso terapêutico, avaliar progresso e apoiar intervenções clínicas.
- Gerar relatórios, gráficos e históricos de uso.

## Regras de Negócio
- Acesso restrito a profissionais validados.
- Vínculo com criança só com consentimento do tutor.
- Profissional só visualiza/exporta dados, nunca edita.
- Auditoria de acessos/exportações (LGPD).

## Telas Principais
- **Dashboard:** Visão geral do progresso das crianças vinculadas.
- **Filtros:** Por período, categoria, criança.
- **Histórico de Interações:** Sessão por sessão, tipo de estímulo.
- **Relatórios:** Exportação PDF/CSV, gráficos comparativos.
- **Personalização:** Visualizar conteúdos customizados pelos tutores.
- **Alertas:** Notificações automáticas de padrões de uso.

## Integração
- Consome dados do Supabase (leitura avançada, relatórios).
- Integração com sistema de autenticação profissional.

## Diferenciais
- Painel visual, fácil de usar, focado em dados relevantes para intervenção clínica.
- Apoio à comunicação entre profissionais, tutores e escolas.

## Referências
- Veja `markdown/regras-negocio.md` para detalhes de regras e fluxos. 
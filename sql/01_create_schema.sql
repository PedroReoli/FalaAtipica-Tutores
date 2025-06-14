-- Script de criação do banco de dados FalaAtípica
-- Compatível com Supabase e PostgreSQL local

-- Tabela de usuários (tutores, profissionais, responsáveis)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- 'tutor', 'profissional', 'admin'
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de crianças
CREATE TABLE IF NOT EXISTS criancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    neuroatipicidade VARCHAR(100),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de vínculo entre usuários e crianças
CREATE TABLE IF NOT EXISTS vinculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
    papel VARCHAR(30) NOT NULL, -- 'responsavel', 'profissional', etc
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de instituições (para plataforma web)
CREATE TABLE IF NOT EXISTS instituicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50), -- 'escola', 'clinica', etc
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de vínculo entre usuários e instituições
CREATE TABLE IF NOT EXISTS usuarios_instituicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    instituicao_id UUID REFERENCES instituicoes(id) ON DELETE CASCADE,
    papel VARCHAR(30),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de imagens e sons personalizados
CREATE TABLE IF NOT EXISTS imagens_sons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- 'imagem', 'som'
    categoria VARCHAR(50),
    url TEXT NOT NULL,
    descricao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de progresso/interações
CREATE TABLE IF NOT EXISTS progresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
    data_registro TIMESTAMP DEFAULT NOW(),
    interacoes_totais INTEGER DEFAULT 0,
    dias_ativos INTEGER DEFAULT 0,
    tempo_medio_sessao INTERVAL,
    categoria_mais_usada VARCHAR(50),
    badges TEXT[],
    observacoes TEXT
);

-- Índices e constraints extras podem ser adicionados conforme necessidade.

-- Para dúvidas ou ajustes, consulte o arquivo markdown/estrutura-banco.md 
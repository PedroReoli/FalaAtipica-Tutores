-- Script de seed para o banco FalaAtípica
-- Popula o banco com dados de exemplo para testes

-- Usuários
INSERT INTO usuarios (id, nome, email, senha, tipo) VALUES
  (gen_random_uuid(), 'Maria Silva', 'maria@exemplo.com', 'senha123', 'tutor'),
  (gen_random_uuid(), 'João Souza', 'joao@exemplo.com', 'senha123', 'tutor'),
  (gen_random_uuid(), 'Dra. Ana Fono', 'ana@fono.com', 'senha123', 'profissional');

-- Crianças
INSERT INTO criancas (id, nome, neuroatipicidade, data_nascimento) VALUES
  (gen_random_uuid(), 'Lucas', 'Autismo', '2020-05-10'),
  (gen_random_uuid(), 'Sofia', 'Paralisia Cerebral', '2019-08-22');

-- Vínculos
-- (Assumindo que você vai ajustar os UUIDs conforme necessário)
-- Exemplo:
-- INSERT INTO vinculos (usuario_id, crianca_id, papel) VALUES ('<uuid_usuario>', '<uuid_crianca>', 'responsavel');

-- Instituições
INSERT INTO instituicoes (id, nome, tipo) VALUES
  (gen_random_uuid(), 'Clínica ABC', 'clinica'),
  (gen_random_uuid(), 'Escola Inclusiva', 'escola');

-- Imagens e Sons
INSERT INTO imagens_sons (id, crianca_id, tipo, categoria, url, descricao) VALUES
  (gen_random_uuid(), NULL, 'imagem', 'Comidas', 'https://exemplo.com/banana.png', 'Banana'),
  (gen_random_uuid(), NULL, 'som', 'Comidas', 'https://exemplo.com/banana.mp3', 'Som da palavra Banana');

-- Progresso
INSERT INTO progresso (id, crianca_id, interacoes_totais, dias_ativos, tempo_medio_sessao, categoria_mais_usada, badges, observacoes) VALUES
  (gen_random_uuid(), NULL, 15, 7, INTERVAL '00:10:00', 'Comidas', ARRAY['Primeiro Clique', 'Explorador de Sons'], 'Ótimo progresso inicial!');

-- Ajuste os campos NULL para os UUIDs reais das crianças após rodar os inserts iniciais. 
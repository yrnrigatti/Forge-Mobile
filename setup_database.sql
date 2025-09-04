-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Sistema de Treinos - Forge V2
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELAS PRINCIPAIS
-- =====================================================

-- Tabela principal de usuários (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(50) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height INTEGER, -- em cm
  weight DECIMAL(5,2), -- em kg
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[], -- array de strings
  preferences JSONB DEFAULT '{}'
);

-- Perfis de usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  website TEXT,
  social_links JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Estatísticas do usuário
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_workouts INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- em minutos
  total_volume DECIMAL(10,2) DEFAULT 0, -- peso total levantado
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  workouts_this_week INTEGER DEFAULT 0,
  workouts_this_month INTEGER DEFAULT 0,
  workouts_this_year INTEGER DEFAULT 0,
  favorite_exercises JSONB DEFAULT '[]',
  muscle_group_distribution JSONB DEFAULT '[]',
  personal_records JSONB DEFAULT '[]',
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Conquistas do usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 100,
  is_completed BOOLEAN DEFAULT false
);

-- Metas do usuário
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50),
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- Seguidores/Seguindo
CREATE TABLE IF NOT EXISTS public.user_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Atividades do usuário
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABELAS DE EXERCÍCIOS E TREINOS
-- =====================================================

-- Exercícios
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_group VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[],
  tips TEXT[],
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Treinos
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  notes TEXT,
  total_volume DECIMAL(10,2) DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercícios do treino
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  rest_time INTEGER, -- em segundos
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Índices para workouts
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON public.workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, date);

-- Índices para workout_exercises
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);

-- Índices para exercises
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active);

-- Índices para user_stats
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- Índices para user_followers
CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON public.user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following ON public.user_followers(following_id);

-- =====================================================
-- 4. TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
-- exercises é público para leitura

-- =====================================================
-- 6. POLÍTICAS RLS
-- =====================================================

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para user_profiles
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage achievements" ON public.user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_followers
CREATE POLICY "Users can view followers" ON public.user_followers
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can manage own follows" ON public.user_followers
    FOR ALL USING (auth.uid() = follower_id);

-- Políticas para user_activities
CREATE POLICY "Users can view own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para workouts
CREATE POLICY "Users can manage own workouts" ON public.workouts
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para workout_exercises
CREATE POLICY "Users can manage own workout exercises" ON public.workout_exercises
    FOR ALL USING (
        auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
    );

-- Exercises são públicos para leitura
CREATE POLICY "Anyone can view exercises" ON public.exercises
    FOR SELECT USING (is_active = true);

-- =====================================================
-- 7. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar estatísticas após treino
CREATE OR REPLACE FUNCTION public.update_user_stats_after_workout()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estatísticas do usuário
    UPDATE public.user_stats
    SET 
        total_workouts = total_workouts + 1,
        total_duration = total_duration + NEW.duration,
        total_volume = total_volume + NEW.total_volume,
        workouts_this_week = workouts_this_week + 1,
        workouts_this_month = workouts_this_month + 1,
        workouts_this_year = workouts_this_year + 1,
        last_calculated = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar stats após workout
CREATE TRIGGER on_workout_created
    AFTER INSERT ON public.workouts
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_after_workout();

-- =====================================================
-- 8. DADOS INICIAIS (EXERCÍCIOS BÁSICOS)
-- =====================================================

-- Inserir exercícios básicos
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty_level, instructions) VALUES
('Supino Reto', 'Exercício fundamental para peitorais', 'Peito', 'Barra', 'intermediate', ARRAY['Deite no banco', 'Segure a barra', 'Desça controladamente', 'Empurre para cima']),
('Agachamento', 'Exercício básico para pernas', 'Pernas', 'Peso Corporal', 'beginner', ARRAY['Pés na largura dos ombros', 'Desça como se fosse sentar', 'Mantenha o peito ereto', 'Suba controladamente']),
('Levantamento Terra', 'Exercício composto para corpo todo', 'Costas', 'Barra', 'advanced', ARRAY['Pés na largura dos quadris', 'Segure a barra', 'Mantenha as costas retas', 'Levante com as pernas']),
('Flexão de Braço', 'Exercício básico para peito e tríceps', 'Peito', 'Peso Corporal', 'beginner', ARRAY['Posição de prancha', 'Mãos na largura dos ombros', 'Desça o peito', 'Empurre para cima']),
('Barra Fixa', 'Exercício para costas e bíceps', 'Costas', 'Barra Fixa', 'intermediate', ARRAY['Segure a barra', 'Puxe o corpo para cima', 'Queixo acima da barra', 'Desça controladamente']),
('Desenvolvimento', 'Exercício para ombros', 'Ombros', 'Halteres', 'intermediate', ARRAY['Segure os halteres', 'Empurre para cima', 'Braços totalmente estendidos', 'Desça controladamente']),
('Rosca Direta', 'Exercício para bíceps', 'Bíceps', 'Halteres', 'beginner', ARRAY['Braços ao lado do corpo', 'Flexione os cotovelos', 'Contraia os bíceps', 'Desça controladamente']),
('Tríceps Testa', 'Exercício para tríceps', 'Tríceps', 'Halteres', 'intermediate', ARRAY['Deite no banco', 'Braços estendidos', 'Flexione apenas os cotovelos', 'Estenda os braços'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
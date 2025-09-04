# Análise do Banco de Dados - Sistema de Autenticação

## Status Atual do Banco de Dados

### ✅ **Estrutura de Autenticação (Completa)**

O Supabase já possui toda a infraestrutura necessária para autenticação no schema `auth`:

- **`auth.users`** - Tabela principal de usuários com todos os campos necessários:
  - `id` (UUID) - Chave primária
  - `email` - Email do usuário
  - `encrypted_password` - Senha criptografada
  - `email_confirmed_at` - Confirmação de email
  - `created_at` / `updated_at` - Timestamps
  - `raw_user_meta_data` - Metadados personalizados (JSONB)
  - `phone` - Telefone (opcional)
  - `is_active` - Status ativo/inativo

- **`auth.sessions`** - Gerenciamento de sessões
- **`auth.refresh_tokens`** - Tokens de renovação
- **`auth.identities`** - Identidades para SSO
- **`auth.mfa_factors`** - Autenticação multifator

### ❌ **Schema Public (Vazio)**

O schema `public` está completamente vazio. Precisamos criar as tabelas complementares para:
- Perfis de usuário estendidos
- Exercícios
- Treinos
- Estatísticas

## Estrutura Necessária para a Aplicação

### 1. **Tabelas de Usuário Complementares**

Baseado nos tipos TypeScript definidos em `src/types/user.ts`, precisamos criar:

```sql
-- Tabela principal de usuários (complementa auth.users)
CREATE TABLE public.users (
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
CREATE TABLE public.user_profiles (
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
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_workouts INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2) DEFAULT 0,
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
```

### 2. **Tabelas de Exercícios e Treinos**

```sql
-- Exercícios
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_group VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treinos
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercícios do treino
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  rest_time INTEGER, -- em segundos
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. **Políticas de Segurança (RLS)**

Todas as tabelas precisam de Row Level Security habilitado:

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id);
```

## Recomendações de Segurança

### ⚠️ **Aviso de Segurança Identificado**

O sistema detectou que o **OTP (One-Time Password) tem expiração muito longa** (mais de 1 hora). 

**Recomendação:** Configurar a expiração do OTP para menos de 1 hora nas configurações de autenticação do Supabase.

### 🔒 **Configurações de Segurança Recomendadas**

1. **Configurar RLS em todas as tabelas**
2. **Implementar políticas granulares de acesso**
3. **Configurar confirmação de email obrigatória**
4. **Implementar rate limiting para login**
5. **Configurar MFA para usuários administrativos**

## Próximos Passos

### 1. **Criar as Tabelas**
```bash
# Usar o Supabase CLI para aplicar migrações
supabase migration new create_user_tables
# Adicionar o SQL das tabelas ao arquivo de migração
supabase db push
```

### 2. **Configurar Políticas RLS**
```bash
supabase migration new setup_rls_policies
# Adicionar políticas de segurança
supabase db push
```

### 3. **Popular Dados Iniciais**
```bash
supabase migration new seed_initial_data
# Adicionar exercícios básicos e configurações
supabase db push
```

### 4. **Atualizar Tipos TypeScript**
```bash
supabase gen types typescript --local > src/types/database.ts
```

## Conclusão

✅ **O que está funcionando:**
- Sistema de autenticação completo (Supabase Auth)
- Infraestrutura de sessões e tokens
- Suporte a MFA e SSO

❌ **O que precisa ser implementado:**
- Tabelas do schema public
- Políticas de segurança (RLS)
- Dados iniciais (exercícios)
- Configuração de OTP mais segura

**Status geral:** O banco está **parcialmente configurado**. A autenticação funciona, mas faltam as tabelas de negócio da aplicação.
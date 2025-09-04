# 🔥 Forge

O **Forge** é um aplicativo de registro e acompanhamento de treinos, desenvolvido em **React Native** com **Supabase** como backend.  
O app traz uma interface única inspirada no tema **forja**: treinar é forjar o corpo, repetição após repetição, até moldar a melhor versão de si mesmo.  

---

## 🚀 Visão Geral
O Forge permite que usuários:
- Registrem treinos de forma rápida e simples.
- Acompanhem sua evolução em gráficos claros e objetivos.
- Criem e salvem rotinas personalizadas de exercícios.
- Mantenham consistência com dashboards de frequência e progresso.
- Utilizem o app **mesmo sem internet** (offline first).

---

## 🛠️ Tech Stack
- **Frontend:** React Native (NativeWind/Tailwind para estilização, React Navigation para navegação).
- **Backend:** Supabase (Auth, Database, Storage, Realtime).
- **Banco Local:** SQLite ou WatermelonDB (para suporte offline first).
- **Gráficos:** Victory Native ou React Native Chart Kit.
- **Armazenamento:** Supabase Storage (para fotos de evolução, se necessário).

---

## 📐 System Design

### Arquitetura
- **Client:** App em React Native consumindo a API do Supabase.
- **API/Data Layer:** Supabase (Postgres + Realtime + Auth).
- **State Management:** Context API ou Zustand (para estados globais como usuário e treinos).
- **Offline First:** Banco local (SQLite/WatermelonDB) como fonte primária de dados.
- **Deployment:** Publicação nas lojas (Play Store / App Store).

### Modelagem de Dados (simplificada)
- **users** → dados do usuário.
- **exercises** → catálogo de exercícios do usuário.
- **workouts** → cada sessão de treino registrada.
- **workout_exercises** → exercícios dentro de um treino, incluindo séries, reps, peso.

---

## 📡 Offline First & Autenticação

### Como funciona
1. **Primeiro login (online):**
   - Usuário entra com e-mail/senha (ou OAuth).
   - Supabase gera **access token** e **refresh token**.
   - Tokens são salvos localmente (via SecureStore/Keychain/EncryptedStorage).

2. **Uso offline:**
   - O app consulta os tokens armazenados e mantém a sessão válida localmente.
   - Treinos são gravados no banco local (SQLite/WatermelonDB).
   - Usuário continua logado e com acesso total aos dados já baixados.

3. **Quando a conexão volta:**
   - O app sincroniza os treinos feitos offline com o Supabase.
   - Caso o token esteja expirado, usa o **refresh token** para renovação automática.
   - Conflitos de dados são resolvidos com a estratégia **"última alteração vence"** (ou outra definida futuramente).

### Impactos
- O login inicial exige internet.  
- A sessão é **persistida localmente** para funcionar offline.  
- Tokens precisam ser armazenados com segurança.  
- Sincronização periódica garante que os dados locais e remotos se mantenham consistentes.  

---

## 🎨 Design System — Tema Forja

### Cores
- **Preto / Cinza Aço** `#1A1A1A` / `#2C2C2C` → fundo principal, remetendo ao aço bruto.  
- **Laranja Brasa** `#FF6B00` → destaques, botões principais (como o fogo da forja).  
- **Vermelho Incandescente** `#E63946` → alertas, métricas críticas (como sobrecarga).  
- **Cinza Metalizado** `#B0B0B0` → tipografia secundária, bordas, ícones.  
- **Branco Suave** `#F5F5F5` → contraste para texto em fundos escuros.  

### Tipografia
- Fonte robusta e moderna, estilo **Sans Serif condensada** (ex.: *Montserrat*, *Oswald*).  
- Títulos fortes (lembrando estampas em aço).  
- Texto leve em cinza metalizado para secundário.

### Estilo
- **Dark mode first** (a forja é escura, iluminada pelo fogo).  
- Botões arredondados com leve **glow laranja/brasa**.  
- Ícones minimalistas com sensação metálica.  
- Gráficos com linhas **incandescentes** sobre fundo preto.  

---

## 📊 Dashboard Inicial
- **Frequência de Treinos:** gráfico de barras semanais.  
- **Evolução de Carga:** linha mostrando progressão de peso em um exercício.  
- **Volume Total:** peso × reps × séries, acumulado no tempo.  
- **Resumo Mensal:** “🔥 Você forjou 15 treinos este mês, +20% do que em julho.”  

---

## 🌟 Futuras Expansões
- Gamificação: conquistas e streaks.  
- Integração com Google Fit / Apple Health.  
- Registro de nutrição.  
- Comunidade (seguir amigos e compartilhar evolução).  

---

## 📌 Status
🚧 Em desenvolvimento — versão inicial será focada em registro de treinos + dashboard básico.

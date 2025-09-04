# Testes E2E - Forge v2

## Estratégia Test-Driven Development (TDD)

Este projeto utiliza a metodologia TDD para desenvolvimento das telas, especialmente a **Tela de Cadastro**. Os testes são escritos primeiro, definindo os requisitos funcionais, e depois a implementação é feita para passar nos testes.

## Estrutura dos Testes

### Tela de Cadastro (`register-screen.spec.ts`)

Os testes definem os seguintes requisitos funcionais:

#### 📋 Campos Obrigatórios
- **Nome completo**: Campo de texto obrigatório
- **Email**: Campo de email com validação de formato
- **Senha**: Campo de senha com indicador de força
- **Confirmar senha**: Campo para confirmação da senha

#### ✅ Validações Implementadas
1. **Validação de campos obrigatórios**
   - Nome não pode estar vazio
   - Email deve ter formato válido
   - Senha deve atender critérios mínimos
   - Confirmação de senha deve coincidir

2. **Validação de força da senha**
   - Indicador visual de força (Fraca/Média/Forte)
   - Critérios: mínimo 8 caracteres, letras, números e símbolos

3. **Feedback visual**
   - Mensagens de erro específicas para cada campo
   - Loading state durante o cadastro
   - Mensagens de sucesso/erro do servidor

#### 🎯 Funcionalidades UX
- **Toggle de visibilidade da senha**
- **Navegação por teclado (acessibilidade)**
- **Design responsivo** (mobile, tablet, desktop)
- **Link para voltar ao login**

#### 🔄 Integração com Backend
- **Cadastro bem-sucedido**: Redirecionamento ou mensagem de sucesso
- **Email já cadastrado**: Tratamento de erro específico
- **Erros de rede**: Feedback apropriado ao usuário

## Data Test IDs Necessários

Para que os testes funcionem, a implementação deve incluir os seguintes `data-testid`:

```typescript
// Campos do formulário
'name-input'              // Input do nome
'email-input'             // Input do email
'password-input'          // Input da senha
'confirm-password-input'  // Input de confirmação
'register-button'         // Botão de cadastro

// Mensagens de erro
'name-error'              // Erro do campo nome
'email-error'             // Erro do campo email
'password-error'          // Erro do campo senha
'confirm-password-error'  // Erro da confirmação
'error-message'           // Erro geral do servidor

// Elementos de feedback
'password-strength'       // Indicador de força da senha
'loading-spinner'         // Spinner de loading
'success-message'         // Mensagem de sucesso

// Navegação
'register-link'           // Link para ir ao cadastro (na tela de login)
'login-link'              // Link para voltar ao login
'toggle-password-visibility' // Botão para mostrar/ocultar senha

// Containers
'register-form'           // Container do formulário
```

## Como Executar os Testes

### Pré-requisitos
```bash
# Instalar dependências do Playwright
npm install @playwright/test
npx playwright install
```

### Comandos de Teste

```bash
# Executar todos os testes
npx playwright test

# Executar apenas testes da tela de cadastro
npx playwright test register-screen

# Executar testes em modo debug
npx playwright test --debug

# Executar testes com interface gráfica
npx playwright test --ui

# Gerar relatório HTML
npx playwright show-report
```

### Executar Testes em Diferentes Navegadores

```bash
# Apenas Chrome
npx playwright test --project=chromium

# Apenas Firefox
npx playwright test --project=firefox

# Apenas Safari
npx playwright test --project=webkit

# Mobile
npx playwright test --project="Mobile Chrome"
```

## Fluxo de Desenvolvimento TDD

1. **🔴 Red**: Execute os testes - eles devem falhar inicialmente
   ```bash
   npx playwright test register-screen
   ```

2. **🟢 Green**: Implemente o mínimo necessário para os testes passarem
   - Crie a tela de cadastro com os elementos necessários
   - Adicione os `data-testid` corretos
   - Implemente as validações básicas

3. **🔵 Refactor**: Melhore o código mantendo os testes passando
   - Otimize a performance
   - Melhore a UX
   - Refatore componentes

## Estrutura de Arquivos Esperada

```
src/
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx
│       └── RegisterScreen.tsx    # ← Implementar baseado nos testes
├── components/
│   └── auth/
│       ├── RegisterForm.tsx      # ← Componente do formulário
│       ├── PasswordStrength.tsx  # ← Indicador de força
│       └── ValidationMessage.tsx # ← Mensagens de erro
└── hooks/
    └── useRegister.ts           # ← Hook para lógica de cadastro
```

## Próximos Passos

1. **Implementar a RegisterScreen** seguindo os requisitos dos testes
2. **Executar os testes** para verificar conformidade
3. **Iterar** até todos os testes passarem
4. **Adicionar testes** para casos edge específicos do negócio
5. **Integrar** com o sistema de autenticação real

---

> 💡 **Dica**: Use `npx playwright test --ui` para uma experiência visual durante o desenvolvimento!
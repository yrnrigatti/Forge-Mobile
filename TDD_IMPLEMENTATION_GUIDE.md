# 🚀 Guia de Implementação TDD - Forge v2

## 📋 Resumo do Setup

✅ **Playwright configurado** com testes para tela de cadastro  
✅ **Scripts npm** adicionados para execução dos testes  
✅ **Arquivos de exemplo** criados como referência  
✅ **Documentação completa** dos requisitos funcionais  

## 🎯 Próximos Passos para Implementação

### 1. 🔴 **RED Phase** - Execute os Testes (Devem Falhar)

```bash
# Executar testes da tela de cadastro
npm run test:register

# Ou executar todos os testes
npm test

# Para interface visual
npm run test:ui
```

**Resultado esperado**: Todos os testes devem falhar porque as telas ainda não existem.

### 2. 🟢 **GREEN Phase** - Implementar o Mínimo Necessário

#### A. Criar estrutura de pastas
```
src/
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx
│       └── RegisterScreen.tsx
└── components/
    └── auth/
        ├── RegisterForm.tsx
        ├── PasswordStrength.tsx
        └── ValidationMessage.tsx
```

#### B. Implementar RegisterScreen.tsx

1. **Copie o arquivo de exemplo**:
   ```bash
   # Renomeie o arquivo de exemplo
   cp src/screens/auth/RegisterScreen.example.tsx src/screens/auth/RegisterScreen.tsx
   ```

2. **Ajuste as importações** conforme sua estrutura de navegação

3. **Execute os testes** para verificar quais passam:
   ```bash
   npm run test:register
   ```

#### C. Implementar LoginScreen.tsx (para o link de navegação)

1. **Copie o arquivo de exemplo**:
   ```bash
   cp src/screens/auth/LoginScreen.example.tsx src/screens/auth/LoginScreen.tsx
   ```

2. **Configure a navegação** entre Login e Register

### 3. 🔵 **REFACTOR Phase** - Melhorar o Código

Após os testes passarem, você pode:

- **Extrair componentes** reutilizáveis
- **Melhorar a estilização** com NativeWind
- **Adicionar animações** e transições
- **Otimizar performance** com React.memo
- **Integrar com Supabase** para autenticação real

## 📊 Status dos Testes

### Testes Implementados ✅

#### 🔧 **Requisitos Funcionais**
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de email
- ✅ Validação de força da senha
- ✅ Confirmação de senha
- ✅ Loading state durante cadastro
- ✅ Tratamento de erro de email já cadastrado
- ✅ Toggle de visibilidade da senha
- ✅ Link para voltar ao login

#### ♿ **Acessibilidade**
- ✅ Labels apropriados para todos os campos
- ✅ Navegação por teclado

#### 📱 **Responsividade**
- ✅ Funcionamento em dispositivos móveis
- ✅ Funcionamento em tablets

## 🎨 Data Test IDs Obrigatórios

Para os testes passarem, certifique-se de incluir estes `testID`:

```typescript
// Campos do formulário
'name-input'
'email-input'
'password-input'
'confirm-password-input'
'register-button'

// Mensagens de erro
'name-error'
'email-error'
'password-error'
'confirm-password-error'
'error-message'

// Elementos de feedback
'password-strength'
'loading-spinner'
'success-message'

// Navegação
'register-link'  // Na tela de login
'login-link'     // Na tela de cadastro
'toggle-password-visibility'

// Containers
'register-form'
```

## 🚀 Comandos Úteis

```bash
# Executar apenas testes de cadastro
npm run test:register

# Executar testes com interface visual
npm run test:ui

# Executar testes em modo debug
npm run test:debug

# Gerar relatório HTML
npm run test:report

# Executar todos os testes
npm test
```

## 🔄 Fluxo de Desenvolvimento Recomendado

1. **Execute os testes** → Veja quais falham
2. **Implemente o mínimo** → Para fazer 1 teste passar
3. **Execute novamente** → Confirme que passou
4. **Repita** para o próximo teste
5. **Refatore** quando todos passarem

## 📁 Arquivos de Referência

- `src/screens/auth/RegisterScreen.example.tsx` - Implementação completa da tela de cadastro
- `src/screens/auth/LoginScreen.example.tsx` - Implementação da tela de login com link para cadastro
- `tests/register-screen.spec.ts` - Todos os testes da tela de cadastro
- `tests/README.md` - Documentação detalhada dos testes
- `playwright.config.ts` - Configuração do Playwright

## 🎯 Meta Final

Quando todos os testes estiverem passando, você terá:

✅ Uma tela de cadastro totalmente funcional  
✅ Validações robustas de formulário  
✅ Feedback visual apropriado  
✅ Acessibilidade implementada  
✅ Design responsivo  
✅ Integração pronta para backend  

---

> 💡 **Dica**: Use `npm run test:ui` para uma experiência visual durante o desenvolvimento. Você pode ver os testes executando em tempo real!

> 🔥 **Próximo nível**: Após implementar a tela de cadastro, considere criar testes similares para outras telas do sistema seguindo a mesma metodologia TDD.
# 📚 Guia de Boas Práticas - Trae AI

## 🎯 Visão Geral
Este documento contém as melhores práticas para uso do Trae AI em nossa equipe, visando maximizar a produtividade e manter a qualidade do código.

## 🚀 Configuração Inicial

### 1. Configuração do Workspace
- Sempre abra o projeto na pasta raiz
- Mantenha a estrutura de pastas organizada
- Use nomes descritivos para arquivos e pastas

### 2. Configuração de Ferramentas
- **Supabase Architect**: Agente especializado com MCP do Supabase configurado para operações de banco de dados
- **Web Testing Helper**: Agente especializado com MCP do Playwright configurado para testes automatizados

## 💡 Práticas de Desenvolvimento

### 1. Comunicação com o Trae

#### ✅ Faça:
- **Seja específico nas suas solicitações**: Se você identificou 3 erros, peça para corrigir apenas 1 por vez
- **Forneça contexto completo**: Mesmo que o Trae possa encontrar o contexto, as respostas são sempre melhores quando você fornece informações específicas
- **Uma tarefa por mensagem**: Foque em um problema específico por solicitação
- **Inclua detalhes relevantes**: Arquivos afetados, linha do erro, comportamento esperado vs atual
- Use exemplos quando necessário
- Mencione arquivos específicos quando relevante

#### 📝 Exemplos de Solicitações Eficazes:

**❌ Ruim:**
```
"Arrume os erros no meu código"
```

**✅ Bom:**
```
"No arquivo src/components/LoginForm.tsx, linha 45, 
o estado 'email' não está sendo validado corretamente. 
Quando o usuário digita um email inválido, 
deveria mostrar uma mensagem de erro mas não está aparecendo."
```

**❌ Ruim:**
```
"Tem 3 bugs no login, no cadastro e no dashboard, arruma tudo"
```

**✅ Bom:**
```
"No componente LoginForm (src/screens/auth/LoginScreen.tsx), 
quando clico no botão 'Entrar' com campos vazios, 
deveria mostrar validação mas está permitindo o submit. 
O hook useAuth está retornando isLoading como false mesmo durante a requisição."
```

#### ❌ Evite:
- Solicitações muito vagas ("arrume isso")
- Múltiplas tarefas não relacionadas em uma única mensagem
- Assumir que o Trae conhece mudanças não documentadas
- Pedir para "corrigir todos os erros" sem especificar qual priorizar

### 2. Uso Consciente de Agentes MCP

#### 🎯 Quando Usar Agentes Especializados:
- **Supabase Architect**: Agente com MCP do Supabase configurado - apenas para operações específicas de banco de dados (migrations, schemas, queries complexas)
- **Web Testing Helper**: Agente com MCP do Playwright configurado - somente para criação e execução de testes automatizados
- **Outros MCPs**: Apenas quando a funcionalidade específica é realmente necessária

#### ⚠️ Problema do "Martelo e Prego":
Quando o Trae tem muitas ferramentas disponíveis, ele pode tentar usá-las desnecessariamente, mesmo para tarefas simples que poderiam ser resolvidas de forma mais direta. Isso pode:
- Diminuir a qualidade das respostas
- Aumentar o tempo de processamento
- Complicar soluções simples
- Gerar overhead desnecessário

#### 📝 Diretrizes para Uso de MCPs:

**✅ Use MCPs quando:**
```
"Preciso criar uma migration no Supabase para adicionar uma nova tabela"
→ Usar Supabase Architect

"Quero criar um teste E2E para o fluxo de login"
→ Usar Web Testing Helper
```

**❌ NÃO use MCPs quando:**
```
"Como faço para adicionar um console.log no meu código?"
→ Resposta direta, sem necessidade de agentes

"Explique como funciona o useState do React"
→ Explicação conceitual, sem necessidade de ferramentas
```

#### 💡 Dica de Comunicação:
Seja explícito sobre quando você quer ou não usar ferramentas específicas:
- "Use o Supabase Architect para..."
- "Apenas explique como fazer, sem usar ferramentas"
- "Implemente diretamente no código, sem MCPs"

## 🧪 Testes

### 3. Estratégia de Testes
- **Unitários**: Para funções e hooks
- **Integração**: Para fluxos completos
- **E2E**: Para cenários críticos do usuário

### 4. Playwright (Web Testing Helper - Agente MCP)
```typescript
// Exemplo de teste bem estruturado
test('deve realizar login com sucesso', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 5. Boas Práticas de Teste
- Use `data-testid` para seletores estáveis
- Teste comportamentos, não implementação
- Mantenha testes independentes
- Use Page Object Model para testes complexos

## 🗄️ Banco de Dados

### 6. Supabase (Supabase Architect - Agente MCP)
- Use migrations para mudanças no schema
- Implemente RLS (Row Level Security)
- Mantenha backups regulares
- Use índices apropriados

### 7. Modelos WatermelonDB
```typescript
// Exemplo de modelo bem estruturado
@model('exercises')
export class Exercise extends Model {
  static table = 'exercises';
  
  @field('name') name!: string;
  @field('muscle_group') muscleGroup!: string;
  @field('equipment') equipment?: string;
  @date('created_at') createdAt!: Date;
}
```

## 🔧 Ferramentas e Comandos Úteis

### 8. Comandos Frequentes
```bash
# Desenvolvimento
npm start                 # Inicia o servidor de desenvolvimento
npm run test             # Executa testes
npm run build            # Build para produção

# Testes
npx playwright test      # Executa testes E2E
npx playwright test --ui # Interface gráfica dos testes
```

### 9. Debugging
- Use breakpoints no VS Code
- Utilize React DevTools
- Configure logs estruturados
- Use Flipper para debugging React Native

### 10. Verificação Contínua de Tipos TypeScript

#### 🎯 Objetivo:
Executar `npx tsc --noEmit` constantemente para detectar erros de tipos antes que se tornem problemas de build.

#### 📋 Configurações Recomendadas:

**VS Code (Configuração do Workspace):**
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.validate.enable": true,
  "typescript.check.npmIsInstalled": true,
  "files.watcherExclude": {
    "**/node_modules/**": true
  }
}
```

**Scripts no package.json:**
```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "dev": "npm run type-check && expo start",
    "build": "npm run type-check && expo build"
  }
}
```

#### 🔄 Estratégias de Execução:

1. **Manual (Recomendado para início):**
   ```bash
   npm run type-check
   ```

2. **Watch Mode (Durante desenvolvimento):**
   ```bash
   npm run type-check:watch
   ```

3. **Pre-commit Hook (Git):**
   ```json
   // package.json
   {
     "husky": {
       "hooks": {
         "pre-commit": "npm run type-check && lint-staged"
       }
     }
   }
   ```

4. **Integração com CI/CD:**
   ```yaml
   # .github/workflows/ci.yml
   - name: Type Check
     run: npm run type-check
   ```

#### 💡 Dicas para o Trae:

**✅ Solicite verificação após mudanças grandes:**
```
"Acabei de refatorar os tipos de usuário. 
Pode rodar 'npm run type-check' para verificar se não quebrou nada?"
```

**✅ Inclua na rotina de desenvolvimento:**
```
"Antes de fazer o commit, rode a verificação de tipos 
e me avise se encontrar algum erro."
```

**✅ Configure alertas automáticos:**
- Execute `type-check` após grandes refatorações
- Inclua na pipeline de build
- Use como parte do processo de code review

#### ⚠️ Problemas Comuns:

- **Imports incorretos**: Verificar caminhos relativos
- **Tipos ausentes**: Instalar `@types/` necessários
- **Configuração tsconfig.json**: Validar paths e includes
- **Dependências desatualizadas**: Manter tipos sincronizados

### 11. Estratégia de Criação de Testes Automatizados

#### 🎯 Regra Fundamental:
**NUNCA criar testes antes da tela estar 100% finalizada**

#### 📋 Processo Recomendado:

1. **Desenvolvimento Completo da Tela**
   - Implementar toda a funcionalidade
   - Finalizar validações e tratamento de erros
   - Testar manualmente todos os cenários
   - Confirmar que a tela está estável

2. **Criação de Testes (Uma Tela por Vez)**
   - Focar em apenas uma tela por sessão
   - Documentar todos os cenários de teste
   - Implementar testes de forma sequencial
   - Validar cada teste individualmente

#### ✅ Boas Práticas:

**Quando Criar Testes:**
```
"A tela de LoginScreen está 100% finalizada, 
incluindo validações, tratamento de erros e navegação. 
Agora vou criar os testes automatizados para ela."
```

**Especificidade por Tela:**
```
"Vou criar testes apenas para a RegisterScreen. 
Não inclua testes de outras telas nesta sessão."
```

**Documentação Prévia:**
```
"Antes de criar os testes, liste todos os cenários 
que precisam ser testados na tela de DashboardScreen."
```

#### ❌ Evite:

**Testes Prematuros:**
```
❌ "Crie testes para a tela que estou desenvolvendo"
✅ "A tela está finalizada, agora crie os testes"
```

**Múltiplas Telas:**
```
❌ "Crie testes para Login, Register e Dashboard"
✅ "Crie testes apenas para a tela de Login"
```

**Testes Genéricos:**
```
❌ "Crie testes básicos para a aplicação"
✅ "Crie testes específicos para o fluxo de autenticação da LoginScreen"
```

#### 🔄 Fluxo de Trabalho:

1. **Finalizar Tela** → Implementação 100% completa
2. **Validar Manualmente** → Testar todos os cenários
3. **Documentar Cenários** → Listar casos de teste
4. **Criar Testes** → Uma tela por vez
5. **Executar e Validar** → Garantir que passam
6. **Próxima Tela** → Repetir o processo

#### 💡 Benefícios desta Abordagem:

- **Evita Retrabalho**: Testes não ficam defasados
- **Maior Precisão**: Testes refletem a implementação final
- **Foco**: Concentração em uma tela por vez
- **Qualidade**: Testes mais robustos e confiáveis
- **Eficiência**: Menos tempo perdido com ajustes

#### 🎯 Comunicação com o Trae:

**Seja explícito sobre o status da tela:**
- "A tela X está finalizada e pronta para testes"
- "Preciso apenas de testes para a tela Y"
- "Não crie testes ainda, a tela ainda está em desenvolvimento"

### 12. Configuração de Pre-commit Hooks (Husky + ESLint)

#### 🎯 Objetivo:
**Garantir qualidade do código antes de cada commit**

#### 📋 Configuração Necessária:

**1. Instalação das Dependências:**
```bash
npm install --save-dev husky lint-staged
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-unused-imports
```

**2. Configuração do Husky:**
```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**3. Configuração do package.json:**
```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .ts,.tsx --fix",
    "lint:check": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "tsc --noEmit"
    ]
  }
}
```

**4. Configuração do .eslintrc.js:**
```javascript
module.exports = {
  extends: [
    '@expo/eslint-config',
    '@typescript-eslint/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports'
  ],
  rules: {
    // Variáveis não usadas
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    
    // Importações não usadas
    'unused-imports/no-unused-vars': [
      'error',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'after-used',
        'argsIgnorePattern': '^_'
      }
    ],
    
    // Erros de tipagem
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error'
  }
};
```

#### ✅ Verificações Automáticas:

**O que é verificado antes de cada commit:**
- ❌ **Variáveis não usadas**: Bloqueia commit
- ❌ **Importações não usadas**: Bloqueia commit  
- ❌ **Erros de tipagem TypeScript**: Bloqueia commit
- ❌ **Problemas de formatação**: Bloqueia commit
- ❌ **Violações de regras ESLint**: Bloqueia commit

#### 🔄 Fluxo de Trabalho:

1. **Desenvolvedor faz commit**
2. **Husky intercepta o commit**
3. **lint-staged executa verificações**
4. **Se houver erros**: Commit é bloqueado
5. **Se tudo estiver ok**: Commit é permitido

#### 💡 Comandos Úteis:

**Verificar problemas manualmente:**
```bash
npm run lint:check          # Verificar sem corrigir
npm run lint                # Verificar e corrigir automaticamente
npm run type-check          # Verificar apenas tipagem
```

**Corrigir problemas específicos:**
```bash
# Remover importações não usadas
npx eslint src --ext .ts,.tsx --fix --rule 'unused-imports/no-unused-imports: error'

# Verificar apenas variáveis não usadas
npx eslint src --ext .ts,.tsx --rule '@typescript-eslint/no-unused-vars: error'
```

#### ⚠️ Problemas Comuns:

**Husky não funciona:**
```bash
# Reinstalar hooks
npx husky install
chmod +x .husky/pre-commit
```

**ESLint não encontra arquivos:**
```bash
# Verificar configuração do .eslintignore
echo "node_modules/" > .eslintignore
echo "dist/" >> .eslintignore
```

**Commit bloqueado incorretamente:**
```bash
# Pular verificação (usar com cuidado)
git commit --no-verify -m "mensagem"
```

#### 🎯 Comunicação com o Trae:

**Configuração inicial:**
```
"Configure o pre-commit hooks com Husky e ESLint 
para bloquear commits com variáveis não usadas, 
importações desnecessárias e erros de tipagem."
```

**Resolução de problemas:**
```
"O commit está sendo bloqueado por [erro específico]. 
Ajude a corrigir os problemas de lint/tipagem."
```

**Verificação manual:**
```
"Execute a verificação de lint e type-check 
antes de tentar fazer o commit."
```

## 13. Checklist de Code Review

### Antes de Submeter
- [ ] Código segue padrões de nomenclatura
- [ ] Testes passando
- [ ] Sem console.logs desnecessários
- [ ] Tipos TypeScript corretos
- [ ] Documentação atualizada

### Durante Review
- [ ] Lógica está clara e bem estruturada
- [ ] Performance adequada
- [ ] Segurança implementada
- [ ] Acessibilidade considerada
- [ ] Responsividade testada

## 🔧 Troubleshooting Comum

### 14. Problemas de Build
```bash
# Limpar cache
npm run clean
rm -rf node_modules
npm install
```

### 15. Problemas de Banco
- Verificar conexão com Supabase
- Validar migrations
- Checar permissões RLS

### 16. Problemas de Testes
- Verificar seletores atualizados
- Confirmar dados de teste
- Validar timeouts

## 📚 Recursos Adicionais

### Documentação
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [Supabase](https://supabase.com/docs)
- [Playwright](https://playwright.dev/docs/intro)
- [WatermelonDB](https://watermelondb.dev/docs)

### Ferramentas Recomendadas
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint
  - TypeScript Hero
  - Playwright Test for VSCode

## 🎯 Metas da Equipe

### Qualidade
- Manter cobertura de testes > 80%
- Zero bugs críticos em produção
- Code review em 100% dos PRs

### Performance
- Tempo de build < 2 minutos
- Testes E2E < 5 minutos
- App startup < 3 segundos

### Produtividade
- Deploy automatizado
- CI/CD configurado
- Documentação sempre atualizada

---

**Última atualização**: $(date)
**Versão**: 1.0
**Responsável**: Equipe de Desenvolvimento

> 💡 **Dica**: Mantenha este documento atualizado conforme a equipe evolui e novas práticas são adotadas!
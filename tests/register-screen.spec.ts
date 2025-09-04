import { test, expect } from '@playwright/test';

/**
 * Testes E2E para a Tela de Cadastro - 100% de Cobertura
 * 
 * Este arquivo contém todos os testes necessários para garantir
 * cobertura completa da funcionalidade da tela de cadastro.
 */

test.describe('Tela de Cadastro - RegisterScreen', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a tela de cadastro
    await page.goto('/');
    await page.getByTestId('register-link').click();
    await expect(page.getByRole('heading', { name: '🔥 Criar Conta' })).toBeVisible();
  });

  test.describe('Elementos da Interface', () => {
    test('deve exibir todos os elementos da tela', async ({ page }) => {
      // Verificar título e subtítulo
      await expect(page.getByRole('heading', { name: '🔥 Criar Conta' })).toBeVisible();
      await expect(page.getByText('Forje sua jornada')).toBeVisible();
      
      // Verificar formulário
      await expect(page.getByTestId('register-form')).toBeVisible();
      
      // Verificar campos de entrada
      await expect(page.getByTestId('name-input')).toBeVisible();
      await expect(page.getByTestId('register-email-input')).toBeVisible();
      await expect(page.getByTestId('register-password-input')).toBeVisible();
      await expect(page.getByTestId('confirm-password-input')).toBeVisible();
      
      // Verificar labels
      await expect(page.getByText('Nome Completo')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Senha')).toBeVisible();
      await expect(page.getByText('Confirmar Senha')).toBeVisible();
      
      // Verificar botão de cadastro
      await expect(page.getByTestId('register-button')).toBeVisible();
      await expect(page.getByTestId('register-button')).toHaveText('Cadastrar');
      
      // Verificar link para login
      await expect(page.getByText('Já tem uma conta?')).toBeVisible();
      await expect(page.getByTestId('login-link')).toBeVisible();
      await expect(page.getByTestId('login-link')).toHaveText('Fazer Login');
    });

    test('deve exibir placeholders corretos nos campos', async ({ page }) => {
      await expect(page.getByTestId('name-input')).toHaveAttribute('placeholder', 'Digite seu nome completo');
      await expect(page.getByTestId('register-email-input')).toHaveAttribute('placeholder', 'Digite seu email');
      await expect(page.getByTestId('register-password-input')).toHaveAttribute('placeholder', 'Digite sua senha');
      await expect(page.getByTestId('confirm-password-input')).toHaveAttribute('placeholder', 'Confirme sua senha');
    });
  });

  test.describe('Validação de Campos Obrigatórios', () => {
    test('deve exibir erro quando nome está vazio', async ({ page }) => {
      await page.getByTestId('register-button').click();
      await expect(page.getByTestId('name-error')).toBeVisible();
      await expect(page.getByTestId('name-error')).toHaveText('Nome é obrigatório');
    });

    test('deve exibir erro quando email está vazio', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-button').click();
      await expect(page.getByTestId('email-error')).toBeVisible();
      await expect(page.getByTestId('email-error')).toHaveText('Email é obrigatório');
    });

    test('deve exibir erro quando senha está vazia', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-button').click();
      await expect(page.getByTestId('password-error')).toBeVisible();
      await expect(page.getByTestId('password-error')).toHaveText('Senha é obrigatória');
    });

    test('deve exibir erro quando confirmação de senha está vazia', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('senha123456');
      await page.getByTestId('register-button').click();
      await expect(page.getByTestId('confirm-password-error')).toBeVisible();
      await expect(page.getByTestId('confirm-password-error')).toHaveText('Confirmação de senha é obrigatória');
    });

    test('deve exibir múltiplos erros quando vários campos estão vazios', async ({ page }) => {
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('name-error')).toBeVisible();
      await expect(page.getByTestId('email-error')).toBeVisible();
      await expect(page.getByTestId('password-error')).toBeVisible();
      await expect(page.getByTestId('confirm-password-error')).toBeVisible();
    });
  });

  test.describe('Validação de Formato', () => {
    test('deve exibir erro para email com formato inválido', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('email-invalido');
      await page.getByTestId('register-password-input').fill('senha123456');
      await page.getByTestId('confirm-password-input').fill('senha123456');
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('email-error')).toBeVisible();
      await expect(page.getByTestId('email-error')).toHaveText('Email deve ter um formato válido');
    });

    test('deve aceitar email com formato válido', async ({ page }) => {
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('email-error')).not.toBeVisible();
    });

    test('deve exibir erro para senha muito curta', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('123');
      await page.getByTestId('confirm-password-input').fill('123');
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('password-error')).toBeVisible();
      await expect(page.getByTestId('password-error')).toHaveText('Senha deve ter pelo menos 8 caracteres');
    });

    test('deve exibir erro quando senhas não coincidem', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('senha123456');
      await page.getByTestId('confirm-password-input').fill('senha654321');
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('confirm-password-error')).toBeVisible();
      await expect(page.getByTestId('confirm-password-error')).toHaveText('Senhas não coincidem');
    });
  });

  test.describe('Indicador de Força da Senha', () => {
    test('deve exibir indicador de força quando senha é digitada', async ({ page }) => {
      await page.getByTestId('register-password-input').fill('123');
      await expect(page.getByTestId('password-strength')).toBeVisible();
      await expect(page.getByText('Força da senha:')).toBeVisible();
    });

    test('deve mostrar senha fraca para senha simples', async ({ page }) => {
      await page.getByTestId('register-password-input').fill('123456');
      await expect(page.getByTestId('password-strength')).toContainText('Fraca');
    });

    test('deve mostrar senha média para senha com critérios parciais', async ({ page }) => {
      await page.getByTestId('register-password-input').fill('senha123');
      await expect(page.getByTestId('password-strength')).toContainText('Média');
    });

    test('deve mostrar senha forte para senha com todos os critérios', async ({ page }) => {
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await expect(page.getByTestId('password-strength')).toContainText('Forte');
    });

    test('não deve exibir indicador quando campo de senha está vazio', async ({ page }) => {
      await expect(page.getByTestId('password-strength')).not.toBeVisible();
    });
  });

  test.describe('Toggle de Visibilidade da Senha', () => {
    test('deve alternar visibilidade da senha principal', async ({ page }) => {
      const passwordInput = page.getByTestId('register-password-input');
      const toggleButton = page.getByTestId('toggle-password-visibility');
      
      await passwordInput.fill('minhasenha123');
      
      // Verificar que inicialmente a senha está oculta
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Clicar para mostrar senha
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Clicar novamente para ocultar
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('deve alternar visibilidade da confirmação de senha', async ({ page }) => {
      const confirmPasswordInput = page.getByTestId('confirm-password-input');
      
      await confirmPasswordInput.fill('minhasenha123');
      
      // Encontrar o botão de toggle da confirmação de senha (segundo toggle na página)
      const toggleButtons = page.locator('[accessibilityLabel*="senha"]');
      const confirmToggle = toggleButtons.nth(1);
      
      // Verificar que inicialmente a senha está oculta
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Clicar para mostrar senha
      await confirmToggle.click();
      await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      
      // Clicar novamente para ocultar
      await confirmToggle.click();
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Estados de Loading e Feedback', () => {
    test('deve mostrar estado de loading durante cadastro', async ({ page }) => {
      // Preencher formulário válido
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar a requisição para simular delay
      await page.route('**/auth/signup', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      // Verificar estado de loading
      await expect(page.getByTestId('register-button')).toHaveText('Cadastrando...');
      await expect(page.getByTestId('register-button')).toBeDisabled();
    });

    test('deve exibir mensagem de sucesso após cadastro bem-sucedido', async ({ page }) => {
      // Preencher formulário válido
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar a requisição para simular sucesso
      await page.route('**/auth/signup', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('success-message')).toBeVisible();
      await expect(page.getByTestId('success-message')).toHaveText('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
    });

    test('deve exibir mensagem de erro para falha no cadastro', async ({ page }) => {
      // Preencher formulário válido
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@existente.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar a requisição para simular erro
      await page.route('**/auth/signup', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Email já está cadastrado' } })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toHaveText('Email já está cadastrado');
    });

    test('deve exibir erro genérico para falha de servidor', async ({ page }) => {
      // Preencher formulário válido
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar a requisição para simular erro de servidor
      await page.route('**/auth/signup', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Erro no servidor');
    });
  });

  test.describe('Navegação', () => {
    test('deve navegar para tela de login ao clicar no link', async ({ page }) => {
      await page.getByTestId('login-link').click();
      
      // Verificar se voltou para a tela de login
      await expect(page.getByRole('heading', { name: /login|entrar/i })).toBeVisible();
    });

    test('deve redirecionar após cadastro bem-sucedido', async ({ page }) => {
      // Preencher formulário válido
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar a requisição para simular sucesso
      await page.route('**/auth/signup', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      // Aguardar redirecionamento (3 segundos conforme implementação)
      await page.waitForTimeout(3500);
      
      // Verificar se foi redirecionado
      await expect(page.getByRole('heading', { name: /login|entrar/i })).toBeVisible();
    });
  });

  test.describe('Acessibilidade', () => {
    test('deve ter labels de acessibilidade corretos', async ({ page }) => {
      await expect(page.getByTestId('name-input')).toHaveAttribute('accessibilityLabel', 'Campo de nome completo');
      await expect(page.getByTestId('register-email-input')).toHaveAttribute('accessibilityLabel', 'Campo de email');
      await expect(page.getByTestId('register-password-input')).toHaveAttribute('accessibilityLabel', 'Campo de senha');
      await expect(page.getByTestId('confirm-password-input')).toHaveAttribute('accessibilityLabel', 'Campo de confirmação de senha');
      await expect(page.getByTestId('register-button')).toHaveAttribute('accessibilityLabel', 'Botão de cadastro');
      await expect(page.getByTestId('login-link')).toHaveAttribute('accessibilityLabel', 'Ir para tela de login');
    });

    test('deve ter atributos ARIA corretos para campos com erro', async ({ page }) => {
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('name-input')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByTestId('register-email-input')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByTestId('register-password-input')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByTestId('confirm-password-input')).toHaveAttribute('aria-invalid', 'true');
    });

    test('deve ter roles corretos para elementos semânticos', async ({ page }) => {
      await expect(page.getByTestId('register-form')).toHaveAttribute('role', 'form');
      await expect(page.getByTestId('name-error')).toHaveAttribute('role', 'alert');
      await expect(page.getByTestId('email-error')).toHaveAttribute('role', 'alert');
      await expect(page.getByTestId('password-error')).toHaveAttribute('role', 'alert');
      await expect(page.getByTestId('confirm-password-error')).toHaveAttribute('role', 'alert');
    });

    test('deve ter aria-live correto para mensagens dinâmicas', async ({ page }) => {
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('name-error')).toHaveAttribute('aria-live', 'polite');
      await expect(page.getByTestId('email-error')).toHaveAttribute('aria-live', 'polite');
      await expect(page.getByTestId('password-error')).toHaveAttribute('aria-live', 'polite');
      await expect(page.getByTestId('confirm-password-error')).toHaveAttribute('aria-live', 'polite');
    });

    test('deve ter accessibilityState correto para botão desabilitado', async ({ page }) => {
      // Preencher formulário para ativar loading
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar para simular delay
      await page.route('**/auth/signup', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({ status: 200, body: '{}' });
      });
      
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('register-button')).toHaveAttribute('accessibilityState', JSON.stringify({ disabled: true }));
    });
  });

  test.describe('Casos Edge e Integração', () => {
    test('deve limpar erros ao corrigir campos', async ({ page }) => {
      // Gerar erros
      await page.getByTestId('register-button').click();
      await expect(page.getByTestId('name-error')).toBeVisible();
      
      // Corrigir campo
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-button').click();
      
      // Verificar que erro do nome foi removido
      await expect(page.getByTestId('name-error')).not.toBeVisible();
    });

    test('deve manter dados do formulário durante validação', async ({ page }) => {
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('123'); // Senha inválida
      
      await page.getByTestId('register-button').click();
      
      // Verificar que os dados válidos foram mantidos
      await expect(page.getByTestId('name-input')).toHaveValue('João Silva');
      await expect(page.getByTestId('register-email-input')).toHaveValue('joao@teste.com');
      await expect(page.getByTestId('register-password-input')).toHaveValue('123');
    });

    test('deve funcionar com diferentes tipos de teclado', async ({ page }) => {
      // Verificar tipo de teclado para email
      await expect(page.getByTestId('register-email-input')).toHaveAttribute('keyboardType', 'email-address');
      
      // Verificar autoCapitalize para email
      await expect(page.getByTestId('register-email-input')).toHaveAttribute('autoCapitalize', 'none');
    });

    test('deve validar formulário completo com dados válidos', async ({ page }) => {
      // Preencher todos os campos corretamente
      await page.getByTestId('name-input').fill('João Silva');
      await page.getByTestId('register-email-input').fill('joao@teste.com');
      await page.getByTestId('register-password-input').fill('MinhaSenh@123');
      await page.getByTestId('confirm-password-input').fill('MinhaSenh@123');
      
      // Interceptar para simular sucesso
      await page.route('**/auth/signup', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      await page.getByTestId('register-button').click();
      
      // Verificar que não há erros de validação
      await expect(page.getByTestId('name-error')).not.toBeVisible();
      await expect(page.getByTestId('email-error')).not.toBeVisible();
      await expect(page.getByTestId('password-error')).not.toBeVisible();
      await expect(page.getByTestId('confirm-password-error')).not.toBeVisible();
      
      // Verificar sucesso
      await expect(page.getByTestId('success-message')).toBeVisible();
    });
  });

  test.describe('Responsividade e Layout', () => {
    test('deve exibir corretamente em dispositivos móveis', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      await expect(page.getByTestId('register-form')).toBeVisible();
      await expect(page.getByTestId('name-input')).toBeVisible();
      await expect(page.getByTestId('register-button')).toBeVisible();
    });

    test('deve exibir corretamente em tablets', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      
      await expect(page.getByTestId('register-form')).toBeVisible();
      await expect(page.getByTestId('name-input')).toBeVisible();
      await expect(page.getByTestId('register-button')).toBeVisible();
    });
  });
});
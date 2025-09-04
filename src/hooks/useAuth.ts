import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook para acessar o contexto de autenticação
 * 
 * @returns Contexto de autenticação com user, session e métodos de auth
 * @throws Error se usado fora do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth;
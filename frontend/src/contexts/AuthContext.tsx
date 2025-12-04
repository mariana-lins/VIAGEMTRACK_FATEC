import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginCredentials, RegisterData } from '../types';
import { usuariosAPI } from '../services/api';

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  registrar: (data: RegisterData) => Promise<void>;
  logout: () => void;
  recarregarUsuario: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do localStorage ao iniciar
    const storedToken = localStorage.getItem('token');
    const storedUsuario = localStorage.getItem('usuario');

    if (storedToken && storedUsuario) {
      const user = JSON.parse(storedUsuario);
      setToken(storedToken);
      setUsuario(user);
      
      // Atualizar dados do usuário em segundo plano
      usuariosAPI.perfil(user.id)
        .then(response => {
          const usuarioAtualizado = response.data;
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
          setUsuario(usuarioAtualizado);
        })
        .catch(error => {
          console.error('Erro ao atualizar dados do usuário:', error);
        });
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await usuariosAPI.login(credentials);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      setToken(token);
      setUsuario(usuario);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const registrar = async (data: RegisterData) => {
    try {
      await usuariosAPI.registrar(data);
      // Após registrar, fazer login automaticamente
      await login({ email: data.email, senha: data.senha });
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      throw new Error(error.response?.data?.error || 'Erro ao registrar');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const recarregarUsuario = async () => {
    if (!usuario) return;

    try {
      const response = await usuariosAPI.perfil(usuario.id);
      const usuarioAtualizado = response.data;

      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      setUsuario(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        login,
        registrar,
        logout,
        recarregarUsuario,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

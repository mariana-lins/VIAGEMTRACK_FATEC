import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validações
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await registrar({ nome, email, senha });
      navigate('/');
    } catch (error: any) {
      setErro(error.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>🌍 ViagemTrack</h1>
            <p>Crie sua conta e comece sua jornada</p>
          </div>

          {erro && (
            <div className="alert alert-error">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                className="form-input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <small className="form-hint">Mínimo de 6 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar Senha
              </label>
              <input
                id="confirmarSenha"
                type="password"
                className="form-input"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Criar Conta'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="link">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

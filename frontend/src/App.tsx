import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListaContinentes from './pages/Continentes/ListaContinentes';
import FormContinente from './pages/Continentes/FormContinente';
import ListaPaises from './pages/Paises/ListaPaises';
import FormPais from './pages/Paises/FormPais';
import DetalhesPais from './pages/Paises/DetalhesPais';
import ListaCidades from './pages/Cidades/ListaCidades';
import FormCidade from './pages/Cidades/FormCidade';
import DetalhesCidade from './pages/Cidades/DetalhesCidade';
import MeuDiario from './pages/Diario/MeuDiario';
import EditarVisita from './pages/Diario/EditarVisita';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path="/continentes" element={<ListaContinentes />} />
          <Route path="/continentes/novo" element={<FormContinente />} />
          <Route path="/continentes/:id/editar" element={<FormContinente />} />
          <Route path="/paises" element={<ListaPaises />} />
          <Route path="/paises/novo" element={<FormPais />} />
          <Route path="/paises/:id" element={<DetalhesPais />} />
          <Route path="/paises/:id/editar" element={<FormPais />} />
          <Route path="/cidades" element={<ListaCidades />} />
          <Route path="/cidades/novo" element={<FormCidade />} />
          <Route path="/cidades/:id" element={<DetalhesCidade />} />
          <Route path="/cidades/:id/editar" element={<FormCidade />} />
          <Route path="/diario" element={<MeuDiario />} />
          <Route path="/visitas/:id/editar" element={<EditarVisita />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

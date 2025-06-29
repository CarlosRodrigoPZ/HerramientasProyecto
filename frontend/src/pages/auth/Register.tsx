import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { FaUserPlus } from 'react-icons/fa';

const countries = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
  'Ecuador', 'El Salvador', 'España', 'Guatemala', 'Honduras', 'México',
  'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Portugal', 'República Dominicana',
  'Uruguay', 'Venezuela'
];

function getPasswordStrength(password: string): { level: string, percent: number, color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) score++;

  if (score === 0) return { level: '', percent: 0, color: '' };
  if (score === 1) return { level: 'Débil', percent: 25, color: 'red' };
  if (score === 2) return { level: 'Media', percent: 50, color: 'orange' };
  if (score === 3) return { level: 'Buena', percent: 75, color: 'yellowgreen' };
  return { level: 'Fuerte', percent: 100, color: 'green' };
}

export default function Register() {
  const [form, setForm] = useState({
    nombre: '', apellidos: '', pais: '', telefono: '', correo: '', password: '', confirmPassword: '',
    street: '', city: '', state: '', postalCode: '', country: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.telefono.length !== 9 || !/^\d+$/.test(form.telefono)) {
      setMessage('El número de teléfono debe tener exactamente 9 dígitos numéricos');
      setMessageType('error');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setMessageType('error');
      return;
    }

    if (getPasswordStrength(form.password).percent < 75) {
      setMessage('La contraseña debe ser más fuerte: al menos 8 caracteres, mayúscula, número y símbolo');
      setMessageType('error');
      return;
    }

    try {
      const { nombre, apellidos, pais, telefono, correo, password, street, city, state, postalCode, country } = form;
      const response = await register({ nombre, apellidos, pais, telefono, correo, password, street, city, state, postalCode, country });

      if (response?.error === 'email_exists') {
        setMessage('El correo ya está registrado');
        setMessageType('error');
        return;
      }

      if (response?.error) {
        setMessage(`Error: ${response.error}`);
        setMessageType('error');
        return;
      }

      setMessage('Usuario registrado correctamente');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Error al registrar:', err);
      setMessage('Error inesperado al registrar usuario');
      setMessageType('error');
    }
  };

  const goToLogin = () => navigate('/login');
  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_1px,transparent_1px),radial-gradient(circle_at_80%_80%,#1a1a1a_1px,transparent_1px)] bg-[length:100px_100px] text-gray-200 px-4">
      <div className="w-full max-w-lg p-10 rounded-xl border border-gray-700 bg-[#1c1c1c] shadow-xl animate-fadeIn">
        <div className="text-center">
          <h2 className="text-4xl mb-2 text-gray-400"><FaUserPlus /></h2>
          <p className="text-sm text-gray-400 mb-2">¡Crea tu cuenta y únete a nosotros!</p>
          <h1 className="text-2xl font-semibold mb-6">Registro</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="nombre" placeholder="Nombre" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input name="apellidos" placeholder="Apellidos" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />

          <select name="pais" value={form.pais} onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">Selecciona tu país</option>
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>

          <input name="telefono" placeholder="Teléfono" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input type="password" name="confirmPassword" placeholder="Repetir Contraseña" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />

          <h3 className="text-xl font-semibold mt-6 mb-3">Dirección</h3>
          <input name="street" placeholder="Calle" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input name="city" placeholder="Ciudad" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input name="state" placeholder="Estado/Provincia" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input name="postalCode" placeholder="Código Postal" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />
          <input name="country" placeholder="País" onChange={handleChange} required className="bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600" />

          <div className="w-full h-2 bg-gray-700 rounded-full mt-1">
            <div style={{ width: `${strength.percent}%`, backgroundColor: strength.color }} className="h-full rounded-full transition-all duration-300" />
          </div>
          {strength.level && (
            <p className="text-sm mt-1" style={{ color: strength.color }}>
              Fuerza: {strength.level}
            </p>
          )}

          <button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md transition-transform hover:scale-105">
            Registrar
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 font-medium ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <button onClick={goToLogin} className="w-full mt-4 py-2 border border-gray-500 rounded-md text-gray-300 hover:bg-gray-700 transition">
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

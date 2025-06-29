import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../services/authService';
import EditAddressForm from '../../components/EditAddressForm';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token, redirigiendo al login');
      navigate('/login');
      return;
    }

    try {
      const userData = await getProfile(token);
      console.log('🧠 Datos del perfil:', userData); // 👈 AÑADE ESTO
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      localStorage.removeItem('token');
      navigate('/login');
      alert('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="p-4 text-gray-500">Cargando perfil...</div>;
  if (!user) return <div className="p-4 text-red-500">No se pudo cargar el perfil</div>;

  return (
    <div className="max-w-xl mx-auto mt-16 p-10 bg-white rounded-2xl shadow-lg text-gray-700">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
        Perfil del Usuario
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <p className="mb-2"><span className="font-semibold text-gray-800">Nombre:</span> {user.nombre}</p>
        <p className="mb-2"><span className="font-semibold text-gray-800">Apellidos:</span> {user.apellidos}</p>
        <p><span className="font-semibold text-gray-800">País:</span> {user.pais}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <p className="mb-2"><span className="font-semibold text-gray-800">Teléfono:</span> {user.telefono}</p>
        <p className="mb-2"><span className="font-semibold text-gray-800">Correo:</span> {user.correo}</p>
        <p><span className="font-semibold text-gray-800">Role:</span> {user.role}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Dirección</h3>
        {user.address ? (
          <>
            <p>Calle: {user.address.street}</p>
            <p>Ciudad: {user.address.city}</p>
            <p>Estado: {user.address.state}</p>
            <p>Código Postal: {user.address.postalCode}</p>
            <p>País: {user.address.country}</p>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-transform hover:-translate-y-0.5"
            >
              Editar Dirección
            </button>
          </>
        ) : (
          <>
            <p>No hay dirección registrada.</p>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-transform hover:-translate-y-0.5"
            >
              Agregar Dirección
            </button>
          </>
        )}
      </div>

      {isEditingAddress && (
        <EditAddressForm
          currentAddress={user.address}
          onSave={() => {
            setIsEditingAddress(false);
            fetchProfile();
          }}
          onCancel={() => setIsEditingAddress(false)}
        />
      )}

      <a
        href="/editar-perfil"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-transform hover:-translate-y-0.5"
      >
        Editar Perfil
      </a>
    </div>
  );
}

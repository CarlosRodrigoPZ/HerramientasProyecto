import React from 'react';
import { Link } from 'react-router-dom';

const VerificationFailed: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error de Verificación</h1>
        <p className="text-gray-700 mb-6">
          No se pudo verificar tu cuenta. El token puede ser inválido o haber expirado.
        </p>
        <Link
          to="/register"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Volver a Registrarse
        </Link>
      </div>
    </div>
  );
};

export default VerificationFailed;

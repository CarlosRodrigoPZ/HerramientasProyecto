import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Cuenta Activada!</h1>
        <p className="text-gray-700 mb-6">
          Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default VerificationSuccess;

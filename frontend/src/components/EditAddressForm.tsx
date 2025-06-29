import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface EditAddressFormProps {
  currentAddress?: Address;
  onSave: () => void;
  onCancel: () => void;
}

const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000';

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  currentAddress,
  onSave,
  onCancel,
}) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress);
    }
  }, [currentAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/auth/profile/address`, address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Dirección actualizada con éxito');
      onSave();
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
      alert('Error al actualizar la dirección');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Editar Dirección</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
              Calle
            </label>
            <input
              type="text"
              name="street"
              id="street"
              value={address.street || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={address.city || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              Estado/Provincia
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={address.state || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
              Código Postal
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={address.postalCode || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              País
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={address.country || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressForm;

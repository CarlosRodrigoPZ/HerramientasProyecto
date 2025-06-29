import React, { useState } from 'react';

interface ProductData {
  name: string;
  brand: string;
  price: string;
  description: string;
  type: string;
  material: string;
}

interface AddProductProps {
  onProductAdded?: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onProductAdded }) => {
  const [product, setProduct] = useState<ProductData>({
    name: '',
    brand: '',
    price: '',
    description: '',
    type: '',
    material: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al agregar producto');
      }

      setMessage('✅ Producto agregado con éxito');
      setIsError(false);
      setProduct({
        name: '',
        brand: '',
        price: '',
        description: '',
        type: '',
        material: '',
      });
      setImage(null);

      if (onProductAdded) onProductAdded();
    } catch (err: any) {
      setMessage(err.message);
      setIsError(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Agregar Producto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Nombre', name: 'name' },
          { label: 'Marca', name: 'brand' },
          { label: 'Precio', name: 'price', type: 'number' },
          { label: 'Descripción', name: 'description' },
          { label: 'Tipo', name: 'type' },
          { label: 'Material', name: 'material' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type || 'text'}
              name={name}
              value={(product as any)[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700 mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Agregar Producto
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            isError ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddProduct;

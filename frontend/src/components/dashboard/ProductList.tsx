import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  type: string;
  material: string;
  image: string;
  isDisabled: boolean;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3000/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setEditValues({ ...product });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async (id: string) => {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(editValues),
    });

    if (res.ok) {
      setEditingId(null);
      fetchProducts();
    }
  };

  const handleDisableToggle = async (id: string, currentStatus: boolean) => {
    const res = await fetch(`http://localhost:3000/products/${id}/disable`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ isDisabled: !currentStatus }),
    });

    if (res.ok) {
      fetchProducts();
    } else {
      alert('Error al cambiar el estado de deshabilitación');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Lista de Productos</h2>

      {products.map(product => (
        <div
          key={product._id}
          className="flex flex-col sm:flex-row items-start bg-white shadow-md rounded-2xl p-5 mb-6 gap-4 hover:scale-[1.01] transition-transform"
        >
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
            className="w-32 h-auto rounded-lg object-cover"
          />

          {editingId === product._id ? (
            <div className="flex-1">
              {['name', 'brand', 'price', 'description', 'type', 'material'].map(field => (
                <input
                  key={field}
                  name={field}
                  value={editValues[field as keyof Product] || ''}
                  onChange={handleEditChange}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder={field}
                />
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditSave(product._id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-sm">
              <p className="text-xl font-semibold text-gray-800 mb-1">{product.name}</p>
              <p className="text-gray-600">Marca: {product.brand}</p>
              <p className="text-gray-600">Precio: ${product.price}</p>
              <p className="text-gray-600">Estado: {product.isDisabled ? 'Deshabilitado' : 'Habilitado'}</p>
              <p className="text-gray-600 mb-2">{product.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleDisableToggle(product._id, product.isDisabled)}
                  className={`ml-2 ${product.isDisabled ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-4 py-2 rounded-lg`}
                >
                  {product.isDisabled ? 'Habilitar' : 'Deshabilitar'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; // ajusta el path si es necesario
import { getProfile } from '../services/authService';

const CartPage: React.FC = () => {
  const { cartItems, dispatch } = useCart();
  const [userAddress, setUserAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userProfile = await getProfile(token);
          if (userProfile && userProfile.address) {
            setUserAddress(userProfile.address);
          }
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      }
    };
    fetchUserAddress();
  }, []);

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!userAddress.street || !userAddress.city || !userAddress.state || !userAddress.postalCode || !userAddress.country) {
      alert('Por favor, complete todos los campos de dirección.');
      return;
    }

    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
      street: userAddress.street,
      city: userAddress.city,
      state: userAddress.state,
      postalCode: userAddress.postalCode,
      country: userAddress.country,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Error al realizar la compra: ' + errorData.message);
        return;
      }

      alert('Compra realizada con éxito');
      dispatch({ type: 'CLEAR_CART' });
      // Optionally clear cart or redirect
    } catch (error) {
      alert('Error al realizar la compra');
    }
  };

  if (cartItems.length === 0) {
    return <p className="text-center mt-8 text-gray-500">Tu carrito está vacío.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>
      {cartItems.map(item => (
        <div
          key={item._id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            )}
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={item.quantity}
              min={1}
              onChange={e => handleQuantityChange(item._id, parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-center"
            />
            <button
              onClick={() => handleRemove(item._id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Dirección de envío</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Calle"
            name="street"
            value={userAddress.street}
            onChange={handleAddressChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Ciudad"
            name="city"
            value={userAddress.city}
            onChange={handleAddressChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Estado"
            name="state"
            value={userAddress.state}
            onChange={handleAddressChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Código Postal"
            name="postalCode"
            value={userAddress.postalCode}
            onChange={handleAddressChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="País"
            name="country"
            value={userAddress.country}
            onChange={handleAddressChange}
            className="px-4 py-2 border rounded"
          />
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold">
          Total: <span className="text-green-600">${total.toFixed(2)}</span>
        </p>
        <button
          onClick={handleCheckout}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default CartPage;
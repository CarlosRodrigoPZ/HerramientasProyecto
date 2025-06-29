import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  role: string;
  isBanned: boolean;
}

const roles = ['user', 'admin', 'moderator'];

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/auth/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingId(user._id);
    setEditRole(user.role);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditRole(e.target.value);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`http://localhost:3000/auth/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ role: editRole }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchUsers();
    } else {
      alert('Error al actualizar el rol');
    }
  };

  const handleBanToggle = async (id: string, currentStatus: boolean) => {
    const res = await fetch(`http://localhost:3000/auth/users/${id}/ban`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ isBanned: !currentStatus }),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      alert('Error al cambiar el estado de baneo');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Lista de Usuarios</h2>
      {users.map(user => (
        <div
          key={user._id}
          className="flex items-center justify-between bg-white shadow-md rounded-2xl p-5 mb-4"
        >
          <div>
            <p className="text-lg font-semibold">{user.nombre} {user.apellidos}</p>
            <p className="text-gray-600">{user.correo}</p>
            <p className="text-gray-600">Estado: {user.isBanned ? 'Baneado' : 'Activo'}</p>
          </div>
          <div className="flex items-center">
            {editingId === user._id ? (
              <>
                <select value={editRole} onChange={handleRoleChange} className="border rounded px-2 py-1">
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleSave(user._id)}
                  className="ml-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="ml-2 bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="mr-4 font-medium">{user.role}</span>
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  Editar Rol
                </button>
                <button
                  onClick={() => handleBanToggle(user._id, user.isBanned)}
                  className={`ml-2 ${user.isBanned ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white px-4 py-1 rounded`}
                >
                  {user.isBanned ? 'Desbanear' : 'Banear'}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;

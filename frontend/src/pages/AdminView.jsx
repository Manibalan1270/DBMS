import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data)).catch((err) => setError(errorMessage(err)));
  }, []);
  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/delete/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  if (error) return <p>{error} <Link to="/">Home</Link></p>;
  return (
    <div>
      <h1>All Users</h1>
      {users.map((u) => (
        <div key={u.id}>
          {u.name} - {u.email} ({u.role}) <Link to={`/admin/user/${u.id}`}>View</Link>{' '}
          <Link to={`/admin/edit/${u.id}`}>Edit</Link> <button onClick={() => deleteUser(u.id)}>Delete</button>
        </div>
      ))}
      <p><Link to="/">Home</Link></p>
    </div>
  );
}

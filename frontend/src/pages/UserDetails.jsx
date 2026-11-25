import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get(`/admin/user/${id}`).then((res) => setUser(res.data)).catch((err) => setError(errorMessage(err)));
  }, [id]);
  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>Role: {user.role}</p>
      <p><Link to="/admin">Back</Link></p>
    </div>
  );
}

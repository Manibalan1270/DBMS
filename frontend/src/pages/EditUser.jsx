import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    api
      .get(`/admin/user/${id}`)
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((err) => alert(errorMessage(err)));
  }, [id]);
  const handleEdit = async () => {
    try {
      await api.put(`/admin/edit/${id}`, { name, email });
      navigate('/admin');
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  return (
    <div>
      <h1>Edit User</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleEdit}>Save</button>
    </div>
  );
}

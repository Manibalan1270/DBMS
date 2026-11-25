import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async () => {
    try {
      const res = await api.post('/register', { name, email, password });
      alert(res.data.message);
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  return (
    <div>
      <h1>Register</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Register</button>
      <p><Link to="/">Home</Link></p>
    </div>
  );
}

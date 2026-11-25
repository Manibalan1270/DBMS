import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import { UserContext } from '../context/UserContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user, res.data.token);
      alert('Login Successful');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p><Link to="/">Home</Link></p>
    </div>
  );
}

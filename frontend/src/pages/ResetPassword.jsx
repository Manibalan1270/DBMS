import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

// Changing a password now needs the current one. Before, anyone who knew an
// email address could set a new password for that account.
export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const handleReset = async () => {
    try {
      const res = await api.put('/reset-password', { email, currentPassword: currentPass, password: newPass });
      alert(res.data.message);
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  return (
    <div>
      <h1>Change Password</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Current Password" type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
      <input placeholder="New Password" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
      <button onClick={handleReset}>Change</button>
      <p><Link to="/">Home</Link></p>
    </div>
  );
}

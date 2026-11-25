import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

export default function Home() {
  const { user, logout } = useContext(UserContext);
  return (
    <div>
      <h1>User Management System</h1>
      {user ? (
        <p>
          Logged in as <b>{user.name}</b> ({user.role}){' '}
          <button onClick={logout}>Logout</button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )}
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/reset-password">Change Password</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </nav>
    </div>
  );
}

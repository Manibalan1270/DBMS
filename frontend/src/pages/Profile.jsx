import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import api, { errorMessage } from '../api.js';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [info, setInfo] = useState(null);
  useEffect(() => {
    if (!user) return;
    api.get(`/user/${user.id}`).then((res) => setInfo(res.data)).catch((err) => alert(errorMessage(err)));
  }, [user]);
  if (!user) return <p>Login first. <Link to="/login">Login</Link></p>;
  return (
    <div>
      <h1>{info?.name}'s Profile</h1>
      <p>Email: {info?.email}</p>
      <p>Role: {info?.role}</p>
      <p><Link to="/">Home</Link></p>
    </div>
  );
}

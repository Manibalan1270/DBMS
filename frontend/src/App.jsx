import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import AdminView from './pages/AdminView.jsx';
import UserDetails from './pages/UserDetails.jsx';
import EditUser from './pages/EditUser.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/admin/user/:id" element={<UserDetails />} />
        <Route path="/admin/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

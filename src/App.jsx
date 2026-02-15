import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function App() {
    const { token, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
                <Route path="/profile-setup" element={token ? <ProfileSetup /> : <Navigate to="/login" />} />
                <Route path="/discover" element={token ? <Discover /> : <Navigate to="/login" />} />
                <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
                <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={token ? "/discover" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;

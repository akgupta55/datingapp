import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
            <div className="card-premium p-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-rose-100 p-5 rounded-full mb-4 ring-8 ring-rose-50">
                        <Heart className="text-primary w-12 h-12 fill-primary animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-rose-500 font-medium mt-2">Love is just a login away</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="input-premium"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            className="input-premium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-xl mt-4">
                        Sign In
                    </button>
                </form>

                <p className="mt-10 text-center text-gray-500 font-medium">
                    New here? <Link to="/register" className="text-primary hover:text-rose-600 font-bold underline decoration-2 underline-offset-4">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

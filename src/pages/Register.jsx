import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ ...formData, age: Number(formData.age) });
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
            <div className="card-premium p-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-rose-100 p-5 rounded-full mb-4 ring-8 ring-rose-50">
                        <UserPlus className="text-primary w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Join Us</h1>
                    <p className="text-rose-500 font-medium mt-2">Start your journey to find "The One"</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            className="input-premium"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="input-premium"
                            placeholder="you@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
                            <input
                                type="password"
                                className="input-premium"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-28">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Age</label>
                            <input
                                type="number"
                                className="input-premium"
                                placeholder="21"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-xl mt-6">
                        Register Now
                    </button>
                </form>

                <p className="mt-10 text-center text-gray-500 font-medium">
                    Already have an account? <Link to="/login" className="text-primary hover:text-rose-600 font-bold underline decoration-2 underline-offset-4">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

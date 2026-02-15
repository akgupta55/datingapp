import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, ArrowLeft, Edit2, Heart, Shield, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            <div className="p-5 flex items-center gap-4 bg-white border-b border-rose-100 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/')} className="p-3 hover:bg-rose-50 text-primary rounded-full transition-all">
                    <ArrowLeft />
                </button>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
            </div>

            <div className="p-8 max-w-2xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative mb-10">
                    <div className="p-2 bg-white rounded-full shadow-premium ring-4 ring-rose-50">
                        <img
                            src={user.avatar || 'https://via.placeholder.com/150'}
                            alt={user.name}
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    </div>
                    <button onClick={() => navigate('/profile-setup')} className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform">
                        <Edit2 size={20} />
                    </button>
                </div>

                <h2 className="text-4xl font-black text-gray-900 mb-2">{user.name}, {user.age}</h2>
                <div className="flex items-center gap-2 text-rose-500 font-bold mb-10 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">
                    <Heart size={16} fill="currentColor" />
                    <span>Passionate Soul</span>
                </div>

                <div className="space-y-6 w-full">
                    <div className="card-premium p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <UserIcon className="text-primary" /> About Me
                        </h3>
                        <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-rose-200 pl-4 py-1">
                            "{user.bio || 'Your bio will appear here to attract potential matches.'}"
                        </p>
                        <div className="mt-8">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Interests</h4>
                            <div className="flex gap-2 flex-wrap">
                                {user.interests?.length > 0 ? (
                                    user.interests.map((i, idx) => (
                                        <span key={idx} className="bg-rose-50 text-primary font-bold border border-rose-100 px-4 py-1.5 rounded-xl text-sm">{i}</span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic">No interests added yet.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-premium p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-50 text-gray-700 transition-all font-bold">
                            <Bell className="text-primary" /> Notifications
                        </button>
                        <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-50 text-gray-700 transition-all font-bold">
                            <Shield className="text-primary" /> Security
                        </button>
                    </div>

                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:bg-rose-50 text-gray-400 hover:text-red-500 hover:border-red-100 p-5 rounded-[2rem] transition-all font-black text-xl mb-12"
                    >
                        <LogOut size={24} /> Logout Account
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper for consistency
const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Heart, X, MessageCircle, User as UserIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
    const [profiles, setProfiles] = useState([]);
    const { token, user } = useAuth();
    const { unreadMessages } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfiles(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (token) fetchProfiles();
    }, [token]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/30 overflow-x-hidden">
            {/* Header */}
            <div className="p-5 flex justify-between items-center bg-white border-b border-rose-100 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-xl">
                        <Heart className="text-white w-6 h-6 fill-white" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dating<span className="text-primary">App</span></h1>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => navigate('/chat')} className="p-3 bg-rose-50 hover:bg-rose-100 text-primary rounded-full transition-all relative">
                        <MessageCircle className="w-6 h-6" />
                        {unreadMessages.length > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {unreadMessages.length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => navigate('/profile')} className="transition-all hover:scale-105 active:scale-95">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Me" className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-100 p-0.5" />
                        ) : (
                            <div className="p-2.5 bg-rose-50 text-primary rounded-full ring-2 ring-rose-100">
                                <UserIcon className="w-6 h-6" />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto w-full p-6 md:p-10">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Discover New Hearts</h2>
                    <p className="text-gray-500 font-medium">Find someone who resonates with your soul</p>
                </div>

                {profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {profiles.map((profile) => (
                            <motion.div
                                key={profile._id}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-[2.5rem] shadow-premium border border-rose-50 overflow-hidden flex flex-col transition-all cursor-pointer relative"
                                onClick={() => navigate(`/profile/${profile._id}`)}
                            >
                                {/* Image Container */}
                                <div className="h-72 overflow-hidden relative">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-rose-50">
                                            <UserIcon className="w-20 h-20 text-rose-200" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/chat');
                                            }}
                                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-lg"
                                        >
                                            <MessageCircle size={20} fill="currentColor" />
                                        </button>
                                        <button className="bg-primary p-3 rounded-full text-white hover:bg-primary-hover transition-colors shadow-lg">
                                            <Heart size={20} fill="white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-black text-gray-900 truncate pr-2">{profile.name}, {profile.age}</h3>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed italic">
                                        "{profile.bio || 'Seeking a beautiful connection...'}"
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {profile.interests?.slice(0, 2).map((i, idx) => (
                                            <span key={idx} className="text-[10px] font-bold bg-rose-50 text-primary border border-rose-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">{i}</span>
                                        ))}
                                        {profile.interests?.length > 2 && (
                                            <span className="text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2.5 py-1 rounded-lg">+{profile.interests.length - 2}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-soft border border-rose-50">
                        <Sparkles className="w-16 h-16 text-primary opacity-20 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-gray-900">Quiet for Now</h3>
                        <p className="text-gray-500 font-medium mt-2">Check back later for new potential matches!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discover;

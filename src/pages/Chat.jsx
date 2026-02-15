import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Send, ArrowLeft, MoreVertical, Circle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Chat = () => {
    const { user, token } = useAuth();
    const { messages, setMessages, sendMessage, onlineUsers, typing, sendTyping, stopTyping, unreadMessages, clearUnread } = useChat();
    const [inputText, setInputText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [chatUsers, setChatUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChatUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (token) fetchUsers();
    }, [token]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedUser) {
                try {
                    const res = await axios.get(`${API_URL}/api/chat/${selectedUser._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(res.data);
                    clearUnread(selectedUser._id);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchMessages();
    }, [selectedUser, token, setMessages, clearUnread]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUser) return;

        const messageData = {
            senderId: user.id || user._id,
            receiverId: selectedUser._id,
            text: inputText,
            chat: selectedUser._id,
            createdAt: new Date().toISOString()
        };

        sendMessage(messageData);
        setInputText('');
        stopTyping(selectedUser._id);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-96 bg-gray-50/50 border-r border-rose-100 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-rose-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-rose-50 text-primary rounded-full transition-all">
                            <ArrowLeft />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900">Messages</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chatUsers.length > 0 ? chatUsers.map((u) => (
                        <div
                            key={u._id}
                            onClick={() => setSelectedUser(u)}
                            className={`p-4 flex items-center gap-4 cursor-pointer rounded-2xl transition-all ${selectedUser?._id === u._id ? 'bg-white shadow-soft ring-1 ring-rose-100' : 'hover:bg-rose-50/50'}`}
                        >
                            <div className="relative">
                                <img src={u.avatar || 'https://via.placeholder.com/150'} alt={u.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white" />
                                {onlineUsers.includes(u._id) && (
                                    <div className="w-4 h-4 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white shadow-sm" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900 truncate">{u.name}</h4>
                                    {unreadMessages.filter(m => m.senderId === u._id).length > 0 ? (
                                        <span className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                            {unreadMessages.filter(m => m.senderId === u._id).length}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-black text-rose-300">ACTIVE</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{onlineUsers.includes(u._id) ? 'Online now' : 'Seen recently'}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-sm">Find someone to start a conversation with!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-rose-50/10">
                    <div className="p-5 bg-white border-b border-rose-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 hover:bg-rose-50 text-primary rounded-full"><ArrowLeft /></button>
                            <div className="relative">
                                <img src={selectedUser.avatar || 'https://via.placeholder.com/150'} alt={selectedUser.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-50" />
                                {onlineUsers.includes(selectedUser._id) && (
                                    <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900">{selectedUser.name}</h4>
                                <p className={`text-xs font-bold ${typing ? 'text-primary animate-pulse' : 'text-gray-400'}`}>
                                    {typing ? 'typing something sweet...' : (onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline')}
                                </p>
                            </div>
                        </div>
                        <button className="p-3 hover:bg-rose-50 text-gray-400 rounded-full"><MoreVertical /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.senderId === (user.id || user._id) ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] shadow-soft ${m.senderId === (user.id || user._id) ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-rose-50'}`}>
                                    <p className="font-medium leading-relaxed">{m.text}</p>
                                    <p className={`text-[10px] mt-1 font-bold ${m.senderId === (user.id || user._id) ? 'text-rose-100 text-right' : 'text-gray-400 text-left'}`}>
                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-6 bg-white border-t border-rose-100 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.03)]">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    className="input-premium py-4 pr-12"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => {
                                        setInputText(e.target.value);
                                        if (e.target.value) sendTyping(selectedUser._id);
                                        else stopTyping(selectedUser._id);
                                    }}
                                />
                            </div>
                            <button type="submit" className="bg-primary hover:bg-primary-hover p-4 rounded-2xl text-white shadow-premium transition-all transform hover:scale-105 active:scale-95">
                                <Send size={24} strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-rose-50/10 text-gray-300 relative">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/heart.png')] pointer-events-none" />
                    <div className="bg-white p-16 rounded-[3rem] shadow-premium border border-rose-100 flex flex-col items-center">
                        <div className="bg-rose-50 p-6 rounded-full mb-6">
                            <MessageSquare size={64} className="text-primary opacity-40" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Speak from the Heart</h3>
                        <p className="text-gray-500 font-medium text-center max-w-sm">Select a person from the sidebar and start your beautiful conversation.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;

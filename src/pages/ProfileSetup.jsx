import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera } from 'lucide-react';

const ProfileSetup = () => {
    const [formData, setFormData] = useState({
        bio: '',
        age: '',
        interests: '',
        avatar: ''
    });
    const { token, setUser } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview locally
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, avatar: reader.result });
        };
        reader.readAsDataURL(file);

        // Upload to server
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await axios.post('http://localhost:5001/api/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            // Update formData with the server-side URL
            setFormData(prev => ({ ...prev, avatar: `http://localhost:5001${res.data.url}` }));
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5001/api/profile',
                { ...formData, interests: formData.interests.split(',').map(i => i.trim()), age: Number(formData.age) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data);
            navigate('/discover');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4 pt-12 pb-12">
            <div className="card-premium p-10 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-900">Complete Your Profile</h2>
                    <p className="text-rose-500 font-medium mt-2">Let the world know who you are</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 flex flex-col items-center mb-4">
                        <div className="w-36 h-36 bg-rose-50 rounded-full flex items-center justify-center border-2 border-dashed border-rose-200 relative cursor-pointer hover:bg-rose-100 transition-all group">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <Camera className="text-rose-300 w-10 h-10 group-hover:scale-110 transition-transform" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-sm font-medium text-gray-400 mt-3">Click to upload your profile photo</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">About You</label>
                        <textarea
                            className="input-premium min-h-[120px] resize-none"
                            placeholder="Tell us something interesting about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Your Age</label>
                        <input
                            type="number"
                            className="input-premium"
                            placeholder="21"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Interests (Music, Art, Travel...)</label>
                        <input
                            className="input-premium"
                            placeholder="e.g. Coding, Music, Art"
                            value={formData.interests}
                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="btn-primary w-full py-5 text-2xl flex items-center justify-center gap-3 shadow-premium">
                            Start Your Journey <Sparkles className="w-7 h-7" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;

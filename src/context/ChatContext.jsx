import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        if (user && token) {
            const newSocket = io('http://localhost:5001', {
                auth: { token }
            });

            setSocket(newSocket);

            newSocket.emit('setup', user.id || user._id);

            newSocket.on('online-users', (users) => setOnlineUsers(users));

            newSocket.on('message-received', (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
                // If the user is not on the chat page or not looking at this sender
                setUnreadMessages((prev) => [...prev, newMessage]);
            });

            newSocket.on('typing', () => setTyping(true));
            newSocket.on('stop-typing', () => setTyping(false));

            return () => newSocket.close();
        }
    }, [user, token]);

    const clearUnread = (senderId) => {
        setUnreadMessages((prev) => prev.filter(m => m.senderId !== senderId));
    };

    const sendMessage = (messageData) => {
        if (socket) {
            socket.emit('new-message', messageData);
            // We don't add to local state here because the listener will handle the 'message-received' 
            // OR we can add it here if we want immediate UI update. 
            // In server.js, we only emit to receiver. So we SHOULD update locally for sender.
            const localMsg = {
                ...messageData,
                senderId: user.id || user._id,
                createdAt: new Date().toISOString()
            };
            setMessages((prev) => [...prev, localMsg]);
        }
    };

    const sendTyping = (room) => socket?.emit('typing', room);
    const stopTyping = (room) => socket?.emit('stop-typing', room);

    return (
        <ChatContext.Provider value={{ socket, messages, setMessages, onlineUsers, typing, unreadMessages, clearUnread, sendMessage, sendTyping, stopTyping }}>
            {children}
        </ChatContext.Provider>
    );
};

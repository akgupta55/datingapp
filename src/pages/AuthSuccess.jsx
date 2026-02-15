import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Check if profile is complete (could also get this from token or initial API call)
            navigate('/profile-setup');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2 className="heading-xl">Finalizing Login...</h2>
        </div>
    );
};

export default AuthSuccess;

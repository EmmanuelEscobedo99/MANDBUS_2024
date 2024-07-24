import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const storedToken = document.cookie.split(';').find(c => c.trim().startsWith('token='));
            

            if (storedToken) {
                const token = storedToken.split('=')[1];

                try {
                    const response = await axios.get(`http://localhost:8081/user/vtoken/${token}`);

                    if (response.data.success) {
                        setToken(token);
                        setUser(response.data.user);
                    } else {
                        
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                }
            }

            setIsLoading(false);
        };

        checkAuthentication();
    }, []);


    const login = async (correo, contrasena) => {
        try {
            const response = await axios.post('http://localhost:8081/user/login', { correo, contrasena });
            console.log(response.data)

            if (response.data.token && response.data.user) {
                setToken(response.data.token);
                console.log(token)
                setUser(response.data.user);
                localStorage.setItem('tokenLogin', response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = async (token) => {
        try {
            await axios.put('http://localhost:8081/user/logout', { token });
        } catch (error) {

        }
        setToken(null);
        setUser(null);
        navigate('/Login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
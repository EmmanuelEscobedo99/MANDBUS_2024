import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useTokenLogin = () => {
    const navigate = useNavigate();
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Verificar si existe un token de login en el localStorage
        const token = localStorage.getItem('tokenLogin');
        if (token) {
            // Si existe un token, establecer hasToken en true
            setHasToken(true);
        } else {
            // Si no existe un token, establecer hasToken en false
            setHasToken(false);
            navigate('/Login');
        }
    }, []); // Solo se ejecuta una vez al montar el componente

    return hasToken;
};

export default useTokenLogin;

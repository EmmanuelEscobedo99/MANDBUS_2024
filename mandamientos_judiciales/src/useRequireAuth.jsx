import { useAuth } from "./AuthContext";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useRequireAuth = () => {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el token existe y no está cargando
    if (token && !isLoading) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, isLoading]);

  useEffect(() => {
    // Redirigir si la autenticación no se ha verificado y no hay token
    if (!isLoading && !isAuthenticated) {
      navigate('/Login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  return isAuthenticated;
};

export default useRequireAuth
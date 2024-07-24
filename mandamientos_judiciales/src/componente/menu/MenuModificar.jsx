import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Reloj from './Reloj'; // Importa el componente Reloj
import '../../../src/index.css';
import { AuthContext } from '../../AuthContext';
import Login from '../Login';
import CryptoJS from 'crypto-js';
import Modal from 'react-bootstrap/Modal'; // Importa el componente Modal de Bootstrap
import Button from 'react-bootstrap/Button'; // Importa el componente Button de Bootstrap
import { FaCheck, FaEdit, FaSyncAlt, FaSearch, FaTimes, FaUserAlt, FaCircle } from 'react-icons/fa';

const MenuModificar = () => {
  /*const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const institucion = queryParams.get('institucion');*/
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('tokenLogin');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  /*const handleSubmit = () => {
    if (password === '123') { 
      setShowModal(false);
      setError('');
      window.location.href = '/BuscarContra';
    } else {
      setError('Contraseña incorrecta');
    }
  };*/

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8081/user/verify-password', { password });
      if (response.data.success) {
        window.location.href = '/BuscarContra';
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {

    }
  }

  const logout = async () => {
    try {
      const response = await axios.put('http://localhost:8081/user/logout2', { storedToken });
      if (response.data.success) {
        navigate('/Login');
      } else {
        console.error('Error durante el logout:', response.data.message);
      }
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  const handleLogout = () => {

    if (storedToken) {
      logout();
      localStorage.removeItem('tokenLogin')
    }
    setShowModal(false);
    setPassword('')
    setError('')
  };

  return (
    <div className='contenedor-menu2'>
      <header className='menu-header2'>
        <div className='menu-title2'>MANDAMIENTOS JUDICIALES</div>
      </header>
      <div className='menu2'>
        {/*<Reloj /> {/* Aquí se agrega el componente Reloj */}

        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/Ver' className='menu-link2'> <FaUserAlt className="mr-2" style={{ marginBottom: '10px' }} />  ADMINISTRADOR</Link>
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <cite style={{ marginLeft: '20px' }}><FaCircle style={{ color: 'green' }} /> online</cite>
          </div>
        </div>
        {/* Línea divisoria */}
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <hr style={{ borderTop: '1px solid #ccc' }} />
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/Ver' className='menu-link2'>1. Ver registros</Link>
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/VerTablas' className='menu-link2'>2. Estatus de registros</Link>

          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/VerErrores' className='menu-link2'>3. Registros con errores</Link>
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/VerValidados' className='menu-link2'>4. Registros validados</Link>
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <button className='menu-link2' onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', outline: 'none' }}>5. Cerrar sesión</button>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <hr style={{ borderTop: '1px solid #ccc' }} />
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link to='/RegistrarUsuarios' className='menu-link2'>USUARIOS</Link>
          </div>
        </div>

        {/* Modal para solicitar contraseña */}
        <Modal show={showModal} onHide={handleClose} style={{ paddingTop: '400px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Verificación de contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese contraseña"
              value={password}
              onChange={handleChange}
            />
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              <FaTimes /> Cerrar
            </Button>
            <Button variant="success" onClick={handleSubmit}>
              <FaCheck /> Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='mb-3 row'>
          <div className='col-sm-12'>
            <Link
              to='#'
              className='menu-link2'
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              1. Buscar contraseñas
            </Link>
          </div>
        </div>
        {/* Agrega más enlaces aquí según sea necesario */}
      </div>
    </div>
  );
};

export default MenuModificar;

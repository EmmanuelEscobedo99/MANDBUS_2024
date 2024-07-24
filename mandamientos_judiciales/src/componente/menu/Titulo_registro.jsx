import React, { useState } from 'react'
import "../styles/titulo.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Titulo_registro = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('tokenLogin');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <>
      <>
        <Navbar >
          <Container>
            <Navbar.Brand href="/"><h3>MANDAMIENTOS JUDICIALES</h3></Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link href="/"> <h5>Alta registro</h5> </Nav.Link>
              <Nav.Link href="/modificacion"> <h5>Cambio</h5> </Nav.Link>
              <Nav.Link href="comba"><h5>Baja</h5>  </Nav.Link>
              <button
                className='nav-link'
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                <h5>Cerrar sesión</h5>
              </button>
            </Nav>
          </Container>
        </Navbar>
      </>

    </>
  )
}

export default Titulo_registro
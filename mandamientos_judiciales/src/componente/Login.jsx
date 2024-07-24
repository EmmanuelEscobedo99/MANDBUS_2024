import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import CryptoJS from 'crypto-js';

const RECAPTCHA_SITE_KEY = '6LdF68ApAAAAAGEbrNRhFRHJXCL7BiY1__KJyhpW';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showCaptcha && captchaValue) {
      try {
        const response = await axios.post('http://localhost:8081/user/login', {
          correo,
          contrasena,
          captchaValue,
        });

        if (response.data.success) {
          localStorage.setItem('tokenLogin', response.data.token);

          if (response.data.user.rol === 'admin') {
            const institucion = response.data.user.institucion;
            if (institucion) {
              const encryptedId = CryptoJS.AES.encrypt(institucion.toString(), 'clave_secreta').toString();
              navigate(`/ver?institucion=${institucion}&id=${encryptedId}`);
            } else {
              console.error('La institución del usuario es undefined');
              setError('La institución del usuario es undefined');
            }
          } else if (response.data.user.rol === 'user') {
            const institucion = response.data.user.institucion;
            try {
              //Enviar la institución al backend
              /*await axios.post('http://localhost:8081/datos-generales/insdatosgeneralestemp', {
                institucion,
              });*/
              //Navegar a la página principal
              navigate('/');
            } catch (error) {
              console.error('Error al enviar la institución: ', error);
              setError('Error al enviar la institución');
            }
          }
        } else {
          setError('Usuario o Contraseña incorrectos');
        }
      } catch (error) {
        console.error('Error durante el login:', error);
        setError('Usuario o Contraseña incorrectos');
      }
    } else {
      setShowCaptcha(true);
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaValue(value);
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center h-100">
        <Col md={4} className="login-col">
          <div className="d-flex justify-content-center align-items-center">
            <span
              className="mr-2 d-inline-block rounded-circle bg-black text-white p-2 d-flex align-items-center justify-content-center"
              style={{ fontSize: '3em', lineHeight: '2em' }}
            >
              <FaUser />
            </span>
          </div>
          <br />
          <h3 className="text-center mb-4">Mandamientos Judiciales</h3>
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="login-input"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="login-input"
              />
            </Form.Group>

            {showCaptcha && (
              <div className="mb-3">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  onErrored={(e) => console.error('reCAPTCHA error:', e)}
                />
              </div>
            )}
        
            <Button variant="info" type="submit" block  style={{ width:'310px'}}>
              Iniciar Sesión
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

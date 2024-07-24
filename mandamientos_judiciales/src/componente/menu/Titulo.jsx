import React from 'react'
import "../styles/titulo.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const Titulo = () => {
  return (
    <>
      <Navbar >
        <Container>
          <Navbar.Brand ><h4>MANDAMIENTOS JUDICIALES</h4></Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#home"></Nav.Link>
            <Nav.Link href="#features"></Nav.Link>
            <Nav.Link href="#pricing"></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      
    </>
  )
}

export default Titulo
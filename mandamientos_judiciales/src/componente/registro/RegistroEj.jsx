import React from 'react'
import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../src/index.css";
import useTokenLogin from '../../useTokenLogin';

const RegistroEj = () => {
  const hasToken = useTokenLogin();
  const navigate = useNavigate();
  //objeto principal
  const [registro, setRegistro] = useState({
    nombre: "",
    apellido: "",
    edad: "",

  });

  const handleChange = (e) => {
    //formatoDia()  
    const { name, value } = e.target;
    setRegistro((prev) => ({ ...prev, [name]: value.trim() }));

  };

  const handleClick = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:8081/prueba", registro);
      alert("El nuevo registro ha sido guardado correctamente ");
      navigate("/Inicio")
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  }

  return (
    <>

      <Titulo></Titulo>
      <Menu></Menu>
      <div className={`contenedor ${hasToken ? '' : 'd-none'}`}>
        <div className="contenedor_principal">
          <div className="row">
            <div className="mb-12 row">

              <form onSubmit={handleClick}>
                <h3>Formulario principal para el registro</h3>


                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>

                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">Edad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edad"
                      name="edad"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>


                <div className="col-sm-6">
                  <div className="mb-3 row">
                    <div className="col-sm-6">
                      <button type="submit" className="btn btn-primary" >Registrar</button>
                    </div>
                    <div className="col-sm-6">
                      <Link to="/Inicio" className="btn btn-info"> Inicio</Link>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default RegistroEj
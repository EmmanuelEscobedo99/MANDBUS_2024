import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificacion.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";

import ComponenteDGles from "./Modificacion_Dgenerales";
import ComponenteDelitos from "./Modificacion_delitos"
import ComponenteProceso from "./Modificacion_Proceso";
import ComponenteAmparos from "./Modificacion_Amparos";
import ComponenteMinisterial from "./Modificacion_Ministerial";
import ComponenteColaboracion from "./Modificacion_Colaboracion";
import ComponenteImagen from "./Modificacion_Imagen";

const Modif_reg = () => {
  const navigate = useNavigate();


  const [llave, setLlave] = useState("");
  const [id_emisor, setId_emisor] = useState("");
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
  const [mostrarAviso, setMostrarAviso] = useState(true);
  const [datos, setDatos] = useState({});
  const [EmisorInicio, setEmisorInicio] = useState("");




  useEffect(() => {
    if (llave) {
      fetch(`http://localhost:8081/modificacion/datos/${llave}`)
        .then((data) => data.json())
        .then((val) => {
          setDatos(val);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [llave]);
  
  console.log("llave...",llave)  
  console.log("objeto de datos...",datos)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const var1 = queryParams.get("v1");
    const var2 = queryParams.get("v2");
  
    if (var1 && var2) {
      const clave = "001"; 
      const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(CryptoJS.enc.Utf8);
      const desencriptado2 = CryptoJS.AES.decrypt(var2, clave).toString(CryptoJS.enc.Utf8);  
      setLlave(desencriptado1);
      setEmisorInicio(desencriptado2); 

      console.log("***** ve emisor", desencriptado2)

    }
  }, [location.search]);
  
        // se manda a los componentes 
  const handleSeleccion = (componente) => {
    const clave = "001";
    const emisorEncriptado = CryptoJS.AES.encrypt(EmisorInicio, clave).toString();
    setComponenteSeleccionado(React.cloneElement(componente, { llave: llave, datos:datos, emisorEncriptado: emisorEncriptado }));
    setMostrarAviso(false); 
  };

  const handleFinalizar = () => {
    const url = `/`;   
    navigate(url);
  };


  useEffect(() => {
    if (EmisorInicio) {
      console.log("***********emisor desde inicio:", EmisorInicio);
    }
  }, [EmisorInicio]);
  
  console.log("emisor inicio", EmisorInicio);
  



  return (
    <>
      <Titulo></Titulo>
      <div className="modRegistro-componente">
        <div className="dialRegistro-componente">
          <div className="contenedor-menu">
            <div className="botones-contenedor">
              <button
                type="button"
                id="boton_menu"
                className="btn btn-primary"
                onClick={() => handleSeleccion(<ComponenteDGles />)}
              >
                Datos generales
              </button>
              <button
                type="button"
                id="boton_menu"
                className="btn btn-secondary"
                onClick={() => handleSeleccion(<ComponenteDelitos />)}
              >
                Delitos
              </button>

              <button
                type="button"
                id="boton_menu"
                className="btn btn-secondary"
                onClick={() => handleSeleccion(<ComponenteProceso />)}
              >
                Proceso
              </button>
              <button
                type="button"
                id="boton_menu"
                className="btn btn-success"
                onClick={() => handleSeleccion(<ComponenteAmparos />)}
              >
                Amparos
              </button>
              {/*  
              <button
                type="button"
                id="boton_menu"
                className="btn btn-danger"
                onClick={() => handleSeleccion(<ComponenteMinisterial />)}
              >
                Ministerial
              </button>
              */}
              <button
                type="button"
                id="boton_menu"
                className="btn btn-danger"
                
              >
                Ministerial
              </button>
             
             {/* 
                <button
                type="button"
                id="boton_menu"
                className="btn btn-warning"                
                onClick={() => handleSeleccion(<ComponenteColaboracion />) }
              >
                Colaboracion
              </button>
             
             */}
              <button
                type="button"
                id="boton_menu"
                className="btn btn-warning"                
                
              >
                Colaboracion
              </button>
               {/* 
                <button
                type="button"
                id="boton_menu"
                className="btn btn-info"
                onClick={() => handleSeleccion(<ComponenteImagen />)}
              >
                Imagen
              </button>
               
               */}

              <button
                type="button"
                id="boton_menu"
                className="btn btn-info"                
              >
                Imagen
              </button>
            </div>

            <div className="contenido">{componenteSeleccionado}</div>
                
            

            {mostrarAviso && (
              <div className="aviso_modificacion">
                <div className="mensaje-aviso">
                    
                     <h5>Selecciona un apartado para realizar una modificación </h5>
                  
                <button className="btn-finalizarM" onClick={handleFinalizar}> Salir de la Modificacion </button>  
                </div>
                
                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modif_reg;


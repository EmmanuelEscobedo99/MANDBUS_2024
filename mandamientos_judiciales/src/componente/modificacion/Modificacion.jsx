import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/baja.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { useLocation } from 'react-router-dom';

const Modificacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [llave_v, setLlave_v] = useState("");
  const [estatus, setEstatus] = useState([]);
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState([]);
  const [consultaActual, setConsultaActual] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 13;
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const registrosPaginaActual = resultados.slice(
    indicePrimerRegistro,
    indiceUltimoRegistro
  );
  const [emisor, setEmisor] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encryptedEmisor = queryParams.get('emisor');
    if (encryptedEmisor) {
      const clave = '001'; // Clave utilizada para cifrar
      const decryptedEmisor = CryptoJS.AES.decrypt(encryptedEmisor, clave).toString(CryptoJS.enc.Utf8);
      setEmisor(decryptedEmisor);
    }
  }, [location.search]);

  console.log("Componente cambio, emisor desde inicio:", emisor);

  const handleClickPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const numeroTotalPaginas = Math.ceil(resultados.length / registrosPorPagina);

  useEffect(() => {
    setConsultaActual(consulta);
    const delayDebounceFn = setTimeout(() => {
      if (consulta === consultaActual && consulta.trim() !== "") {
        realizarBusqueda();
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [consulta, consultaActual]);

  const realizarBusqueda = async () => {
    if (consulta.trim() !== "") {
      try {
        const response = await axios.get(
          `http://localhost:8081/baja/registros/${consulta}`
        );
        setResultados(response.data);
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      }
    } else {
      console.warn("Consulta vacía, no se realizará la búsqueda.");
    }
  };

  const handleChangeConsulta = (event) => {
    const valorConsulta = event.target.value;
    setConsulta(valorConsulta);
    if (valorConsulta.trim() === "") {
      setResultados([]);
    }
  };

  const handleClick = async (llave) => {
    if (llave) {
      try {
        console.log("LA LLAVE ES:", llave);
        const response = await fetch(`http://localhost:8081/modificacion/estatus/${llave}`);
        const val = await response.json();

        if (val && val.length > 0) {
          setEstatus(val);
          console.log("respuesta de la busqueda", val);
          setLlave_v(llave);
        } else {
          console.log("El valor viene vacío, redirigiendo...");
          const url = `/aviso`;
          navigate(url);
        }
      } catch (error) {
        console.error("Error fetching estatus:", error);
      }
    }
  };

  useEffect(() => {
    if (estatus.length > 0 && estatus[0].ESTATUS !== undefined) {
      console.log("tenemos valor", estatus[0].ESTATUS);
      handleCambiar();
    }
  }, [estatus]);

  const verificarValor = (valor) => {
    const lista = [3, 4, 6, 8, 9, 11];
    return lista.includes(valor);
  };

  const handleCambiar = () => {
    if (estatus.length > 0) {
      console.log("El estatus para verificar es:", estatus[0].ESTATUS);
      if (verificarValor(estatus[0].ESTATUS)) {
        const LLAVE = llave_v;        
        const kunci = LLAVE.toString();
        const sor = emisor.toString(); // variable desde titulo
        const cla = "001";
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;
        navigate(url);
      } else {
        console.log("El valor no está en la lista.");
        const url = `/aviso`;
        navigate(url);
      }
    }
  };

  return (
    <>
    <Titulo></Titulo>
    <div className="contendorPrincipal_baja">
      <div className="cont_baja">
        <br></br>
        <div className="lista-archivos">


          <div className="row">
              <div className="titulo-tabla">                
                 <h5>LISTA DE REGISTROS PARA REALIZAR UN CAMBIO</h5>
              </div>
            <div className="boton-busq-cambio">            
                <input
                 className="btn-bus-camb"
                 type="text"
                 value={consulta}
                 onChange={handleChangeConsulta}
                 placeholder="  Busqueda..."/>
              </div>
          </div>
          


          <div className="tabla-lista">
            <Table striped bordered hover>
              <thead>
                <tr>
                  
                  <th>IDENT</th>
                  <th>NOMBRE</th>
                  <th>A. PATERNO</th>
                  <th>A. MATERNO</th>
                  <th>EDAD</th>
                  <th>NO CAUSA</th>
                  <th>OFICIO JUZGADO</th>
                  <th>NO_MANDATO</th>
                  <th>MAS DETALLES</th>
                </tr>
              </thead>
              <tbody>
                {registrosPaginaActual.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.LLAVE}</td>
                    <td>{registro.NOMBRE}</td>
                    <td>{registro.APATERNO}</td>
                    <td>{registro.AMATERNO}</td>
                    <td>{registro.EDAD}</td>
                    <td>{registro.NO_CAUSA}</td>
                    <td>{registro.FECHA_OFICIO}</td>
                    <td>{registro.NO_MANDATO}</td>                   
                    <td>
                      <button
                        className="boton-ver"
                        onClick={() => handleClick(registro.LLAVE)}
                      >
                        ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>


          <div className="contro-cambio"> 
               <div className="row">
               <button className="bca"  onClick={() => handleClickPagina(paginaActual - 1)}
               disabled={paginaActual === 1}>
               Anterior
               </button>
               <button className="bca" onClick={() => handleClickPagina(paginaActual + 1)}
               disabled={paginaActual === numeroTotalPaginas}>
               Siguiente
              </button>

               </div>
                         </div>
          </div>

       
          

          
       
      </div>
    </div>
  </>
  );
};

export default Modificacion;



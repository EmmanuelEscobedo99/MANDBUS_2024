import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Mod_amp_agregar from "./Modificacion_Amparo_agregar";

const Modificacion_Amparos = ({ llave, datos, emisorEncriptado }) => {
  const navigate = useNavigate();


  const nombre = datos[0]?.NOMBRE || '';
  const apaterno = datos[0]?.APATERNO || '';
  const amaterno = datos[0]?.AMATERNO || '';
  const of_juz = datos[0]?.OFICIO_JUZGADO || '';

  const [datosSeleccionados, setDatosSeleccionados] = useState(null);
  const [registroAmparos, setRegistroAmparo] = useState(null);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [fechaActual, setFechaActual] = useState('');

  const [cat_entidades, setCat_entidades] = useState([]);
  const [cat_juzgados, setCat_juzgados] = useState([]);
  const [cat_resolucion, setCat_resolucion] = useState([]);

  const [amparoModificado, setAmparoModificado] = useState({
    FECHA_ACTUALIZACION: fechaActual,
    ID_AMPARO_EXT: "",
    HORA: "",
    LLAVE: llave,
    ID_ESTADO_JUZ: '',
    ID_JUZGADO: '',
    ID_RESOLUCION: ''
  });
    
  const [emisorInicio, setEmisorInicio] = useState("");
  useEffect(() => {
    if (emisorEncriptado) {
      const clave = "001";
      const desencriptado = CryptoJS.AES.decrypt(emisorEncriptado, clave).toString(CryptoJS.enc.Utf8);
      setEmisorInicio(desencriptado);
    }
  }, [emisorEncriptado]);


  useEffect(() => {
    if (emisorInicio) {
      // contiene el emisor
      console.log("Componente-amparo emisor desde inicio:", emisorInicio);
    }
  }, [emisorInicio]);    
    
    
    
    


  /*
  useEffect(() => {
    fetch("http://localhost:8081/amparos/idestadoemisor")
      .then((data) => data.json())
      .then((val) => setCat_entidades(val));
  }, []);

if(registroAmparos){
  console.log("todos los amparo datos",registroAmparos) 
  const est_juz=registroAmparos[0].ID_ESTADO_JUZ;
  console.log("estado", est_juz)
}            */
  

  /*
  useEffect(() => {
    if (registroAmparos[0].ID_ESTADO_JUZ) {
        fetch(`http://localhost:8081/amparos/idjuzgado/${registroAmparos[0].ID_ESTADO_JUZ}`)
            .then((data) => data.json())
            .then((val) => setCat_juzgados(val))
            .catch((error) => console.error("Error fetching juzgados:", error));
        }
        }, [registroAmparos[0].ID_ESTADO_JUZ]);
     */


  /*
  useEffect(() => {
    fetch("http://localhost:8081/amparos/idjuzgado")
      .then((data) => data.json())
      .then((val) => setCat_juzgados(val));
  }, []);
*/

/*
  useEffect(() => {
    fetch("http://localhost:8081/amparos/idresolucion")
      .then((data) => data.json())
      .then((val) => setCat_resolucion(val));
  }, []);*/




  const handleSeleccionar = async (amparo) => {
    setRegistroSeleccionado(amparo);      
    console.log("objeto selecionado es:", amparo)
    console.log("llave a enviar",llave)
  const idLlave=llave
  const LLAVE = llave;
  const EmisorInicio=emisorInicio

  const ID_ALTERNA = amparo.ID_ALTERNA
  const ID_EMISOR =amparo.ID_EMISOR;
  const ID_AMPARO_EXT = amparo.ID_AMPARO_EXT;
  const ID_TIPO_AMPARO = amparo.ID_TIPO_AMPARO;
  const NO_AMPARO = amparo.NO_AMPARO;
  const FECHA_AMPARO = amparo.FECHA_A;
  
  
  console.log("FECHA",amparo.FECHA_A)
  console.log("2 fecha",FECHA_AMPARO)
  const ID_ESTADO_JUZ =amparo.ID_ESTADO_JUZ;
  const ID_JUZGADO = amparo.ID_JUZGADO;
  const ID_RESOLUCION = amparo.ID_RESOLUCION; 
 


  const datos ={ID_ALTERNA, idLlave, LLAVE,EmisorInicio, ID_EMISOR, ID_AMPARO_EXT, ID_TIPO_AMPARO, NO_AMPARO, FECHA_AMPARO, ID_ESTADO_JUZ, ID_JUZGADO, ID_RESOLUCION }
   
  const jsonString = JSON.stringify(datos);    
  const secretKey = "001";    
  const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();   
  const url = `/mod_amp_sel?v1=${encodeURIComponent(encryptedData)}`;  
  navigate(url);
    
      
      
      
    
  };     
    
  useEffect(() => {
    if (llave) {
      fetch(`http://localhost:8081/modificacion/datos-amparos/${llave}`)
        .then((data) => data.json())
        .then((val) => {
          setRegistroAmparo(val);
        })
        .catch((error) => {
          console.error('Error al obtener el registro de proceso:', error);
        });
    }
  }, [llave]);

  const formatoDia = () => {
    const today = new Date();
    let dia = today.getDate();
    if (dia < 10) dia = '0' + dia.toString();
    let mes = today.getMonth() + 1;
    if (mes < 10) mes = '0' + mes.toString();
    let ano = today.getFullYear();
    const fecha = ano + "-" + mes + "-" + dia;

    let hora = today.getHours();
    if (hora < 10) hora = '0' + hora.toString();
    let minutos = today.getMinutes();
    if (minutos < 10) minutos = '0' + minutos.toString();
    const horaActual = hora + ":" + minutos;

    setFechaActual(fecha);
    setAmparoModificado((prevAmparoModificado) => ({
      ...prevAmparoModificado,
      FECHA_ACTUALIZACION: fecha,
      HORA: horaActual
    }));
  };

  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);

  

  const handleClickCancelar = () => {
    /*
    const LLAVE = llave;
    console.log('critar1', LLAVE);
    const kunci = LLAVE.toString();
    const cla = "001";
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}`;          */

    const url = `/`;
    navigate(url);
  };

 

    const handleNuevoRegistro = () => {          
    const ID_EMISOR = emisorInicio;
    const LLAVE = llave;  
    const delito_agregar ={
      ID_EMISOR, LLAVE
    }
    console.log("objeto a enviar (seleccionado)",delito_agregar)   
    const jsonString = JSON.stringify(delito_agregar);    
    const secretKey = "001";    
    const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();   
    const url = `/mod_amp_agregar?v1=${encodeURIComponent(encryptedData)}`;         
    navigate(url);                                                              
                                               
      
    };
  
    console.log("todos los amparo datos",registroAmparos) 

  return (
    <>
      <div className="componente-amp">
        <div className="datos-nmod-amp">
          <div className="row" id="lista-campos">
            <h5>Datos no modificables</h5>
            <div className="col-10">
              <label className="form-label">NOMBRE</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="AMATERNO"
                id="AMATERNO"
                placeholder=""
                defaultValue={nombre}
              />
            </div>

            <div className="col-10">
              <label className="form-label">A. PATERNO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={apaterno}
              />
            </div>

            <div className="col-10">
              <label className="form-label">A. MATERNO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={amaterno}
              />
            </div>

            <div className="col-10">
              <label className="form-label">OFICIO JUZGADO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={of_juz}
              />
            </div>
          </div>
        </div>

        <div className="datos-lista-amp">
          <div className="lista-amparos-amodificar">
            <h4>Amparos registrados</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>N° AMPARO</th>
                  <th>NUMERO DE AMPARO</th>
                  <th>FECHA DE AMPARO</th>
                  <th>MODIFICAR</th>
                </tr>
              </thead>
              <tbody>
                {registroAmparos && registroAmparos.map((amparo, index) => (
                  <tr key={index}>
                    <td>{amparo.ID_AMPARO_EXT}</td>
                    <td>{amparo.NO_AMPARO}</td>
                    <td>{amparo.FECHA_A}</td>
                    <td><button onClick={() => handleSeleccionar(amparo)} className="btn-select-amp">
                      Seleccionar
                    </button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="modificar-lista-amparos">
            <div className="btn-amparo-m">
              <button className="btn-mod-amp" onClick={handleNuevoRegistro}>Agregar Amparo</button>
              <button className="btn-can-amp" onClick={handleClickCancelar}>Salir</button>
            </div>
          </div>
        </div>
        <div>

    </div>
      </div>
    </>
  );
}

export default Modificacion_Amparos;


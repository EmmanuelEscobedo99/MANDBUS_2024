import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css"
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";

const Modificacion_Ministerial = ({ llave, datos }) => {
  const nombre = datos && datos[0] ? datos[0].NOMBRE : '';
  const apaterno = datos && datos[0] ? datos[0].APATERNO : '';
  const amaterno = datos && datos[0] ? datos[0].AMATERNO : '';
  const of_juz = datos && datos[0] ? datos[0].OFICIO_JUZGADO : '';

  
 

  const [turno, setTurno] = useState(null);
  const [ministerioPublico, setMinisterioPublico] = useState(null);
  const [nombreMP, setNombreMP] = useState(null);
  const [paternoMP, setPaternoMP] = useState(null);
  const [maternoMP, setMaternoMP] = useState(null);
  const [fechaActual, setFechaActual] = useState('');
  
  const [datosRegistrados, setDatosRegistrados] = useState(null);
  const [datosModificados, setDatosModificados] = useState({
        LLAVE: llave,
        FECHA_ACTUALIZACION:"",
        HORA:"",
        TURNO: turno,
        NO_MP: ministerioPublico,
        NOMBREMP: nombreMP,
        PATERNO_MP: paternoMP,
        MATERNO_MP: maternoMP  });
       
        useEffect(() => {
          console.log("objeto completo:", datosModificados);
        }, [datosModificados]);
        
        useEffect(() => {
          console.log("Valor de llave:", llave);
        }, [llave]);
        
        useEffect(() => {
          if (llave) {
            setDatosModificados(prevDatosModificados => ({
              ...prevDatosModificados,
              LLAVE: llave
            }));
          }
        }, [llave]);
        
        

  useEffect(() => {
    if (llave) { 
      fetch(`http://localhost:8081/modificacion/datos-ministerial/${llave}`)
        .then((data) => data.json())
        .then((val) => {
          setDatosRegistrados(val);
        })
        .catch((error) => {
          console.error('Error al obtener el registro de proceso:', error);
        });
    }
  }, [llave]);


  useEffect(() => {
    if (datosRegistrados) {
      setTurno(datosRegistrados[0]?.TURNO || '');
      setMinisterioPublico(datosRegistrados[0]?.NO_MP || '');
      setNombreMP(datosRegistrados[0]?.NOMBREMP || '');
      setPaternoMP(datosRegistrados[0]?.PATERNO_MP || '');
      setMaternoMP(datosRegistrados[0]?.MATERNO_MP || '');
      
      setDatosModificados({
        TURNO: datosRegistrados[0]?.TURNO || '',
        NO_MP: datosRegistrados[0]?.NO_MP || '',
        NOMBREMP: datosRegistrados[0]?.NOMBREMP || '',
        PATERNO_MP: datosRegistrados[0]?.PATERNO_MP || '',
        MATERNO_MP: datosRegistrados[0]?.MATERNO_MP || '',
        LLAVE: llave,
        FECHA_ACTUALIZACION: datosModificados.FECHA_ACTUALIZACION || '', 
        HORA: datosModificados.HORA || '',
      });

    }
  }, [datosRegistrados]);
  
   

   const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosModificados({
      ...datosModificados,
      [name]: value,
      
    });
  };


  const formatoDia = () => {
    const today = new Date();
    let dia = today.getDate();
    if (dia < 10)
    dia = '0' + dia.toString();
    let mes = today.getMonth() + 1;
    if (mes < 10)
    mes = '0' + mes.toString();
    let ano = today.getFullYear();
    const fecha = ano + "-" + mes + "-" + dia;
  
    let hora = today.getHours();
    if (hora < 10)
    hora = '0' + hora.toString();
    let minutos = today.getMinutes();
    if (minutos < 10)
    minutos = '0' + minutos.toString();
    const horaActual = hora + ":" + minutos;
   
    console.log(horaActual)
    setFechaActual(fecha);
    setDatosModificados((prevdatosModificados) => ({
    ...prevdatosModificados,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);  


  console.log("datos del objeto", datosModificados)

  const handleEnvioModificacion = (e) => {
    axios.post(`http://localhost:8081/modificacion/modif-minsterial/`, datosModificados)
    .then((response) => {
     
      console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
     
      console.error('Error al enviar la modificación:', error);
    });
  };
  













  return (
  <>
    <div className="componente-min">
      <div className="datos-nmod-min">
         
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
      <div className="datos-lista-min">

      <div>Modificacion_Ministerial{llave}</div>

        <div className="campo-modificacion-ministerial">
        <form >

<div className="mb-3 row">
  <div className="col-sm-4">
    <label className="form-label">TURNO</label>
    <input
      type="text"
      className="form-control"
      id="TURNO"
      name="TURNO"
      placeholder=""
      defaultValue={turno}  
      onChange={handleChange}   
    ></input>   
  </div>

  <div className="col-sm-4">
    <label className="form-label">
      N° MINISTERIO PUBLICO
    </label>
    <input
      type="text"
      className="form-control"
      name="NO_MP"
      id="NO_MP"
      placeholder=""
      defaultValue={ministerioPublico}
      onChange={handleChange}
    ></input>   
  </div>

</div>

<div className="mb-3 row">
    <div className="col-sm-4">
    <label className="form-label">
      NOMBRE DEL MINISTERIO PUBLICO
    </label>
    <input
      type="text"
      className="form-control"
      name="NOMBREMP"
      id="NOMBREMP"
      placeholder=""
      defaultValue={nombreMP}
      onChange={handleChange}
    ></input>
   
  </div>

  <div className="col-sm-4">
    <label className="form-label">
      APELLIDO PATERNO DEL MINISTERIO PUBLICO
    </label>
    <input
      type="text"
      className="form-control"
      name="PATERNO_MP"
      id="PATERNO_MP"
      placeholder=""
      defaultValue={paternoMP}
      onChange={handleChange}
    ></input>
    
  </div>

  <div className="col-sm-4">
    <label className="form-label">
      APELLIDO MATERNO DEL MP
    </label>
    <input
      type="text"
      className="form-control"
      name="MATERNO_MP"
      id="MATERNO_MP"
      placeholder=""
      defaultValue={maternoMP}
      onChange={handleChange}
    ></input>   
  </div>  
</div>
  <div className="mb-3 row">
    <div className="col-sm-3">
      <button type="submit" className="btn-regMin btn-primary" onClick={handleEnvioModificacion}>
        Modificar
      </button>
    </div>
    <div className="col-sm-3">
                                                   
    </div>
  </div>



      </form>


        </div>

      













      </div>
    </div>
  </>
    
  )
}

export default Modificacion_Ministerial
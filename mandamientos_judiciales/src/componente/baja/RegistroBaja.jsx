import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/reg_baja.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";

const RegistroBaja = () => {
  const navigate = useNavigate();
  const [llave, setLlave] = useState("");
  const [datos, setDatos] = useState("");
  const [error, setError] = useState(null);
  const [divBloqueado, setDivBloqueado] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  
  const [showOption1, setShowOption1] = useState(false);
  const [showOption2, setShowOption2] = useState(false);
  const [showOption3, setShowOption3] = useState(false);
 
  
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const [fecHora, setFecHora] = useState({
    fecha:"",  
    hora:"",
    
    }); 

    const [cancelado, setCancelado] = useState({
    LLAVE:"",  
    FECHA_ACTUALIZACION:fecHora["fecha"],
    HORA:fecHora.hora,
    FECHA_CANCELACION:"",
    ID_MOTIVO_CANCELACION:"",
    OFICIO_CANCELACION:"",   
    }); 

   const [prescripto, setPrescrito] = useState({
    LLAVE:"",
    FECHA_PRESCRIPCION:"",   
    FECHA_ACTUALIZACION:fecHora.fecha,
    HORA:fecHora.hora,      
   }); 

   const [cumplimentada, setCumplimentada] = useState({
    LLAVE:"",
    FECHA_CUMPLIMIENTO:"",         
    OFICIO_CUMPLE:"",
    FECHA_ACTUALIZACION:fecHora.fecha,
    HORA:fecHora.hora,
    });

   
useEffect(() => {
  if (fecHora.fecha === "") {
     console.log("actualizar fecha........")
    formatoDia();
  }

  const intervalId = setInterval(formatoDia, 60000); 
  return () => clearInterval(intervalId); 
}, []);  


 console.log(fecHora)
 console.log("objeto cancelado",cancelado) 
  useEffect(() => {
    if (datos && datos.length > 0) {
      setSelectedOption("opcion1"); // Establece la primera opción como seleccionada
      setShowOption1(true); // Muestra el contenido correspondiente a la primera opción
    }
  }, [datos]);
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const var1 = queryParams.get("v1");
    if (var1) {
      const clave = "001";
      const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(
        CryptoJS.enc.Utf8
      );
      setLlave(desencriptado1);

      setCancelado(prevState => ({
        ...prevState,
        LLAVE: desencriptado1
      }));

      setPrescrito(prevState => ({
        ...prevState,
        LLAVE: desencriptado1
      }));

      setCumplimentada(prevState => ({
        ...prevState,
        LLAVE: desencriptado1
      }));

    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (llave) {
        try {
          const response = await axios.get(
            `http://localhost:8081/baja/verificacion/${llave}`
          );
          setDatos(response.data);
          setDivBloqueado(false);
        } catch (error) {
          console.error(error.message);
          setError(error.response.data);
          setDivBloqueado(true);
        }
      }
    };

    fetchData();
  }, [llave]);

  const handleClickMenu = () => {
    const url = "/comba";
    navigate(url);
  };

  
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    setShowOption1(value === 'opcion1');
    setShowOption2(value === 'opcion2');
    setShowOption3(value === 'opcion3');   
  };

 
  useEffect(() => {
    fetch("http://localhost:8081/baja/motivo")
      .then((data) => data.json())
      .then((val) => setMotivoCancelacion(val));
  }, []);


  const handleCancelado = async() => {
     if (!cancelado.FECHA_CANCELACION) {
      alert("Por favor, selecciona la fecha de cancelación.");
      return;
     }  
   
    if (!cancelado.ID_MOTIVO_CANCELACION) {
      alert("Por favor, selecciona un motivo de cancelación.");
      return;
    }
  
    if (!cancelado.OFICIO_CANCELACION.trim()) {
      alert("Por favor, ingresa el número de oficio de cancelación.");
      return;
    }

    
    try {
      await axios.post("http://localhost:8081/baja/cancelado", {
        ...cancelado,
        
      });        
      alert("El nuevo registro ha sido modificado a CANCELADO ");
      const url = "/" 
      navigate(url);

    } catch (error) {
      console.error("Hubo un error al guardar el nuevo registro:", error);
      alert("este registro ha sido cancelado ");
    }
  };
 

  console.log("fecha cumplimienta",cumplimentada.FECHA_CUMPLIMIENTO)
  console.log("oficio cumple" , cumplimentada.OFICIO_CUMPLE)

  const handleCumplimentada = async () => {
    try {
      await axios.post("http://localhost:8081/baja/cumplimentada", {
        ...cumplimentada,
       
      });        
      alert("El nuevo registro ha sido modificado a CUMPLIMENTADA");
      const url = "/" 
      navigate(url);
    } catch (error) {
      console.error("Hubo un error al guardar el nuevo registro:", error);
      alert("el registro ha sido modificado");
       }    
  };
  


    console.log("fecha prescripto", prescripto.FECHA_PRESCRIPCION)


  const handlePrescrito = async() => {
    try {
      await axios.post("http://localhost:8081/baja/prescrito", {
        ...prescripto,
       
      });        
      alert("El nuevo registro ha sido modificado a  PRESCRIPTO");
      const url = "/" 
      navigate(url);
    } catch (error) {
      console.error("Hubo un error al guardar el nuevo registro:", error);
      alert("el registro ha sido modificado");
    }    
  };


  const handleCanceladoChange = (event) => {
    const { name, value } = event.target;
  
    // Actualizar el estado del objeto 'cancelado'
    setCancelado({
      ...cancelado,
      [name]: value,
    });
  };
  
  const handlePrescriptoChange = (event) => {
    const { name, value } = event.target;
  
    // Actualizar el estado del objeto 'prescripto'
    setPrescrito({
      ...prescripto,
      [name]: value,
    });
  };
  
  const handleCumplimentadaChange = (event) => {
    const { name, value } = event.target;
  
    // Actualizar el estado del objeto 'cumplimentada'
    setCumplimentada({
      ...cumplimentada,
      [name]: value,
    });
  };
  
// Función para formatear la fecha y hora actual
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

  // Actualizar el estado de fecha y hora
  setFecHora({
    fecha: fecha,
    hora: horaActual
  });

  // Actualizar el estado de los otros objetos que dependen de la fecha y hora
  setCancelado(prevState => ({
    ...prevState,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));

  setPrescrito(prevState => ({
    ...prevState,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));

  setCumplimentada(prevState => ({
    ...prevState,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));
};


  return (
    <>
      <Titulo></Titulo>
      <div className="componente_prici">
        <br></br>
        <div className="componente_registro">
          <div className={divBloqueado ? "aviso-error visible" : "aviso-error"}>
            {error && <p>Error: {error}</p>}
            <div className="b-regresar">
              <button onClick={handleClickMenu}>regresar</button>
            </div>
          </div>

          <div className={`datos ${divBloqueado ? "oculto" : ""}`}>
            <br></br>
            <br></br>
            <br></br>
            <h4>Datos del Registro</h4>
            <div>
              <div className="select-container">
                <label htmlFor="selectOption" className="label-select">
                  Selecciona una opción:
                </label>
                <select
                  id="selectOption"
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  <option value="opcion1">Cancelado</option>
                  <option value="opcion2">Cumplimentada</option>
                  <option value="opcion3">Prescrito</option>

                </select>
                <br></br>
                <br></br>
              
              </div>

              {datos &&
                datos.map((item, index) => (
                  <div key={index}>
                    <div className="lista-datosRB row">
                      <label htmlFor="disabledTextInput">Nombre</label>
                      <input
                        type="text"
                        defaultValue={item.NOMBRE}
                        className="form-control"
                        disabled
                        id="input-lista"
                      />
                      <label htmlFor="disabledTextInput">
                        Apellido paterno
                      </label>
                      <input
                        type="text"
                        defaultValue={item.APATERNO}
                        id="input-lista"
                        className="form-control"
                        disabled
                      />
                      <label htmlFor="disabledTextInput">
                        Apellido materno
                      </label>
                      <input
                        type="text"
                        defaultValue={item.AMATERNO}
                        id="input-lista"
                        className="form-control"
                        disabled
                      />
                      <label htmlFor="disabledTextInput">Mandato</label>
                      <input
                        type="text"
                        defaultValue={item.NO_MANDATO}
                        id="input-lista"
                        className="form-control"
                        disabled
                      />
                      <label htmlFor="disabledTextInput">Oficio juzgado</label>
                      <input
                        type="text"
                        defaultValue={item.OFICIO_JUZGADO}
                        id="input-lista"
                        className="form-control"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {showOption1 && (
            <div className="opcion1">
                 <div className="tit-can"> 
                 <h4>CANCELADO</h4>
                 </div>
                 <div className="barra-can"> 
                 <h4></h4>
                 </div>
                 
            
             <div className="div-fecha row">
              <div className="fecha">
                <label className="form-label">FECHA DE CANCELACION</label>
                <input
                  type="date"
                  className="form-control"
                  name="FECHA_CANCELACION"
                  id="FECHA_OFICIO"
                  placeholder=""                  
                  min="1900-00-01"
                  value={cancelado.FECHA_CANCELACION}
                  max={fecHora.fecha}
                  onChange={handleCanceladoChange}



                ></input>              
              </div>  

              <div className="motivo">
                <label className="form-label">MOTIVO CANCELACION</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_MOTIVO_CANCELACION"
                  id="ID_MOTIVO_CANCELACION"
                  placeholder=""
                  value={cancelado.ID_MOTIVO_CANCELACION}
                  onChange={handleCanceladoChange}
                >
                  <option disabled selected>
                    Seleccione un motivo{" "}
                  </option>
                  {motivoCancelacion.map((j) => (
                    <option key={j.CLAVE} value={j.CLAVE}>
                      {j.TIPO}
                    </option>
                  ))}
                </select>
               
              </div>


              <div className="oficio">
                <label className="form-label">
                 OFICIO DE CANCELACION
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="OFICIO_CANCELACION"
                  id="OFICIO_CANCELACION"
                  placeholder=""      
                  value={cancelado.OFICIO_CANCELACION}
                  onChange={handleCanceladoChange}
                  
                ></input>                
              </div> 
              <button type="button" className="btn-sig" id="b-fpre" onClick={handleCancelado}>
                    APLICAR
                  </button>                
              </div>
            </div>
          )}


          {showOption2 && (
            <div className="opcion1" >

                  <div className="tit-cum"> 
                  <h4>CUMPLIMENTADA</h4>
                 </div>
              

              <div className="barra-can"> 
                 
                 </div>
              
              <div className="div-fecha row">
              <div className="fecha">
                <label className="form-label">FECHA CUMPLIMIENTO</label>
                <input
                  type="date"
                  className="form-control"
                  name="FECHA_CUMPLIMIENTO"
                  id="FECHA_CUMPLIMIENTO"
                  placeholder=""                 
                  min="1900-00-01"
                  value={cumplimentada.FECHA_CUMPLIMIENTO}
                  max={fecHora.fecha}
                  onChange={handleCumplimentadaChange}
                ></input>              
              </div>  
               <div className="col-sm-4" id="oficio">
                <label className="form-label">
                 OFICIO CUMPLE
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="OFICIO_CUMPLE"
                  id="OFICIO_CUMPLE"
                  placeholder=""
                  value={cumplimentada.OFICIO_CUMPLE}
                  onChange={handleCumplimentadaChange}
                ></input>
                
              </div> 
              <button type="" className="btn-sig" id="b-fpre" onClick={handleCumplimentada}>
                    APLICAR
                  </button>                
              </div>   
              </div>
          )}


          {showOption3 && (
            <div className="opcion1">

                 <div className="tit-pre"> 
                 <h4>PRESCRIPTO</h4>
                 </div>
             

              <div className="barra-can"> 
                 
                 </div>

              <div className="div-fecha">
              <div className="fecha">
                <label className="form-label">FECHA DE PRESCRIPCION</label>
                <input
                  type="date"
                  className="form-control"
                  name="FECHA_PRESCRIPCION"
                  id="FECHA_PRESCRIPCION"
                  placeholder=""                 
                  min="1900-00-01"
                  value={prescripto.FECHA_PRESCRIPCION}
                  onChange={handlePrescriptoChange}
                  max={fecHora.fecha}

                ></input>              
              </div>  


              <button type="" className="btn-sig" id="b-fpre" onClick={handlePrescrito}>
                    APLICAR 
                  </button>

                
                </div>   
              


              {/* Contenido para la opción 3 */}
            </div>
          )}

          

        {/*   cierre componente registro   */}
        </div>  {/* cierre componente registro  */}
      </div>
    </>
  );

};

export default RegistroBaja;

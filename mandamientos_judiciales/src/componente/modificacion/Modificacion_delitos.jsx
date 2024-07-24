import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";

const Modificacion_delitos = ({ llave, datos, emisorEncriptado }) => {
    const navigate = useNavigate(); 
  console.log("objeto recibiendo datos**",datos)
  console.log("desemcryptada",emisorEncriptado)


  const alternaModificar =datos[0].ID_ALTERNA
  const id_emisor =datos[0].ID_EMISOR
  const nombre   = datos[0].NOMBRE
  const apaterno = datos[0].APATERNO
  const amaterno = datos[0].AMATERNO
  const of_juz   = datos[0].OFICIO_JUZGADO

  
  const [datosPrincipales, setDatosPrincipales] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [datosSeleccionados, setDatosSeleccionados] = useState(null);
  const [cat_delitos, setCat_delitos] = useState([]);
  
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [options2, setOptions2] = useState([]); 

  const [registroSeleccionado, setRegistroSeleccionado] = useState(false);
  const [delitosModificado, setDelitosModificado] = useState({    
    LLAVE: llave,    
    HORA:"",   
    ID_DELITO: "",
    ID_MODALIDAD: "",
    ID_DELITO_EXT:"",
    FECHA_ACTUALIZACION:""
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
      console.log("Comp-modificar-delitos emisor desde inicio:", emisorInicio);
    }
  }, [emisorInicio]);

    console.log("variable desemcryptada",emisorInicio)

  useEffect(() => {
    fetch("http://localhost:8081/delitos/iddelitos")
      .then((data) => data.json())
      .then((val) => setCat_delitos(val));
  }, []);

  
  useEffect(() => {
    const tablaDelitos = async () => {
      try {
        const response = await fetch(`http://localhost:8081/delitos/archivos/${llave}`);
        const val = await response.json();
        console.log("resultado",val)
        const secondaryQueries = [];
        for (const archivo of val) {
          const firstSecondaryQueryPromise = fetch(`http://localhost:8081/delitos/delito/${archivo.ID_DELITO}`)
            .then((response) => response.json())
            .then((delito) => {
              archivo.delito = delito;
            });
          const secondSecondaryQueryPromise = fetch(`http://localhost:8081/delitos/modalidad/${archivo.ID_MODALIDAD}`)
            .then((response) => response.json())
            .then((modalidad) => {
              archivo.modalidad = modalidad;
            });
          secondaryQueries.push(firstSecondaryQueryPromise, secondSecondaryQueryPromise);
        }
        await Promise.all(secondaryQueries);
        setArchivos(val);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
      }
    };

    tablaDelitos();
  }, [llave]); 
 
  console.log("TABLA", archivos);

  console.log("valor de emisor desde el inicio",emisorInicio)
  //   ////////////////////////////////////////////////////////////
  const handleSeleccionar = (ar) => {   
    console.log("Datos seleccionados:", ar);
    setDatosSeleccionados(ar);
    const idLlave= llave
    const EmisorInicio=emisorInicio;
    const idAlternaModificar = ar.ID_ALTERNA;
    const id_emisor = datos[0].ID_EMISOR;    
    const idDelitoExt = ar.ID_DELITO_EXT;
    const id_delito = ar.ID_DELITO;
    const id_delitoDescripcion = ar.delito[0].DESCRIP_DELITO;
    const id_modalidad = ar.ID_MODALIDAD;
    const modalidadDescripcion = ar.modalidad[0].DESCRIP_MODALIDAD;

    const delito_seleccionado ={
    idLlave,EmisorInicio,idAlternaModificar,id_emisor, idDelitoExt, id_delito, id_delitoDescripcion, id_modalidad, modalidadDescripcion
    }

  console.log("objeto a enviar (seleccionado)",delito_seleccionado)
   
  const jsonString = JSON.stringify(delito_seleccionado);    
  const secretKey = "001";    
  const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();   
  const url = `/selec_del?v1=${encodeURIComponent(encryptedData)}`;    
  navigate(url);
  };

  


  console.log("OBJETO ARCHIVOS",archivos)
  console.log("datosModificados objeto...",delitosModificado)

  const handleSelect1Change = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption1(selectedValue);
    axios
      .get(`http://localhost:8081/delitos/idmodalidad/${selectedValue}`)
      .then((response) => {
        setOptions2(response.data);
        setDelitosModificado((prevDelitosModificado) => ({
          ...prevDelitosModificado,
          ID_DELITO: selectedValue // Actualiza el ID_DELITO con el valor seleccionado
        }));
      })
      .catch((error) => {
        console.error(
          "Error al obtener las opciones del segundo select:",
          error
        );
      });
  };
    
  const handleSelect2Change = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption2(selectedValue);
    setDelitosModificado((prevDelitosModificado) => ({
      ...prevDelitosModificado,
      ID_MODALIDAD: selectedValue // Actualiza el ID_MODALIDAD con el valor seleccionado
    }));
  };
  
   
  const handleClickModificar = () => {  
    window.alert('Datos modificados: ' + JSON.stringify(delitosModificado)); 
    axios
    .post(`http://localhost:8081/modificacion/modif-del`,delitosModificado)
    .then((response) => {
      console.log(response.data);        
         alert("El Registro ha sido modificado")                
         window.location.reload();         
    })
    .catch((error) => {
      console.error("Hubo un error al modificar el registro:", error);
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
    console.log(fecha)
  
  setDelitosModificado((prevdelitosModificado) => ({
    ...prevdelitosModificado,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);  
   
  const handleCancelarModificacion = () => {   
    const url = `/`; 
    navigate(url);
  };

  console.log("la llave es:",llave)
  
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
  const url = `/mod_mas?v1=${encodeURIComponent(encryptedData)}`; 
  navigate(url);                                  
                                         
                                             
    
  };



  return (
    <>
      <div className="componente-del">
      <div className="datos-nmod-del">     
              <br></br>
              <br></br>
              <div className="row" id="lista-campos-del">
                <p>Datos no modificables</p>
                <div className="col-11">
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

                <div className="col-11">
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

                <div className="col-11">
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

                <div className="col-11">
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


        <div className="datos-lista-modif-delitos">
           <h4>Delitos registrados </h4> 
        <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>N°</th>
                     <th>DELITO</th>
                     <th>MODALIDAD</th>
                     <th>OPCION</th>
                                       
                   </tr>
                 </thead>
                 <tbody>
                   {archivos.map((ar, index) => {
                     console.log("mapeo",archivos)
                     return (            
                       <tr key={index}>
                         <td>{ar.ID_DELITO_EXT}</td>
                         <td>{ar.delito[0].DESCRIP_DELITO }</td>
                         <td>{ar.modalidad[0].DESCRIP_MODALIDAD }</td>
                         <td> <button className ="seleccionar_reg" onClick={() => handleSeleccionar(ar)}> selecionar </button> </td>                                       
                       </tr>
                     );
                   })}
                 </tbody>
               </Table>
         
        </div>


        <div className="modificacion-lista-del">
            <div >              
             <button id="b-modif-reg" onClick={handleNuevoRegistro}>Agregar nuevo registro</button>                     
           </div>
           <div >              
             <button id="b-modif-cancelar" onClick={handleCancelarModificacion}>Salir</button>                     
           </div>       
        </div>


        
      </div>
    </>
  );
};

export default Modificacion_delitos;

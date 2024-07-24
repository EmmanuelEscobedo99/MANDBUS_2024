import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css";
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { useSearchParams } from "react-router-dom";

const Modificacion_Amparo_agregar = () => {

    const [searchParams] = useSearchParams();
    const encryptedData = searchParams.get('v1');
    const secretKey = "001";

    const navigate = useNavigate();
    const [fechaActual, setFechaActual] = useState('');    
    const [cat_entidades, setCat_entidades] = useState([])
    const [cat_juzgados, setCat_juzgados] = useState([])
    const [cat_resolucion, setCat_resolucion] = useState([])
    const [cat_amparo, setCat_amparo] = useState([])
    const [llave, setLlave] = useState("");
    const [id_emisor, setId_emisor] = useState("");

    const operacion = "C";
    const [amparo, setAmparo] = useState({
        LLAVE:"",
        ID_EMISOR:"",
        FECHA_ACTUALIZACION:"",
        HORA:"",
        OPERACION:operacion,
        ID_TIPO_AMPARO:"",
        ID_ESTADO_JUZ: "",
        ID_JUZGADO:    "",
        ID_RESOLUCION: "",
        NO_AMPARO:     "",
        FECHA_AMPARO:  ""
    
      });

    useEffect(() => {
        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                const jsonString = bytes.toString(CryptoJS.enc.Utf8);
                const datosSeleccionados = JSON.parse(jsonString);              
    
                console.log(" recuperado", datosSeleccionados)
                setLlave(datosSeleccionados.LLAVE) 
                setId_emisor(datosSeleccionados.ID_EMISOR) 

                setAmparo((prevRegistro) => ({
                    ...prevRegistro,
                LLAVE: datosSeleccionados.LLAVE,
                ID_EMISOR: datosSeleccionados.ID_EMISOR
              }));
                
            } catch (error) {
                console.error("Error al desencriptar los datos:", error);
            }
        }
    }, [encryptedData]);
     
    console.log("objeto amparo",amparo)
    console.log("llave",llave)
    useEffect(() => {
        fetch("http://localhost:8081/amparos/idestadoemisor")
          .then((data) => data.json())
          .then((val) => setCat_entidades(val))
      }, [])
    

      console.log("id estado es", amparo.ID_ESTADO_JUZ)



      useEffect(() => {
        if (amparo.ID_ESTADO_JUZ) {
            fetch(`http://localhost:8081/amparos/idjuzgado/${amparo.ID_ESTADO_JUZ}`)
                .then((data) => data.json())
                .then((val) => setCat_juzgados(val))
                .catch((error) => console.error("Error fetching juzgados:", error));
            }
            }, [amparo.ID_ESTADO_JUZ]);
                                  
        
      useEffect(() => {
        fetch("http://localhost:8081/amparos/idresolucion")
          .then((data) => data.json())
          .then((val) => setCat_resolucion(val))
      }, [])
    
      useEffect(() => {
        fetch("http://localhost:8081/amparos/idtipoamparo")
          .then((data) => data.json())
          .then((val) => setCat_amparo(val))
      }, [])

  
    
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
        
        setFechaActual(fecha)        
        setAmparo((prevAmparo) => ({
            ...prevAmparo,
        FECHA_ACTUALIZACION: fecha,
        HORA: horaActual
      }));

    };

    useEffect(() => {
        formatoDia();
        const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
        return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
      }, []); 

    console.log ("objeto amparo",amparo)  

    const handleChange = (e) => {
        //formatoDia()
        const { name, value } = e.target;
        setAmparo((prev) => ({ ...prev, [name]: value.trim() }));
        
      /*
        if (name === "ID_JUZGADO") {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    
        if (name === "NO_AMPARO") {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }    */
      };
   
      const handleOtroClick = async (e) => {   
        e.preventDefault();
           
        if (!amparo.ID_TIPO_AMPARO ||  !amparo.ID_JUZGADO || !amparo.ID_RESOLUCION || !amparo.NO_AMPARO || !amparo.FECHA_AMPARO) {
            alert("Todos los campos son obligatosios, excepto ESTADO JUZGADO");
            return;
        }
        
          try {      
            await axios.post("http://localhost:8081/amparos/insamparosMod", amparo);    
            alert("El nuevo registro ha sido guardado correctamente ");
           
            setAmparo(prevAmparo => ({
              ...prevAmparo,
              ID_TIPO_AMPARO:"",
              ID_ESTADO_JUZ: "",
              ID_JUZGADO:    "",
              ID_RESOLUCION: "",
              NO_AMPARO:     "",
              FECHA_AMPARO:  ""
            }));
    
            document.getElementById("ID_TIPO_AMPARO").value = "";
            document.getElementById("ID_ESTADO_JUZ").value = "";
            document.getElementById("ID_JUZGADO").value = "";
            document.getElementById("ID_RESOLUCION").value = "";
            document.getElementById("NO_AMPARO").value = "";
            document.getElementById("FECHA_AMPARO").value = "";       
        /*    
        console.log('critar1',llave)        
        const kunci = llave.toString();        
        const cla = "001";        
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();              
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}`;   */
        
            const LLAVE= llave
            const EmisorInicio=id_emisor
            console.log('critar1',LLAVE)    
            const kunci = LLAVE.toString();  
            const sor=EmisorInicio.toString();  
            const cla = "001";    
            const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
            const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
            const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;
            navigate(url);           
    
          } catch (error) {
            console.error("Error al registrar:", error);
          }         
      };

      
      
    const handleClickMenu = () => {
      /*
        console.log('critar1',llave)        
        const kunci = llave.toString();        
        const cla = "001";        
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();              
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}`;      */
        
        const LLAVE= llave
        const EmisorInicio=id_emisor
        console.log('critar1',LLAVE)    
        const kunci = LLAVE.toString();  
        const sor=EmisorInicio.toString();  
        const cla = "001";    
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`; 

        navigate(url);  
    };
       

    return (
        <>
        <div className="componente_mod-amp-agregar">
          <div className="agregar_amp_modificacion">
            <h1 className="titulo-amp-agregar">
              Agregar Amparo 
            </h1>
             <br></br>
            <div className="cont_agregar_amp">
            <form >             
                <div className="col-sm-8" id="input">
                  <label className="form-label">NO. DE AMPARO</label>
                  <input
                    type="text"
                    className="form-control"
                    id="NO_AMPARO"
                    name="NO_AMPARO"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                 
                </div>              
                <br></br>
                <div className="col-sm-8"   id="input">
                  <label className="form-label">FECHA DE AMPARO</label>
                  <input
                    type="date"
                    className="form-control"
                    name="FECHA_AMPARO"
                    id="FECHA_AMPARO"
                    placeholder=""
                    max={fechaActual}
                    onChange={handleChange}
                  ></input>
                 
                </div>
                <br></br>
                <div className="col-sm-8" id="input" >
                    <label className="form-label">ESTADO_JUZGADO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_ESTADO_JUZ"
                      id="ID_ESTADO_JUZ"
                      placeholder=""
                      onChange={handleChange}>

                      <option  value=" ">Seleccione el estado del juzgado</option>
                      {cat_entidades.map((entidad) => (
                        <option key={`${entidad.ENTIDAD} ${entidad.ID_ESTADO}`} value={entidad.ID_ESTADO}>
                          {entidad.ENTIDAD}
                        </option>
                      ))}
                    </select>
                  </div>        
             
                  <br></br>
                <div className="col-sm-8"  id="input">
                    <label className="form-label">JUZGADO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_JUZGADO"
                      id="ID_JUZGADO"
                      placeholder=""
                      onChange={handleChange}>

                      <option disabled selected >Seleccione un Juzgado</option>
                      {cat_juzgados.map((juzgados) => (
                        <option key={`${juzgados.ID_JUZGADO} ${juzgados.DESCRIP_JUZGADO} `} value={juzgados.ID_JUZGADO}>
                          {juzgados.DESCRIP_JUZGADO}
                        </option>
                      ))}
                    </select>
                   
                  </div>
                   
                  <br></br>
                <div className="col-sm-8"  id="input">
                    <label className="form-label">RESOLUCION</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_RESOLUCION"
                      id="ID_RESOLUCION"
                      placeholder=""
                      onChange={handleChange}>

                      <option disabled selected  value=" ">Resoluciones</option>
                      {cat_resolucion.map((res) => (
                        <option key={res.TIPO} value={res.CLAVE}>
                          {res.TIPO}
                        </option>
                      ))}
                    </select>

                  </div>
                  <br></br>
                <div className="col-sm-8"  id="input">
                    <label className="form-label">TIPO DE AMPARO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_TIPO_AMPARO"
                      id="ID_TIPO_AMPARO"
                      placeholder=""
                      onChange={handleChange}>

                      <option disabled selected  value=" ">Tipos de amparos</option>
                      {cat_amparo.map((amparos) => (
                        <option key={amparos.TIPO} value={amparos.CLAVE}>
                          {amparos.TIPO}
                        </option>
                      ))}
                    </select>

                  </div>             
                  <br></br>
                  
                  <button type="button" className="btn btn-secondary" onClick={handleOtroClick} id="btn-regre">Registrar</button>
                  <button type="button" className="btn btn-secondary" onClick={handleClickMenu} id="btn-mo">salir</button>
                          {/* <Link to={`/MenuOpcional`} className="btn btn-info" id="btn-mo">
                      Menu opcional
                    </Link>    */} 
                       
                
            </form>
            </div>
          </div>
        </div>
      </>
    );
};

export default Modificacion_Amparo_agregar;

import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/amparo.css" 
import Table from 'react-bootstrap/Table';
import { validarAmparos } from "./validacionProceso";
import CryptoJS from 'crypto-js'; 


const Amparos = () => {
  
  
  const navigate = useNavigate();

  const [cat_entidades, setCat_entidades] = useState([])
  const [cat_juzgados, setCat_juzgados] = useState([])
  const [cat_resolucion, setCat_resolucion] = useState([])
  const [cat_amparo, setCat_amparo] = useState([])

  const [ultimoID,  setUltimoID] = useState('');
  const [nid,       setNid]      = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [errors, setErrors] = useState({});    
  const [archivos, setArchivos] = useState([]);
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState(''); 

  const operacion = "A";
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
         const queryParams = new URLSearchParams(location.search);
         const var1 = queryParams.get('v1');
         const var2 = queryParams.get('v2');

        if (var1 && var2) {
        const clave = '001'; // La misma clave utilizada para cifrar en el componente emisor
        const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(CryptoJS.enc.Utf8);
        const desencriptado2 = CryptoJS.AES.decrypt(var2, clave).toString(CryptoJS.enc.Utf8);

        setLlave(desencriptado1);
        setEmisor(desencriptado2);

        setAmparo((prevAmparo) => ({
        ...prevAmparo,
        LLAVE: desencriptado1,
        ID_EMISOR: desencriptado2
        }));
        }
        }, [location.search]);


 console.log("Amparos variable llave",llave)
 console.log("Amparos variable emisor",emisor)

 useEffect(() => {
  if (llave !== "") {
    tabla();
  }
}, [llave]);

   console.log("la llave a buscar es:", llave)
   const tabla = () =>{
    fetch(`http://localhost:8081/amparos/lista/${llave}`)            
      .then((data) => data.json())
      .then((val) => setArchivos(val));
  }

  useEffect(() => {
    fetch("http://localhost:8081/amparos/idestadoemisor")
      .then((data) => data.json())
      .then((val) => setCat_entidades(val))
  }, [])



  useEffect(() => {
    if (amparo.ID_ESTADO_JUZ) {
        fetch(`http://localhost:8081/amparos/idjuzgado/${amparo.ID_ESTADO_JUZ}`)
            .then((data) => data.json())
            .then((val) => setCat_juzgados(val))
            .catch((error) => console.error("Error fetching juzgados:", error));
        }
        }, [amparo.ID_ESTADO_JUZ]);





  /*
  useEffect(() => {
    fetch("http://localhost:8081/amparos/idjuzgado")
      .then((data) => data.json())
      .then((val) => setCat_juzgados(val))
  }, [])


  */

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

  
 

  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setAmparo((prev) => ({ ...prev, [name]: value.trim() }));
    

    if (name === "ID_JUZGADO") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === "NO_AMPARO") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
 
 

   
   //NUEVO HANDLE 
   const handleOtroClick = async (e) => {   
    e.preventDefault();
  
    const validationErrors = validarAmparos(amparo);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {      
        await axios.post("http://localhost:8081/amparos/insamparostemp", amparo);    
        alert("El nuevo registro ha sido guardado correctamente ");
        tabla();
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

      } catch (error) {
        console.error("Error al registrar:", error);
      } 
    }
  };



  console.log("objeto amparo", amparo)

  //registrar funcionando
  /*
  const handleOtroClick = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:8081/amparos/insamparostemp", amparo);
      alert("El nuevo registro ha sido guardado correctamente ");
      
      setAmparo({
       
        ID_TIPO_AMPARO:"",
        ID_ESTADO_JUZ: "",
        ID_JUZGADO:    "",
        ID_RESOLUCION: "",
        NO_AMPARO:     "",
        FECHA_AMPARO:  ""
      });

      // Actualizar campos de selección manualmente
      document.getElementById("ID_TIPO_AMPARO").value = "";
      document.getElementById("ID_ESTADO_JUZ").value = "";
      document.getElementById("ID_JUZGADO").value = "";
      document.getElementById("ID_RESOLUCION").value = "";
      document.getElementById("NO_AMPARO").value = "";
      document.getElementById("FECHA_AMPARO").value = "";
      
       // Recargar la página
      window.location.reload();



    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };     */ // FIN DEL HANDLE CLICK


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
     setFechaActual(fecha);
     setAmparo((prevRegistro) => ({
        ...prevRegistro,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);  
 

  
    const handleClickMenu = () => {
      console.log('critar1',llave)
      console.log('critar2',emisor)
      const kunci = llave.toString();
      const pemancar = emisor.toString();
      const cla = "001";      
      const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
      const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
      const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
      navigate(url);

  };
  

  return (
    <>
      <Titulo></Titulo>
      <div className="cont_amparo">
        <div className="conte_reg_amp">
          <div className="mb-6 row">          
          <br></br>
            <h3>AMPAROS</h3>
                    
               <form className="formul">             
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
                  {errors?.NO_AMPARO && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_AMPARO}</p>}
                                 
                </div>              

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
                  {errors?.FECHA_AMPARO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_AMPARO}</p>}
                </div>

                <div className="col-sm-8" id="input" >
                    <label className="form-label">ESTADO_JUZGADO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_ESTADO_JUZ"
                      id="ID_ESTADO_JUZ"
                      placeholder=""
                      onChange={handleChange}>

                    <option selected disabled >Seleciona un juzgado</option>
                      {cat_entidades.map((entidad) => (
                        <option key={`${entidad.ENTIDAD} ${entidad.ID_ESTADO}`} value={entidad.ID_ESTADO}>
                          {entidad.ENTIDAD}
                        </option>
                      ))}
                    </select>
                  </div>        
             

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
                    {errors?.ID_JUZGADO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_JUZGADO}</p>}
                  </div>
                  

                <div className="col-sm-8"  id="input">
                    <label className="form-label">RESOLUCION</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_RESOLUCION"
                      id="ID_RESOLUCION"
                      placeholder=""
                      onChange={handleChange}>

                    <option selected disabled >Seleciona una resolucion</option>
                      {cat_resolucion.map((res) => (
                        <option key={res.TIPO} value={res.CLAVE}>
                          {res.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_RESOLUCION && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_RESOLUCION}</p>}
                  </div>

                <div className="col-sm-8"  id="input">
                    <label className="form-label">TIPO DE AMPARO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_TIPO_AMPARO"
                      id="ID_TIPO_AMPARO"
                      placeholder=""
                      onChange={handleChange}>
                      <option value="" >Tipos de amparos</option>
                      {cat_amparo.map((amparos) => (
                        <option key={amparos.TIPO} value={amparos.CLAVE}>
                          {amparos.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_TIPO_AMPARO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_TIPO_AMPARO}</p>}
                  </div>             
                   
                   <div className="btn-regsig"></div>
                  
                  <button type="button" className="btn btn-secondary" onClick={handleOtroClick} id="btn-regre">Registrar</button>
                  <button type="button" className="btn btn-secondary" onClick={handleClickMenu} id="btn-mo">Ir al menu opcional</button>
                          {/* <Link to={`/MenuOpcional`} className="btn btn-info" id="btn-mo">
                      Menu opcional
                    </Link>    */} 
                       
                
            </form>
          </div>
        </div>

        <div className="contenedor_lista" >
         
          <div className="archi">
                
                <h4>LISTA DE AMPAROS</h4>
               
                <br></br>
                <br></br>
                <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>AMPARO</th>
                     <th>FECHA</th>
                                       
                   </tr>
                 </thead>
                 <tbody>
                   {archivos.map((ar, index) => {
                     return (
                       <tr key={index}>
                         <td>{ar.NO_AMPARO}</td>
                         <td>{ar.fecha_amparo}</td>
                                                                
                       </tr>
                     );
                   })}
                 </tbody>
               </Table>
             </div>


            
          
        </div>
        

      </div>
    </>
  );
};

export default Amparos;

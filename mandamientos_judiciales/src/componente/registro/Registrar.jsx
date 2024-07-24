import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/registro.css";
import { Modal, Button } from 'react-bootstrap'; // Importar modal y botón de Bootstrap
import { validarDatos } from "./validacionProceso";
import CryptoJS from 'crypto-js';
import { useLocation } from 'react-router-dom';

  const Registrar = () => {


  const navigate = useNavigate();
  const location = useLocation();
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




  // valor predeterminado para emisor
  const EmisorInicio=emisor;
  console.log("emisor desde inicio",emisor)
  console.log("valor asignado a nueva variable",EmisorInicio)

  const [registroEnProceso, setRegistroEnProceso] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true); 


  const [cat_sexo, setCat_sexo] = useState([]);
  const [cat_nacionalidad, setCat_nacionalidad] = useState([]);
  const [cat_juz, setCat_juz] = useState([]);
  const [cat_cuantia, setCat_cuantia] = useState([]);
  const [id_emisor, setIdemisor] = useState([]);
  const [municipio, setMuni] = useState([]);
  
 
  const [errors, setErrors] = useState({});
  const [uso, setUso] = useState([]);
  const [fechaActual, setFechaActual] = useState(''); 
  const [IDEmisor, setIDEmisor] = useState('');

  
  
    const [registro, setRegistro] = useState({
    ID_ALTERNA:"",
    ID_EMISOR:EmisorInicio,
    FECHA_ACTUALIZACION:"",
    HORA:"",
    NO_MANDATO: "",
    ID_MUNICIPIO:"",
    NOMBRE: "",
    APATERNO: "",
    AMATERNO: "",
    ALIAS: "",
    EDAD: "",
    ESTATURA: "",
    PESO: "",
    ID_SEXO: "",
    ID_USO_ANTEOJOS: "",
    ID_NACIONALIDAD: "",
    ID_JUZGADO: "",
    NO_CAUSA: "",
    OFICIO_JUZGADO: "",
    FECHA_OFICIO: "",
    ID_TIPO_CUANTIA: "",
    LLAVE:""
    });
  
   
    useEffect(() => {
     
      setRegistro(prevRegistro => ({
        ...prevRegistro,
        ID_EMISOR: emisor
      }));
    }, [emisor]);




  
  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/anteojos")
      .then((data) => data.json())
      .then((val) => {        
        setUso(val); 
      });
  }, []);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/datos-generales/idemisor');
        setIdemisor(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idmunicipios")
      .then((data) => data.json())
      .then((val) => {        
        setMuni(val); 
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idsexo")
      .then((data) => data.json())
      .then((val) => setCat_sexo(val));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idnacionalidad")
      .then((data) => data.json())
      .then((val) => setCat_nacionalidad(val));
  }, []);

  //  cat juzgado......


  useEffect(() => {
    fetch(`http://localhost:8081/datos-generales/idjuzgado`)
      .then((data) => data.json())
      .then((val) => setCat_juz(val));
  }, []);


   

  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idtipocuantia")
      .then((data) => data.json())
      .then((val) => setCat_cuantia(val));
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistro((prev) => ({ ...prev, [name]: value.trim() }));
  };
  
  
  
        console.log("objeto", registro)
  const handleClick = async (e) => {   
    e.preventDefault();
   
    const validationErrors = validarDatos(registro);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0 ) {
      try {      
        const response = await fetch("http://localhost:8081/datos-generales/llave");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        const llaveId = parseInt(data.llave_id ?? 0) + 1; 
        const ultimoIdAlterna = parseInt(data.ultimo_id ?? 0) + 1; 
        
        console.log("****Llave :", llaveId);
       console.log("****ID alterna:", ultimoIdAlterna);  
        
        setIDEmisor(1)
       
       await axios.post("http://localhost:8081/datos-generales/insdatosgeneralestemp", {
          ...registro,
          ID_ALTERNA: ultimoIdAlterna,
          LLAVE: llaveId
        });   
        
        console.log('critar1',llaveId)
        console.log('critar2',EmisorInicio)
        const kunci = llaveId.toString();
        const pemancar = EmisorInicio.toString();
       // const pemancar = registro.ID_EMISOR.toString();
        
        const cla = "001";        
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();
                 
        const url = `/Delitos?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
        alert("El nuevo registro ha sido guardado correctamente ");
        navigate(url);
      } catch (error) {
        console.error("Error al registrar:", error);
      } finally {
        setRegistroEnProceso(false);  
      }
    }
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

  setFechaActual(fecha);
  setRegistro((prevRegistro) => ({
    ...prevRegistro,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));

};

useEffect(() => {
  formatoDia(); 
  
}, []); 

useEffect(() => {
  setIDEmisor(registro.ID_EMISOR); // Actualiza idEmisor cada vez que registro.ID_EMISOR cambie
}, [registro.ID_EMISOR]);


 
  
  return (
    
    <>        
          <Titulo></Titulo>
      <div className="contenedor_registro"> 
       <div className="barra-lateralR">
       </div>
        <div className="contenedor_princ">        
        <div className="ct">            
          <form className="for-reg" onSubmit={handleClick}>           
            <div className="div-titulo">
            <h3>INICIO REGISTRO</h3>
            </div>
            
            <div className="mb-6 row " id="div-primero" >
              
                <div className="col-sm-6" id="div-reg4">
                <label className="form-label">NUMERO DE MANDATO</label>
                <input
                  type="text"
                  className="form-control"
                  id="NO_MANDATO"
                  name="NO_MANDATO"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                 {errors?.NO_MANDATO && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_MANDATO}</p>}
              </div>

              <div className="col-sm-6" id="div-reg4" >
                <label className="form-label">MUNICIPIO </label>
                <select
                  type="text"
                  className="form-control"
                  id="ID_MUNICIPIO"
                  name="ID_MUNICIPIO"
                  placeholder=""
                  onChange={handleChange}
                >
                  <option selected disabled value="">
                    Selecione un municipio
                  </option>
                  {                  
                  municipio.map((emi) => (
                    
                    <option key={emi.MUNICIPIO} value={emi.CLAVE_MPIO}>
                      {emi.MUNICIPIO}
                    </option>
                  ))}
                </select>                
              </div>  

            </div>

            <div className="mb-6 row"> 

              <div className="mb- row">           
                <div className="col-sm-1" id="div-reg">
                <label className="form-label">NOMBRE</label>
                <input
                  type="text"
                  className="form-control"
                  id="NOMBRE"
                  name="NOMBRE"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                {errors?.NOMBRE && <p style={{ color: "red", fontSize: "13px" }}>{errors.NOMBRE}</p>}
                </div>

                <div className="col-sm-4" id="div-reg">
                <label className="form-label">APELLIDO PATERNO</label>
                <input
                  type="text"
                  className="form-control"
                  id="APATERNO"
                  name="APATERNO"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                {errors?.APATERNO && <p style={{ color: "red", fontSize: "13px" }}>{errors.APATERNO}</p>}
                </div>

                <div className="col-sm-4" id="div-reg">
                <label className="form-label">APELLIDO MATERNO</label>
                <input
                  type="text"
                  className="form-control"
                  name="AMATERNO"
                  id="AMATERNO"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                {errors?.AMATERNO && <p style={{ color: "red", fontSize: "13px" }}>{errors.AMATERNO}</p>}
                </div>

                <div className="col-sm-4" id="div-reg">
                <label className="form-label">ALIAS</label>
                <input
                  type="text"
                  className="form-control"
                  name="ALIAS"
                  id="ALIAS"
                  placeholder=""
                  onChange={handleChange}
                ></input>               
                </div>   
     
              </div>    
              
              <div className="col-sm-1" id="div-reg2"   >
                <label className="form-label">EDAD</label>
                <input
                  type="text"
                  className="form-control"
                  name="EDAD"
                  id="EDAD"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                {errors?.EDAD && <p style={{ color: "red", fontSize: "13px" }}>{errors.EDAD}</p>}
              </div>

              <div className="col-sm-1"  id="div-reg2"  >
                <label className="form-label">ESTATURA </label>
                <input
                  type="text"
                  className="form-control"
                  name="ESTATURA"
                  id="ESTATURA"
                  placeholder="en cm"
                  onChange={handleChange}
                ></input>
                 {errors?.ESTATURA && <p style={{ color: "red", fontSize: "13px" }}>{errors.ESTATURA}</p>}
              </div>

              <div className="col-sm-1"  id="div-reg2"  >
                <label className="form-label">PESO </label>
                <input
                  type="text"
                  className="form-control"
                  name="PESO"
                  id="PESO"
                  placeholder="en Kg"
                  onChange={handleChange}
                ></input>
                 {errors?.PESO && <p style={{ color: "red", fontSize: "13px" }}>{errors.PESO}</p>}
              </div>

              <div className="col-sm-2"  id="div-reg3"  >
                <label className="form-label">SEXO </label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_SEXO"
                  id="ID_SEXO"
                  placeholder=""
                  onChange={handleChange}
                >
                  <option selected disabled value=" ">
                  seleccionar
                  </option>
                  {cat_sexo.map((sex) => (
                    <option key={sex.TIPO} value={sex.CLAVE}>
                      {sex.TIPO}
                    </option>
                  ))}
                </select>
                {errors?.ID_SEXO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_SEXO}</p>}
              </div>

              <div className="col-sm-2"  id="div-reg3"  >
                <label className="form-label">USO DE ANTEOJOS</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_USO_ANTEOJOS"
                  id="ID_USO_ANTEOJOS"
                  placeholder=""
                  onChange={handleChange}
                >
                       <option selected disabled value=" ">
                  seleccionar
                  </option>
                  {uso.map((sex) => (
                    <option key={sex.id} value={sex.uso}>
                      {sex.descripcion}
                    </option>
                  ))}

                </select>
              </div>

              <div className="col-sm-2"   id="div-reg"  >
                <label className="form-label">NACIONALIDAD</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_NACIONALIDAD"
                  id="ID_NACIONALIDAD"
                  placeholder=""
                  onChange={handleChange}
                >
                  <option selected disabled>
                    Seleccione 
                  </option>
                  {cat_nacionalidad.map((naci, index) => (
                    <option key={index} value={naci.CLAVE}>
                      {naci.NACIONALIDAD}
                    </option>
                  ))}
                </select>
              </div>

               <div className="col-sm-3"  id="div-reg"  >
                <label className="form-label">ESTADO JUZGADO</label>
                <input disabled
                  type="text"
                  className="form-control"
                  name="ID_ESTADO_JUZGADO"
                  id="ID_ESTADO_JUZGADO"
                  placeholder="DURANGO"
                  onChange={handleChange}
                ></input>
               </div>

            </div>




             <div className="mb-3 row">               
            
              <div className="col-sm-4" id="div-reg4" >
                <label className="form-label">JUZGADO</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_JUZGADO"
                  id="ID_JUZGADO"
                  placeholder=""
                  onChange={handleChange}
                >
                  <option selected disabled>
                    Seleccione un juzgado{" "}
                  </option>
                  {cat_juz.map((j) => (
                    <option key={j.ID_JUZGADO} value={j.CLAVE_JUZGADO}>
                      {j.DESCRIP_JUZGADO}
                    </option>
                  ))}
                </select>
                {errors?.ID_JUZGADO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_JUZGADO}</p>}
              </div>

              <div className="col-sm-4" id="div-reg4" >
                <label className="form-label">NUMERO DE CAUSA</label>
                <input
                  type="text"
                  className="form-control"
                  name="NO_CAUSA"
                  id="NO_CAUSA"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                {errors?.NO_CAUSA && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_CAUSA}</p>}
              </div>

              <div className="col-sm-4" id="div-reg4" >
                <label className="form-label">
                  OFICIO MEDIANTE EL CUAL SE SOLICITA LA EJECUCION DEL MANDATO
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="OFICIO_JUZGADO"
                  id="OFICIO_JUZGADO"
                  placeholder=""
                  onChange={handleChange}
                ></input>
                 {errors?.OFICIO_JUZGADO && <p style={{ color: "red", fontSize: "13px" }}>{errors.OFICIO_JUZGADO}</p>}
              </div>
             
            </div>

            <div className="mb-3 row"  id="div-final">
              <div className="col-sm-4" id="div-reg4">
                <label className="form-label">FECHA DE OFICIO</label>
                <input
                  type="date"
                  className="form-control"
                  name="FECHA_OFICIO"
                  id="FECHA_OFICIO"
                  placeholder=""
                  onChange={handleChange}
                  min="1900-00-01"
                  max={fechaActual}
                ></input>
                {errors?.FECHA_OFICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.OFECHA_OFICIO}</p>}
              </div>

              <div className="col-sm-4" id="div-reg4">
                <label className="form-label">TIPO DE CUANTIA</label>
                <select
                  type="text"
                  className="form-control"
                  id="ID_TIPO_CUANTIA"
                  name="ID_TIPO_CUANTIA"
                  placeholder=""
                  onChange={handleChange}
                >
                  <option selected disabled>
                    Seleccione un cuantia
                  </option>
                  {cat_cuantia.map((naci, index) => (
                    <option key={index} value={naci.CLAVE}>
                      {naci.TIPO}
                    </option>
                  ))}
                </select>
                {errors?.ID_TIPO_CUANTIA && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_TIPO_CUANTIA}</p>}
              </div>
              
            </div>

            <div className="b-btn-reg">   </div>

            <div className="row" id="botones-regi">                             
                  <button type="submit" id="btn-r1">
                    Registrar
                  </button>                 
                  <a href="/" id="btn-r3" > Cancelar registro</a>                     
              </div>

                 
           
                          
          </form>     
         </div>
        </div>


      </div>
   
      

     
    </>
  );
};

export default Registrar;

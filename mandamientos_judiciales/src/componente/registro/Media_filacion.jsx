import Menu from "../menu/MenuLateral"
import Titulo from "../menu/Titulo"
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/mediafili.css" 
import { validarMediaFiliacion } from "./validacionProceso";
import { Modal, Button } from 'react-bootstrap';
import CryptoJS from 'crypto-js'; 
             
               



  const Media_filacion = () => {
  
  const navigate = useNavigate();

  const [archivos, setArchivos] = useState([]);
  const [cat_filiacion, setCat_filiacion] = useState([])
  const [cat_vfiliacion, setCat_vfiliacion] = useState([])
  const [fechaActual, setFechaActual] = useState('');
  const [valorFiliacionOptions, setValorFiliacionOptions] = useState([]); 
  const [datos, setDatos] = useState('');
  const [errors, setErrors] = useState({});
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');

  const IDFiliacionRef = useRef(null);
  const IDValorFiliacionRef = useRef(null);
  const NOConsecutivoRef = useRef(null);
 
  const [media_filiacion, setMediaFiliacion] = useState({   
    FECHA_ACTUALIZACION:"",
    HORA:"",
    LLAVE:"",
    FECHA_ACTUALIZACION:"",
    HORA:"", 
    ID_FILIACION: "",
    ID_VALOR_FILIACION: "",
    NO_CONSECUTIVO: "",   
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

   setMediaFiliacion((prevMediaFiliacion) => ({
   ...prevMediaFiliacion,
   LLAVE: desencriptado1,
   ID_EMISOR: desencriptado2
   }));
   }
   }, [location.search]);


console.log("media fili variable llave",llave)
console.log("media fili variable emisor",emisor)
  
  const obtenerDatosTabl = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/media-filiacion/datos/${llave}`);
      const archivosConDescripcion = await Promise.all(response.data.map(async (ar) => {      
        const id = ar.ID_FILIACION;
        const valor = ar.ID_VALOR_FILIACION;        
        let descripcion = ''; 
        let descripcionTipo = '';   
        try {         
          const descripcionResponse = await axios.get(`http://localhost:8081/media-filiacion/convertir/${id}`);       
          descripcion = descripcionResponse.data.descripcion;     
          
          const descripcionTipoResponse = await axios.get(`http://localhost:8081/media-filiacion/tipo/${id}/${valor}`); 
          descripcionTipo = descripcionTipoResponse.data.descripcion;      
    
        } catch (error) {
          // Si ocurre un error, lo manejamos aquí
          console.error('Error al obtener la descripción:', error);
          // Puedes asignar un valor predeterminado o vacío a la descripción en caso de error
          descripcion = 'No disponible';
          descripcionTipo = 'No disponible'; // Asignamos un valor predeterminado o vacío
        }
                  
        // Retornar un nuevo objeto con la descripción agregada
        return { ...ar, descripcionFiliacion: descripcion, tipoFiliacion: descripcionTipo };
      }));
      setArchivos(archivosConDescripcion);
    } catch (error) {
      // Manejar cualquier error que ocurra durante la ejecución de la función
      console.error('Error al obtener la lista de archivos:', error);
    }
  };
  
  useEffect(() => {
    if (llave !== "") {
      obtenerDatosTabl();
    }
  }, [llave]);
  



  // Efecto que se ejecuta cada minuto para actualizar los datos de la tabla
  useEffect(() => {
    const intervalId = setInterval(() => {
      obtenerDatosTabl();
    }, 60000); // Ejecutar cada minuto
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, [archivos]); 

   // Obtener datos de Filiacion
  useEffect(() => {
    fetch("http://localhost:8081/media-filiacion/idtipofiliacion")
      .then((data) => data.json())
      .then((val) => setCat_filiacion(val))
  }, [])

  

   console.log(datos)

  const handleChangeFiliacion = async (e) => {
    const { value } = e.target;
    
   
    setCat_vfiliacion([]);

    setMediaFiliacion((prev) => ({ ...prev, ID_FILIACION: value }));


    try {
      const response = await axios.get(`http://localhost:8081/media-filiacion/valorfiliacion/${value}`);
      setCat_vfiliacion(response.data);
    } catch (error) {
      console.error('Error al obtener datos de valor de filiacion:', error);
    }
  };





  

  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setMediaFiliacion((prev) => ({ ...prev, [name]: value.trim() }));


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
  setFechaActual(fecha);
  setMediaFiliacion((prevRegistro) => ({
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



    
  const handleClick = async (e) => {   
    e.preventDefault();

    const validationErrors = validarMediaFiliacion(media_filiacion);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 ) {
  
    try {           

      axios.post("http://localhost:8081/media-filiacion/insmediafiliaciontemp", media_filiacion);
      alert("El nuevo registro ha sido guardado correctamente ");      
       obtenerDatosTabl();

       setMediaFiliacion({
        ...media_filiacion,
        ID_FILIACION: "",
        ID_VALOR_FILIACION: "",
        NO_CONSECUTIVO: "",
    });
      
      IDFiliacionRef.current.value = "";
      IDValorFiliacionRef.current.value = "";
      NOConsecutivoRef.current.value = "";
      
    } catch (error) {
      console.error("Error al registrar:", error);
      } 
      }
    };

     // Función para manejar el clic en el botón de detalles
  const handleDetallesClick = (ar) => {
    setArchivoSeleccionado(ar);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setArchivoSeleccionado(null);
  };


  
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
  

   console.log("media filiacion", media_filiacion)

  return (
    <>
      <Titulo></Titulo>   

      <div className="contenedor_media_fili">
        <div className="contenedor_p_media">
          <form onSubmit={handleClick}>
           
              <h3>Media filiacion</h3>
             
            <div className="mb-3 row">
            <div className="col-sm-10">
                
                <label className="form-label">Filiacion</label>
                <select
                  ref={IDFiliacionRef}
                  type="text"
                  className="form-control"
                  name="ID_FILIACION"
                  id="ID_FILIACION"
                  placeholder=""
                  onChange={handleChangeFiliacion}>

                  <option selected disabled >Seleciona una Filiacion</option>
                  {cat_filiacion.map((filiacion) => (
                    <option key={`${filiacion.DESCRIPCION}-${filiacion.CLAVE}`} value={filiacion.CLAVE}>
                      {filiacion.DESCRIPCION}
                    </option>
                  ))}
                </select>
                {errors?.ID_FILIACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_FILIACION}</p>}
  
              </div>           
                 <br></br>
              <div className="col-sm-10">
                <label className="form-label">Valor filiacion</label>
                <select
                  ref={IDValorFiliacionRef}
                  type="text"
                  className="form-control"
                  name="ID_VALOR_FILIACION"
                  id="ID_VALOR_FILIACION"
                  placeholder=""
                  onChange={handleChange}>

                  <option disabled selected  value="">Valor de filiacion</option>
                  {cat_vfiliacion.map((vfiliacion) => (
                    <option key={`${vfiliacion.CLAVE}-${vfiliacion.TIPO_MF}`} value={vfiliacion.TIPO_MF}>
                     { vfiliacion.TIPO_MF}  - {vfiliacion.DESCRIPCION} 
                    </option>
                  ))}
                </select>
                {errors?.ID_VALOR_FILIACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_VALOR_FILIACION}</p>}
              </div>

              <div className="col-sm-10">
                <label className="form-label">N° consecutivo    </label>
                <input  ref={NOConsecutivoRef} type="text" className="form-control" name="NO_CONSECUTIVO" id="NO_CONSECUTIVO" placeholder="" onChange={handleChange}></input>
                {errors?.NO_CONSECUTIVO && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_CONSECUTIVO}</p>}
              </div>
            </div>          
           <br></br>
           <br></br>
           <br></br>
           <br></br>
            
              <div className="row">
                <div className="col-sm-6">
                  <button type="submit" className="b-mf ">
                    Registrar
                  </button>
                </div>
                <div className="col-sm-6">
                <button type="submit" className="b-mf " onClick={handleClickMenu}>
                    ir a menu opcional
                  </button>

                  {/* <Link to={`/menu_opc/${id}`} className="btn btn-info">
                    Siguiente
                  </Link>  */}
                  
                </div>
              </div>
            




          </form>

        </div>
           
        

        <div className="lista_mf">
               <div className="archi">
                
               <h4>Lista de registros de media filiacion</h4>

               <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>EXTRA </th>
                    <th>FILIACION</th>
                    <th>VALOR FILIACION</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {archivos.map((ar, index) => {
                    return (
                      <tr key={index}>
                        <td>{ar.ID_MEDIA_EXT}</td>
                        <td>{ar.descripcionFiliacion}</td>
                        <td>{ar.tipoFiliacion}</td>                                          
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
        </div>
















      </div>



    </>
  )
}

export default Media_filacion
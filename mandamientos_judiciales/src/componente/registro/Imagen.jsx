import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useParams } from "react-router-dom";
import "../styles/grupo.css" 
import CryptoJS from 'crypto-js'; 
import { useRef } from 'react';

const Imagen = () => {
  const {id} = useParams(); 
  const LLAVE = id

  const navigate = useNavigate();
  
  
  const [archivos, setArchivos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [tipo_imagen, setTipo_imagen] = useState("");
  const [grupo, setGrupo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [selectedOption, setSelectedOption] = useState(''); 
  const [grupos, setGrupos] = useState([]);
  const [ultimo, setUltimo] = useState('');
  const [nuevoIdString, setNuevoIdString] = useState('');

  const TIPO_FOTO = 'f';
  const TIPO_DOCUMENTO = 'd';
  
 // const [traerId, setTraerId] = useState(''); // es para traer los delitos segun el id que se esta generando 

  const [fechaActual, setFechaActual] = useState('');
  const [hora, setHora] = useState('');

  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');

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

   
   }
   }, [location.search]);


  console.log("Imagen variable llave",llave)
  console.log("Imagen variable emisor",emisor)



  useEffect(() => {
    fetch("http://localhost:8081/imagen/grupos")
      .then((data) => data.json())
      .then((val) => {
        console.log(val),
        setGrupos(val)})
  }, [])

  
  


  useEffect(() => {
    if (llave) { // Verificar si llave tiene un valor asignado
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/imagen/getArchivos/${llave}`);
          setArchivos(response.data);
          console.log("Archivos de la lista", response.data);
        } catch (error) {
          console.error('Error al obtener la lista de archivos:', error);
        }
      };
    
      // Llama a fetchData inmediatamente al montar el componente
      fetchData();
    
      // Configura un intervalo para llamar a fetchData cada 15 segundos
      const interval = setInterval(fetchData, 10000);
    
      // Limpia el intervalo cuando el componente se desmonta o cuando llave cambia
      return () => clearInterval(interval);
    }
  }, [llave]);
  
  

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setTipo_imagen(event.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 120000) {
      alert("El tamaño de la imagen es mayor a 120 KB. Por favor, selecciona una imagen más pequeña.");
      e.target.value = null;
      return;
    }
    setImagen(file);
  };
  

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

   console.log("la imagen....",imagen)

  const handleClick = async () => {
    if (!tipo_imagen.trim()) {
      alert('todos los campos son obligatorios');
      return;
    }
    if (!descripcion.trim()) {
      alert('Por favor ingresa una descripción para la imagen.');
      return;
    }

        try {
        const formData = new FormData();
        formData.append('LLAVE', llave);
        formData.append('ID_EMISOR', emisor);
        formData.append('FECHA', fechaActual);
        formData.append('HORA', hora);
        formData.append('archivo', imagen);
        formData.append('DESCRIP_IMAGEN', descripcion);
        formData.append('TIPO_IMAGEN', tipo_imagen);
        formData.append('GRUPO', grupo);
  
        await axios.post('http://localhost:8081/imagen/reg_arc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        
          alert('Se ha realizado el registro con exito, puede seguir registrando imagenes o ir al menu opcional');
          
          window.location.reload();


       
      } catch (error) {
        console.error('Error al subir el archivo y los datos:', error);
      }     
  };

  
  const renderFileContent = () => { 
    if (!selectedFile) return null;   
    return (
      <img
        src={`http://localhost:8081/imagen/getimagenid/${selectedFile.ID_IMAGEN_EXT}`}
        alt={selectedFile.IMAGEN}
        className="img-fluid"       
        onContextMenu={(e) => e.preventDefault()}
      />
    );
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
  setHora(horaActual)
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 40000); // Actualizar cada minuto (60000 milisegundos)
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
      <div className="contenedor_img">
      <div className="contenedor_imagen" id="form"> 
      
       
        <div className="componente" id="item1">       
          <div className="mb-12 row" id="formulario">
            <form >
                <br></br>
              <h5>SELECCIONE UNA IMAGEN</h5>
              <div className="barra_i"></div>
              <br />

              <div className="col-sm-6">
                <label className="form-label">Descripcion de la imagen</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="DESCRIP_IMAGEN"
                  placeholder=""
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                  
                ></input>
              </div>
              <br></br>
              <div className="col-sm-6">
                <label className="form-label">
                  tipo imagen (selecionar foto o documento)
                </label>
                <div>
                  <input
                    type="checkbox"
                    id="option1"
                    name="option"
                    value="foto"
                    checked={selectedOption === "foto" }
                    
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="option1">fotografia</label>
                  <br />
                  <input
                    type="checkbox"
                    id="option2"
                    name="option"
                    value="documento"
                    checked={selectedOption === "documento"}
                   
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="option2">Documento</label>
                  <br />
                </div>
              </div>
              <br></br>
              <div className="col-sm-6">
                <label className="form-label">Grupo (select)</label>
                <select
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="GRUPO"
                  placeholder=""
                 
                  onChange={(e) => setGrupo(e.target.value)}                
                >
                  <option selected disabled >Selecione el estado de gravedad</option>
                  {grupos.map((g) => (
                    <option key={g.CLAVE} value={g.TIPO}>
                      {g.TIPO}
                    </option>
                  ))}
                </select>
              </div>
              <br></br>

              <div className="col-sm-6">
                <label className="form-label">
                  Imagen (selecionar imagen)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="IMAGEN"
                  id="nombre"
                  placeholder=""
                  onChange={handleFileChange}
                  accept=".JPG"
                ></input>
              </div>
             
              <br></br>
                 <div className="row">
                 <div className=" col-sm-3">
                    <button
                      type="button"
                      className="b-img1 btn-primary"
                      onClick={handleClick} 
                    >Registrar
                    </button>
                  </div>
                  <div className=" col-sm-3">
                  <button
                      type="button"
                      className="b-img2 btn-primary"
                      onClick={handleClickMenu} 
                    >IR al menu opcional
                    </button>
                                        
                  </div>
                </div>
                  
                



            </form>
          </div>            
        </div>

        <div className="componente2" id="item2">        
           <br></br>
            <h5>LISTA DE IMAGENES</h5>
            <div className="barra_im"></div>
            <br />
          <div>
            <div>
              
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Descripcion de imagenes </th>
                    <th>Tipo de imagen </th>
                    <th>Grupo </th>
                    <th>Ver imagen </th>
                  </tr>
                </thead>
                <tbody>
                  {archivos.map((ar, index) => {
                    return (
                      <tr key={index}>
                        <td>{ar.DESCRIP_IMAGEN}</td>
                        <td>{ar.TIPO_IMAGEN === TIPO_FOTO ? 'Foto' : 'Documento'}</td>
                        <td>{ar.GRUPO}</td>
                        <td>
                        <button id="btn-img" onClick={() => window.open(`http://localhost:8081/imagen/getimagenid/${ar.ID_IMAGEN_EXT}`, '_blank')} download>Visualizar</button>

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          
        </div>  



      </div>
      </div>
    
    </>
  );
};

export default Imagen;

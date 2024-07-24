import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css";
import Titulo from "../menu/Titulo_registro";
import { Navigate, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";



const Modificacion_Dgenerales = ({ llave,emisorEncriptado }) => {
  const navigate = useNavigate();   

  

  const edoJuzgado = "Durango";
  const [archivos, setArchivos] = useState([]);
  const [juzgado, setJuzgado] = useState("");

  const [sexo, setSexo] = useState("");
  const [anteojos, setAnteojos] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [cuantia, setCuantia] = useState("");

  const [cat_sexo, setCat_sexo] = useState([]);
  const [uso, setUso] = useState([]);
  const [cat_nacionalidad, setCat_nacionalidad] = useState([]);
  const [cat_cuantia, setCat_cuantia] = useState([]);

  const [fechaActual, setFechaActual] = useState(''); 
  const [horaActual, setHoraActual] = useState('');   
  const [copia, setCopia] = useState([]);  
   
   const [anteojosCopia, setAnteojosCopia] = useState("");
   const [nacionalidadCopia, setNacionalidadCopia] = useState("");
   const [cuantiaCopia, setCuantiaCopia] = useState("");

   const [sexoCopia, setSexoCopia] = useState("");
   const [foCopia, setFoCopia] = useState("");
   
  const [emisorInicio, setEmisorInicio] = useState("");


  useEffect(() => {
    if (emisorEncriptado) {
      const clave = "001";
      const desencriptado = CryptoJS.AES.decrypt(emisorEncriptado, clave).toString(CryptoJS.enc.Utf8);
      setEmisorInicio(desencriptado);
      
      
    }
  }, [emisorEncriptado]);



  useEffect(() => {
    if (emisorInicio ) {
      console.log("Comp-datos generales emisor desde inicio:", emisorInicio);     
    }
  }, [emisorInicio]);

  useEffect(() => {
         if (emisorInicio) {
         console.log("Comp-datos generales emisor desde inicio:", emisorInicio);
          }
  }, [emisorInicio]);

  useEffect(() => {
    if (emisorInicio && archivos.length > 0) {
      const necesitaActualizar = archivos.some(archivo => archivo.ID_EMISOR !== emisorInicio);

      if (necesitaActualizar) {
        const updatedArchivos = archivos.map(archivo => ({
          ...archivo,
          ID_EMISOR: emisorInicio
        }));
        setArchivos(updatedArchivos);
      }
    }
  }, [emisorInicio, archivos]);
  


  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idtipocuantia")
      .then((data) => data.json())
      .then((val) => setCat_cuantia(val));
  }, []);



  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/anteojos")
      .then((data) => data.json())
      .then((val) => {
        setUso(val);
      });
  }, []);


  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idnacionalidad")
      .then((data) => data.json())
      .then((val) => setCat_nacionalidad(val));
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

  useEffect(() => {
    fetch("http://localhost:8081/datos-generales/idtipocuantia")
      .then((data) => data.json())
      .then((val) => setCat_cuantia(val));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8081/modificacion/datos/${llave}`)
      .then((data) => data.json())
      .then((val) => {
        setArchivos(val);
      });
  }, []);


 console.log("objeto archivos", archivos)

  useEffect(() => {
    if (archivos.length > 0 && archivos[0].ID_JUZGADO) {
      fetch(
        `http://localhost:8081/modificacion/edoJuzgado/${archivos[0].ID_JUZGADO}`
      )
        .then((data) => data.json())
        .then((val) => {
          console.log("resultado juz", val)
          setJuzgado(val);
        });
    }
  }, [archivos]);

  console.log("juzgado",juzgado)
      
  

 //copia del archivo original
  useEffect(() => {
    fetch(`http://localhost:8081/modificacion/copia/${llave}`)
      .then((data) => data.json())
      .then((val) => {
        setCopia(val);
      });
  }, []);




  

  useEffect(() => {
    if (copia.length > 0 && copia[0].ID_SEXO) {
      fetch(
        `http://localhost:8081/modificacion/sexo/${copia[0].ID_SEXO}`
      )
        .then((data) => data.json())
        .then((val) => {
          setSexoCopia(val);
        });
    }
  }, [archivos]); 

  console.log("sexo",copia)
  useEffect(() => {
    if (copia.length > 0 && copia[0].FECHA_OFICIO) {
      fetch(
        `http://localhost:8081/modificacion/fecha/${copia[0].LLAVE}`
      )
        .then((data) => data.json())
        .then((val) => {
          setFoCopia(val);
        });
    }
  }, [archivos]); 





  useEffect(() => {
    if (copia.length > 0 && copia[0].ID_USO_ANTEOJOS) {
      fetch(
        `http://localhost:8081/modificacion/anteojos/${copia[0].ID_USO_ANTEOJOS}`
      )
        .then((data) => data.json())
        .then((val) => {
          setAnteojosCopia(val);
        });
    }
  }, [archivos]);

  useEffect(() => {
    if (copia.length > 0 && copia[0].ID_NACIONALIDAD) {
      fetch(
        `http://localhost:8081/modificacion/nacionalidad/${copia[0].ID_NACIONALIDAD}`
      )
        .then((data) => data.json())
        .then((val) => {
          setNacionalidadCopia(val);
        });
    }
  }, [archivos]);
      
      
  useEffect(() => {
    if (copia.length > 0 && copia[0].ID_TIPO_CUANTIA) {
      fetch(
        `http://localhost:8081/modificacion/cuantia/${copia[0].ID_TIPO_CUANTIA}`
      )
        .then((data) => data.json())
        .then((val) => {
          setCuantiaCopia(val);
        });
    }
  }, [archivos]);

    

  const handleInputChange = (e, fieldName, index) => {
    const { value } = e.target;
    setArchivos((prevArchivos) => {
      const nuevosArchivos = [...prevArchivos];
      nuevosArchivos[index][fieldName] = value;
      return nuevosArchivos;
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

  setFechaActual(fecha);
  setHoraActual(horaActual);
  
   console.log(horaActual)
   console.log(fecha)

};

useEffect(() => {
  formatoDia(); 
  
}, []); 

  

   const convertArchivosToObject = (archivos) => {
    // Initialize an empty object
    const archivosObject = {};
  
    // Loop through each archivo in the archivos array
    archivos.forEach((archivo, index) => {
      // Create a key for each archivo using its index
      const key = `archivo${index + 1}`;
  
      // Set the value of each key as the archivo object itself
      archivosObject[key] = archivo;
    });
  
    // Return the resulting object
    return archivosObject;
  };
  
  
  const handleModificarRegistro = () => {
  // Convert the archivos array to an object
  const archivosObject = convertArchivosToObject(archivos);
  Object.keys(archivosObject).forEach((key) => {
    archivosObject[key].FECHA_ACTUALIZACION = fechaActual;
    archivosObject[key].HORA = horaActual;
  });

  console.log("el objeto a enviar es:", archivosObject);
  axios
    .post(`http://localhost:8081/modificacion/modificar`, archivosObject)
    .then((response) => {
      console.log(response.data);
        
         alert("El Registro ha sido modificado")           
         window.location.reload();                  
      

         
    })
    .catch((error) => {
      console.error("Hubo un error al modificar el registro:", error);
    });
};



  return (
    <>
      <div className="componente-dg">
        <div className="datos-nmod">
          {archivos.map((archivo, index) => (
            <div key={index}>
              <br></br>
              <br></br>

              <div className="row" id="lista-campos">
                <h5 >Datos no modificables</h5>
                <div className="col-11">
                  <label className="form-label">NO MANDATO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="AMATERNO"
                    id="AMATERNO"
                    placeholder=""
                    defaultValue={archivo.NO_MANDATO}
                  />
                </div>

                <div className="col-11">
                  <label className="form-label">EDO. JUZGADO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={edoJuzgado}
                  />
                </div>

                <div className="col-11">
                  <label className="form-label">JUZGADO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={juzgado[0] ? juzgado[0].DESCRIP_JUZGADO : ""}
                  />
                </div>

                <div className="col-11">
                  <label className="form-label">NO CAUSA</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={archivo.NO_CAUSA}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="datos-lista-dgrls">
          <div className="dglrs-titulo">
              <p>DATOS GENERALES </p>
          </div>
          
          {archivos.map((archivo, index) => (
            <div key={index}>
              <div className="row ">

                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                    NOMBRE:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.NOMBRE}
                      onChange={(e) => handleInputChange(e, "NOMBRE", index)}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      A. PATERNO:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.APATERNO}
                      onChange={(e) => handleInputChange(e, "APATERNO", index)}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      A. MATERNO:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.AMATERNO}
                      onChange={(e) => handleInputChange(e, "AMATERNO", index)}
                    />
                  </div>
                </div>
              </div>
             
              <div className="row ">
                <div className="col-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      ALIAS:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.ALIAS}
                      onChange={(e) => handleInputChange(e, "ALIAS", index)}
                    />
                  </div>
                </div>

                <div className="col-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      EDAD:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.EDAD}
                      onChange={(e) => handleInputChange(e, "EDAD", index)}
                    />
                  </div>
                </div>

                <div className="col-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      ESTATURA:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.ESTATURA}
                      onChange={(e) => handleInputChange(e, "ESTATURA", index)}
                    />
                  </div>
                </div>

                <div className="col-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      PESO:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.PESO}
                      onChange={(e) => handleInputChange(e, "PESO", index)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      OFICIO JUZ.:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={archivo.OFICIO_JUZGADO}
                      onChange={(e) =>
                        handleInputChange(e, "OFICIO_JUZGADO", index)
                      }
                    />
                  </div>
                </div>
              </div>

              <div id="tituloUno">
                   <h5>Datos registrados</h5>
              </div>
              
              <div id="tituloDos">
              <h5>Datos a modificar</h5>                
              </div>

              <br></br>
              <br></br>
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      SEXO:
                    </span>
                    <input   
                      disabled               
                      type="text"
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={sexoCopia[0] ? sexoCopia[0].TIPO : ""}
                    />
                  </div>
                </div>

                <div className="col-8">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      MODIFICA EL SEXO:
                    </span>
                    <select
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e) => handleInputChange(e, "ID_SEXO", index)}
                    >
                      <option value="">Seleccionar</option>
                      {cat_sexo.map((sex) => (
                        <option key={sex.CLAVE} value={sex.CLAVE}>
                          {sex.TIPO}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/*  div  a modificar */}
              </div>{" "}
              {/* cierre div */}
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      ANTEOJOS:
                    </span>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={anteojosCopia[0] ? anteojosCopia[0].descripcion : ""}
                     
                    />
                  </div>
                </div>

                <div className="col-8">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      MODIFICA USO DE ANTEOJOS:
                    </span>
                    <select
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e) => handleInputChange(e, "ID_USO_ANTEOJOS", index)}
                    >
                      <option value="">Seleccionar</option>
                      {uso.map((sex) => (
                        <option key={sex.id} value={sex.uso}>
                          {sex.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* cierre div */}
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      NACIONALIDAD:
                    </span>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={nacionalidadCopia[0] ? nacionalidadCopia[0].NACIONALIDAD: ""}
                     
                    />
                  </div>
                </div>
          
                <div className="col-8">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      MODIFICA LA NACIONALIDAD:
                    </span>
                    <select
                      className="form-control"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e) => handleInputChange(e, "ID_NACIONALIDAD", index)}
                    >
                      <option value="">Seleccionar</option>
                      {cat_nacionalidad.map((naci, index) => (
                    <option key={index} value={naci.CLAVE}>
                      {naci.NACIONALIDAD}
                    </option>
                  ))}
                    </select>
                  </div>
                </div>

              </div>
              {/* cierre div */}
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      FECHA OFICIO:
                    </span>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={foCopia[0]? foCopia[0].FECHA_OFICIO:"" }
                      
                    />
                  </div>
                </div>

                <div className="col-8">
                  <div className="input-group mb-4">
                    <span className="input-group-text" id="basic-addon1">
                      NUEVA FECHA OFICIO:
                    </span>
                    <input                     
                      type="date"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      
                      max={fechaActual}
                      onChange={(e) =>
                        handleInputChange(e, "FECHA_OFICIO_FORMATO", index)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* cierre div */}
              <div className="row">
                <div className="col-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      TIPO CUANTIA:
                    </span>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={cuantiaCopia[0] ? cuantiaCopia[0].TIPO : ""}
                    />
                  </div>
                </div>


                <div className="col-8">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                     MODIFICA EL TIPO CUANTIA:
                    </span>
                    <select
                    
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                     
                      onChange={(e) => handleInputChange(e, "ID_TIPO_CUANTIA", index)}
                    >
                       <option value="" >
                    Seleccione un cuantia
                  </option>
                  {cat_cuantia.map((naci, index) => (
                    <option key={index} value={naci.CLAVE}>
                      {naci.TIPO}
                    </option>
                  ))}


                        </select>
                  </div>
                </div>
               </div>
              {/* cierre div */}

              <div >              
                 <button id="boton-modif" onClick={handleModificarRegistro}>Modificar Registro</button>                     
              </div>

            </div>
          ))}


           


        </div>
             
        
        



      </div>
    </>
  );
};

export default Modificacion_Dgenerales;

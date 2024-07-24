import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../menu/MenuLateral';
import Titulo from '../menu/Titulo';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FaCheck, FaEdit, FaUserAlt } from 'react-icons/fa';
import useRequireAuth from '../../useRequireAuth';
import CryptoJS from 'crypto-js';
import useTokenLogin from '../../useTokenLogin';
import MenuModificar from '../menu/MenuModificar';
import JSEncrypt from 'jsencrypt';


const Ver_registro = () => {
  const encryptor = new JSEncrypt();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const institucion = queryParams.get('institucion');
  const hasToken = useTokenLogin();
  const [datos, setDatos] = useState([]);
  const [desc, setDesc] = useState([]);
  const [datosGenerales, setDatosGenerales] = useState([]);
  const [delitos, setDelitos] = useState([]);
  const [domicilio, setDomicilio] = useState([]);
  const [otrosNombres, setOtrosNombres] = useState([]);
  const [amparos, setAmparos] = useState([]);
  const [mediaFiliacion, setMediaFiliacion] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [estatusRegistros, setEstatusRegistros] = useState({});
  const [tipoInformacion, setTipoInformacion] = useState({});
  const [idBloqueFuncional, setIdBloqueFuncional] = useState({});
  const [descripcion, setDescripcion] = useState({});
  const [error, setError] = useState({});
  const [descripError, setDescripError] = useState({});
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageRegistrosPendientes, setCurrentPageRegistrosPendientes] = useState(0);
  const perPage = 9;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registroPendienteActual, setRegistroPendienteActual] = useState(null);
  const [registrosPendientes, setRegistrosPendientes] = useState([]);
  const [validados, setValidados] = useState([]);
  const [modificados, setModificados] = useState([]);
  const [messages, setMessages] = useState([]);
  const [decryptedId, setDecryptedId] = useState(null);

  const encryptId = (id) => {
    try {
      const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'clave_secreta').toString();
      return encodeURIComponent(encryptedId);  // Asegúrate de codificar la URL
    } catch (error) {
      console.error("Error al encriptar el ID:", error);
      return null;
    }
  };

  useEffect(() => {
    if (institucion) {
      // Desencripta el ID solo si está disponible
      const decryptedId = decryptId(institucion);
      setDecryptedId(decryptedId);
    }
  }, [institucion]);


  const decryptId = (encryptedId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedId, 'clave_secreta');
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8); // Convertir los bytes decodificados a cadena UTF-8
    return decryptedId;
  };



  useEffect(() => {
    obtenerDatosGenerales();
    obtenerDatosGeneralesReal();
    obtenerDelitos();
    obtenerDomicilio();
    obtenerOtrosNombres();
    obtenerAmparos();
    obtenerMediaFiliacion();
    obtenerMovimientos();
    obtenerErrores();
  }, []);



  const obtenerDatosGenerales = async () => {
    try {
      const response = await axios.get('http://localhost:8081/e-datos-generales/verregistros');
      setDatos(response.data);
      setCurrentPageData(response.data.slice(0, perPage));
    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerDatosGeneralesReal = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getdatosgenerales');
      setDatosGenerales(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerDelitos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getdelitos');
      setDelitos(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerDomicilio = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getdomicilio');
      setDomicilio(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerOtrosNombres = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getotrosnombres');
      setOtrosNombres(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerAmparos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getamparos');
      setAmparos(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerMediaFiliacion = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getmediafiliacion');
      setMediaFiliacion(response.data);

    } catch (error) {
      console.error('Error al obtener los datos generales:', error);
    }
  };

  const obtenerMovimientos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getmovimientos');

      setMovimientos(response.data)
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  const obtenerErrores = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/geterror');
      setErrores(prevErrores => [...prevErrores, ...response.data]);
    } catch (error) {
      console.error('Error al obtener los errores:', error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    setCurrentPageData(datos.slice(selected * perPage, (selected + 1) * perPage));
  };

  const handlePageChangeRegistrosPendientes = ({ selected }) => {
    setCurrentPageRegistrosPendientes(selected);
  };

  const handleValidation = async (registro) => {
    try {
      //Validar(registro)
      validation(registro)
      setShowConfirmation(true);
      const responseEstatus = await axios.get(`http://localhost:8081/e-datos-generales/getestatus/${registro.LLAVE}`);
      const responseError = await axios.get(`http://localhost:8081/e-datos-generales/geterror/${registro.LLAVE}`);
      const responseTipoInfo = await axios.get(`http://localhost:8081/e-datos-generales/gettipoinformacion/${registro.LLAVE}`);
      const responseBloque = await axios.get(`http://localhost:8081/e-datos-generales/getbloque/${registro.LLAVE}`);
      const procesado = responseEstatus.data.map(res => res.PROCESADO); // Obtiene el valor de procesado
      //const responseDesc = await axios.get(`http://localhost:8081/validar/getprocesado/${registro.LLAVE}`);

      setEstatusRegistros({
        ...estatusRegistros,
        [registro.LLAVE]: responseEstatus.data.map(res => res.PROCESADO)
      });

      // Verificar si la respuesta tiene datos antes de intentar acceder a ellos
      if (responseError.data && responseError.data.length > 0) {
        setError({
          ...error,
          [registro.LLAVE]: responseError.data.map(res => res.COD_ERROR)
        });

        setDescripError({
          ...descripError,
          [registro.LLAVE]: responseError.data.map(res => res.DESC_ERROR)
        });
      }

      setTipoInformacion({
        ...tipoInformacion,
        [registro.LLAVE]: responseTipoInfo.data.map(res => res.TIPO_INFORMACION)
      });

      setIdBloqueFuncional({
        ...idBloqueFuncional,
        [registro.LLAVE]: responseBloque.data.map(res => res.ID_BLOQUE_FUNCIONAL)
      });

      /*setDescripcion({
        ...descripcion,
        [registro.LLAVE]: responseDesc.data.map(res => res.DESCRIPCION)
      });*/

      setRegistroPendienteActual(registro);
      alert('Registro mandado a revisión.');
      window.location.reload();

    } catch (error) {
      console.error('Error al obtener el estatus del registro:', error);
    }
  };

  const handleConfirmValidation = () => {
    window.location.reload();
  };

  const handleCancelValidation = () => {
    setShowConfirmation(false);
  };

  const handleAddMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleDismissMessage = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  /*const Validar = async (registro) => {
    // Verificar si registro.LLAVE está definido y no es null
    if (registro && registro.LLAVE) {
      //VERIFICAR QUE NO HAYA UN TIPO_INFORMACION y LLAVE REGISTRADOS EN MOVIMIENTOS

      //SI NO EXISTE ENTRA AL TRY
      try {
        // Utilizar Promise.all para ejecutar ambas solicitudes POST en paralelo
        const [response1, response2, response3, response4, response5, response6, response7, response8, response9, response10] = await Promise.all([
          axios.post(`http://localhost:8081/validar/generales/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/proceso/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/delitos/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/domicilio/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/otrosnombres/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/amparos/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/ministerial/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/colaboracion/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/mediafiliacion/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          }),
          axios.post(`http://localhost:8081/validar/imagen/${registro.LLAVE}`, {
            LLAVE: registro.LLAVE
          })
        ]);

      } catch (error) {
        console.error('Error al enviar la llave al backend:', error);
      }
    } else {
      console.error('Registro no definido o llave no válida:', registro);
    } // SI EXISTE ENTONCES NO HACER NADA O NO INSERTAR, SOLO INSERTAR LOS QUE NO ESTEN EN MOVIMIENTOS
  };*/

  /*const Validar = async (registro) => {
    // Verificar si registro.LLAVE está definido y no es null
    if (registro && registro.LLAVE) {
      try {
        // Verificar la existencia de cada componente antes de realizar la inserción en movimientos
        if (!await existeMovimiento(1, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/generales/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(6, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/proceso/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(3, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/delitos/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(2, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/domicilio/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
         else if (!await existeMovimiento(4, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/otrosnombres/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
         else if (!await existeMovimiento(5, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/amparos/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
         else if (!await existeMovimiento(9, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/ministerial/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(10, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/colaboracion/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(8, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/mediafiliacion/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }
        else if (!await existeMovimiento(7, registro.LLAVE)) {
          await axios.post(`http://localhost:8081/validar/imagen/${registro.LLAVE}`, { LLAVE: registro.LLAVE });
        }

      } catch (error) {
        console.error('Error al validar y/o insertar en movimientos:', error);
      }
    } else {
      console.error('Registro no definido o llave no válida:', registro);
    }
  };*/

  /*const Validar = async (registro) => {
    if (registro && registro.LLAVE) {
      const tiposInformacion = [
        'generales', 'proceso', 'delitos', 'domicilio', 'otrosnombres',
        'amparos', 'ministerial', 'colaboracion', 'mediafiliacion', 'imagen'
      ];
  
      const tiposInformacion2 = [
        1, 6, 3, 2, 4,
        5, 9, 10, 8, 7
      ];
  
      try {
        // Obtener la última llave insertada
        const lastInsertedKey = await getLastInsertedKey();
        console.log('Última llave insertada:', lastInsertedKey);
  
        // Crear un objeto para almacenar la existencia de cada tipo
        const existenciaTipos = {};
  
        // Verificar la existencia de cada componente usando la última llave insertada
        await Promise.all(tiposInformacion2.map(async (tipo2) => {
          const existe = await existeMovimiento(tipo2, lastInsertedKey);
          existenciaTipos[tipo2] = existe;
          console.log(`Existe tipo ${tipo2} para la llave ${lastInsertedKey}:`, existe);
        }));
  
        // Realizar las inserciones usando la misma llave
        const insertions = await Promise.all(tiposInformacion.map(async (tipo, i) => {
          const tipo2 = tiposInformacion2[i];
  
          if (!existenciaTipos[tipo2]) {
            // Si no existe, inserta en movimientos con la misma llave
            try {
              const response = await axios.post(`http://localhost:8081/validar/${tipo}/${registro.LLAVE}`, {
                //LLAVE: lastInsertedKey
              });
              console.log(`Insertado ${tipo} para la llave ${lastInsertedKey}:`, response.data);
              return response.data;
            } catch (error) {
              console.error(`Error al insertar ${tipo} para la llave ${lastInsertedKey}:`, error.response ? error.response.data : error.message);
              return null;
            }
          } else {
            console.log(`El registro con tipo ${tipo} y llave ${lastInsertedKey} ya existe.`);
            return null;
          }
        }));
  
        console.log('Resultados de las inserciones:', insertions);
  
      } catch (error) {
        console.error('Error al validar y/o insertar en movimientos:', error);
      }
    } else {
      console.error('Registro no definido o llave no válida:', registro);
    }
  };*/

  const getLastInsertedKey = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validar/getUltimaLlave');
      return response.data[0].LLAVE;
    } catch (error) {
      console.error('Error al obtener la última llave insertada:', error);
      throw error;
    }
  };

  const getKey = async (llave) => {
    try {
      const response = await axios.get(`http://localhost:8081/validar/getLlave/${llave}`);
      if (response.data.length > 0 && response.data[0] !== undefined) {
        return response.data[0].LLAVE;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener la llave con llave_1: ', error);
      throw error;
    }
  }

  const Validar = async (registros) => {
    console.log(registros)
    if (registros && registros.LLAVE) {
      const tipoInformacion = [
        'generales', 'proceso', 'delitos', 'domicilio', 'otrosnombres',
        'amparos', 'ministerial', 'colaboracion', 'mediafiliacion', 'imagen'
      ];

      const tipoInformacion2 = [
        1, 6, 3, 2, 4,
        5, 9, 10, 8, 7
      ];

      //OBTENER LLAVE DEL REGISTRO CON LLAVE LOCAL CLICKEADA
      const insertedKey = await getKey(registros.LLAVE);
      // Obtener la ultima llave insertada en MOVIMIENTOS
      const lastInsertedKey = await getLastInsertedKey();
      console.log(lastInsertedKey);

      // Verificar que el tipoInformacion y llave no existan en MOVIMIENTOS
      const existenciaMovimientos = await Promise.all(
        tipoInformacion2.map(async (tipo2) => {
          const resultado = await existeMovimiento(tipo2, insertedKey);
          console.log(`El tipo de información ${tipo2}:`, resultado.exists, 'existe');
          return { tipo2, ...resultado };
        })
      );

      // Filtrar los elementos que no existen en movimientos
      const registrosNoExistentes = existenciaMovimientos.filter(item => !item.exists);
      console.log(registrosNoExistentes);
      const registrosExistentes = existenciaMovimientos.filter(item => item.exists);
      console.log("Registros existentes con llave: ", registrosExistentes);

      // Mapeo de tipo2 a tipoInformacion
      const tipo2ToTipoInformacion = {
        1: 'generales',
        6: 'proceso',
        3: 'delitos',
        2: 'domicilio',
        4: 'otrosnombres',
        5: 'amparos',
        9: 'ministerial',
        10: 'colaboracion',
        8: 'mediafiliacion',
        7: 'imagen'
      };

      // Obtener las llaves de los registros existentes
      const llavesRegistrosExistentes = registrosExistentes.map(item => item.llave);
      console.log("LLAVE DE LOS REGISTROS EXISTENTES: ", llavesRegistrosExistentes);

      // INSERTAR los registros que NO EXISTAN en MOVIMIENTOS
      registrosNoExistentes.forEach(async (registro) => {
        const tipoInformacionName = tipo2ToTipoInformacion[registro.tipo2];
        if (tipoInformacionName) {
          const response = await axios.post(`http://localhost:8081/validar/${tipoInformacionName}/${registros.LLAVE}`);
          console.log(`Insertado registro para tipo de información ${tipoInformacionName}`);
        } else {
          console.error(`No se encontró correspondencia para tipo2 ${registro.tipo2}`);
        }
      });
    }
  };

  const validation = async (registros) => {
    const tipo2ToTipoInformacion = {
      1: 'generales',
      6: 'proceso',
      3: 'delitos',
      2: 'domicilio',
      4: 'otrosnombres',
      5: 'amparos',
      9: 'ministerial',
      10: 'colaboracion',
      8: 'mediafiliacion',
    };
  
    const promises = Object.values(tipo2ToTipoInformacion).map(async (endpoint) => {
      try {
        const response = await axios.post(`http://localhost:8081/validar/${endpoint}/${registros.LLAVE}`);
        console.log(`Validación para ${endpoint} exitosa`, response.data);
      } catch (error) {
        console.error(`Error validando ${endpoint}:`, error);
      }
    });
  
    await Promise.all(promises);
    console.log('Todas las validaciones han sido procesadas');
  };
  

  const existeMovimiento = async (tipoInformacion, id) => {
    try {
      const response = await axios.get(`http://localhost:8081/validar/existeMovimiento/${tipoInformacion}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error verificando movimiento:', error);
      return { exists: false, llave: null };
    }
  };

  const handleProcesado = async (idAlterna) => {

    try {
      await axios.put(`http://localhost:8081/validar/actualizar/${idAlterna}`);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el estado del movimiento:', error);
    }

  };

  const getDisplayRange = () => {
    const start = currentPage * perPage + 1;
    const end = Math.min((currentPage + 1) * perPage, datos.length);
    return `${start} a ${end}`;
  };

  return (
    <div className={`contenedor_principal_t ${hasToken ? '' : 'd-none'}`}>
      <Titulo />
      <MenuModificar messages={messages} dismissMessage={handleDismissMessage} />

      <div className="mb-12 row">
        <h3 className='title' style={{ paddingBottom: '20px', color: 'black' }}>Registros</h3>
        <p className='card-text'>Aquí podrás visualizar los registros que aún no han sido validados y realizar acciónes correspondientes a los mismos.</p>

        {/*<h3>Emisor: {institucion}</h3> {/* EMISOR */}
        <div className='table-container large'>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered" style={{ height: '300px' }}>
              <thead className="table-secondary">
                <tr>
                  <th></th>
                  <th>Registro</th>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Alias</th>
                  <th>Modificar</th>
                  <th>Validar</th>
                </tr>
              </thead>

              <tbody>
                {currentPageData.map((info, index) => (
                  <tr key={index}>
                    <td><center><FaUserAlt style={{ color: 'grey' }}></FaUserAlt></center></td>
                    <td><center>{info.LLAVE}</center></td>
                    <td><center>{info.NOMBRE}</center></td>
                    <td><center>{info.APATERNO}</center></td>
                    <td><center>{info.AMATERNO}</center></td>
                    <td><center>{info.ALIAS}</center></td>
                    <td className='text-center'>
                      
                        <Link
                          to={`/Modificar/${encryptId(info.LLAVE)}`}
                          className={`btn btn-white mr-2 ${validados.includes(info.LLAVE) && 'disabled'}`}
                          //onClick={() => handleValidation(info)}
                          disabled={registrosPendientes.find(registro => registro.LLAVE === info.LLAVE)}
                        >
                          <FaEdit className="mr-2" style={{ fontSize: '20px' }} />
                        </Link>
                      
                    </td>
                    <td className='text-center'>
                      <button
                        className={`btn btn-white mr-2 ${validados.includes(info.LLAVE) && 'disabled'}`}
                        onClick={() => handleValidation(info)}
                        disabled={registrosPendientes.find(registro => registro.LLAVE === info.LLAVE)}
                      >
                        <FaCheck className="mr-2" style={{ fontSize: '20px' }}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-info">
            Mostrando registros {getDisplayRange()} de un total de {datos.length} registros
          </div>
          <ReactPaginate
            previousLabel={'Anterior'}
            nextLabel={'Siguiente'}
            breakLabel={'...'}
            pageCount={Math.ceil(datos.length / perPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </div>
      </div>

      {showConfirmation && (
        <>

          {/*<div className="background-overlay" />
          <div className="confirmation-popup">
            <h4 className="confirmation-popup-title">¿Estás seguro de validar este registro?</h4>
            <div className="confirmation-popup-buttons">
              <button className="confirmation-popup-button confirmation-popup-button-confirm" onClick={handleConfirmValidation}>
                Confirmar
              </button>
              <button className="confirmation-popup-button confirmation-popup-button-cancel" onClick={handleCancelValidation}>
                Cancelar
              </button>
            </div>
          </div>*/}
        </>
      )}
    </div>
  );
};

export default Ver_registro;

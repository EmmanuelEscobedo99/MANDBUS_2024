import React, { useState, useEffect } from 'react'
import "../../../src/index.css"
import axios from 'axios'
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_Amparos = ({ id }) => {

  const [datos, setDatos] = useState({
    fechaLibramiento: '',
    idAmparoExt: '',
    noAmparo: '',
    fechaAmparo: '',
    nombreAmparo: '',
    idAmparo: '',
    nombreEmisor: '',
    idEmisor: '',
    nombreEstado: '',
    idEstado: '',
    nombreJuzgado: '',
    idJuzgado: '',
    nombreResolucion: '',
    idResolucion: '',
    amparo: [],
    emisor: [],
    estado: [],
    juzgado: [],
    resolucion: []
  });

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    fechaAmparo: '',
    // Agrega más campos de error según sea necesario
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [amparos, setAmparos] = useState([]);

  const [nombreAmparo, setNombreAmparo] = useState([]);
  const [idAmparo, setIdAmparo] = useState([]);
  const [amparo, setAmparo] = useState([]);

  const [nombreEmisor, setNombreEmisor] = useState([]);
  const [idEmisor, setIdEmisor] = useState([]);
  const [emisor, setEmisor] = useState([]);

  const [nombreJuzgado, setNombreJuzgado] = useState([]);
  const [idJuzgado, setIdJuzgado] = useState([]);
  const [juzgado, setJuzgado] = useState([]);

  const [nombreResolucion, setNombreResolucion] = useState([]);
  const [idResolucion, setIdResolucion] = useState([]);
  const [resolucion, setResolucion] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/getdatos/${id}`)
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            noAmparo: data.NO_AMPARO,
            fechaAmparo: new Date(data.FECHA_AMPARO).toISOString().split('T')[0],
          })
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    const obtenerFechaLibramiento = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/getfechalibramiento/${id}`)
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            fechaLibramiento: new Date(data.FECHA_LIBRAMIENTO).toISOString().split('T')[0],
          })
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    const obtenerAmparos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          setAmparos(response.data)
        } else {
          console.error('Error al obtener los datos:', error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    const obtenerNombreAmparos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/tipoamparo/${id}`);
        if (response.data && response.data.length > 0) {
          const nombres = response.data.map(res => res.TIPO);
          const ids = response.data.map(res => res.CLAVE);

          setDatos(prevState => ({
            ...prevState,
            nombreAmparo: nombres,
            idAmparo: ids,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del amparo:', error);
      }
    };



    const obtenerNombreEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/emisor/${id}`);
        if (response.data && response.data.length > 0) {
          setNombreEmisor(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombreEmisor: response.data[0].TIPO,
            idEmisor: response.data[0].ID_EMISOR,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const obtenerNombreJuzgado = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/juzgado/${id}`);
        if (response.data && response.data.length > 0) {
          setNombreJuzgado(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombreJuzgado: response.data[0].DESCRIP_JUZGADO,
            idJuzgado: response.data[0].ID_JUZGADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const obtenerNombreResolucion = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-amparos/resolucion/${id}`);
        if (response.data && response.data.length > 0) {
          setNombreResolucion(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombreResolucion: response.data[0].TIPO,
            idResolucion: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const fetchData = async () => {
      try {
        await obtenerNombreAmparos();
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
    obtenerFechaLibramiento();

    obtenerAmparos();
    obtenerNombreAmparos();
    obtenerNombreEmisor();
    obtenerNombreJuzgado();
    obtenerNombreResolucion();
    fetchData();
  }, [id])

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Aquí se realizan todas las llamadas a las API
        const [emisorResponse, amparoResponse, juzgadoResponse, resolucionResponse] = await Promise.all([
          axios.get("http://localhost:8081/e-amparos/getcatemisor"),
          axios.get("http://localhost:8081/e-amparos/getcattipoamparo"),
          axios.get("http://localhost:8081/e-amparos/getcatjuzgados"),
          axios.get("http://localhost:8081/e-amparos/getcatresolucion"),
        ]);

        if (emisorResponse.data && emisorResponse.data.length > 0) {
          setIdEmisor(emisorResponse.data);
          setEmisor(emisorResponse.data);
          setDatos(prevState => ({
            ...prevState,
            emisor: emisorResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron emisores');
        }
        if (amparoResponse.data && amparoResponse.data.length > 0) {
          setIdAmparo(amparoResponse.data);
          setAmparo(amparoResponse.data);
          setDatos(prevState => ({
            ...prevState,
            amparo: amparoResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron emisores');
        }
        if (juzgadoResponse.data && juzgadoResponse.data.length > 0) {
          setIdJuzgado(juzgadoResponse.data);
          setJuzgado(juzgadoResponse.data);
          setDatos(prevState => ({
            ...prevState,
            juzgado: juzgadoResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron emisores');
        }
        if (resolucionResponse.data && resolucionResponse.data.length > 0) {
          setIdResolucion(resolucionResponse.data);
          setResolucion(resolucionResponse.data);
          setDatos(prevState => ({
            ...prevState,
            resolucion: resolucionResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron emisores');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleModificarClick = async (idAmparoExt) => {
    const amparoSeleccionado = amparos.find(amparo => amparo.ID_AMPARO_EXT === idAmparoExt);

    if (amparoSeleccionado) {
      try {
        const [amparoResponse, emisorResponse, juzgadoResponse, resolucionResponse] = await Promise.all([
          axios.get(`http://localhost:8081/e-amparos/tipoamparo/${id}`),
          axios.get(`http://localhost:8081/e-amparos/emisor/${id}`),
          axios.get(`http://localhost:8081/e-amparos/juzgado/${id}`),
          axios.get(`http://localhost:8081/e-amparos/resolucion/${id}`)
        ]);

        // Verificar que se hayan recibido datos válidos
        if (amparoResponse.data && amparoResponse.data.length > 0 &&
          emisorResponse.data && emisorResponse.data.length > 0 &&
          juzgadoResponse.data && juzgadoResponse.data.length > 0 &&
          resolucionResponse.data && resolucionResponse.data.length > 0) {

          // Obtener los datos correspondientes al amparo seleccionado
          const datosAmparo = amparoResponse.data[idAmparoExt - 1];
          const datosEmisor = emisorResponse.data[idAmparoExt - 1];
          const datosJuzgado = juzgadoResponse.data[idAmparoExt - 1];
          const datosResolucion = resolucionResponse.data[idAmparoExt - 1];

          // Asignar los datos al estado
          setDatos(prevState => ({
            ...prevState,
            idAmparoExt: amparoSeleccionado.ID_AMPARO_EXT,
            fechaAmparo: new Date(amparoSeleccionado.FECHA_AMPARO).toISOString().split('T')[0],
            noAmparo: amparoSeleccionado.NO_AMPARO,
            nombreAmparo: datosAmparo.TIPO,
            idAmparo: datosAmparo.CLAVE,
            nombreEmisor: datosEmisor.TIPO,
            idEmisor: datosEmisor.ID_EMISOR,
            nombreJuzgado: datosJuzgado.DESCRIP_JUZGADO,
            idJuzgado: datosJuzgado.ID_JUZGADO,
            nombreResolucion: datosResolucion.TIPO,
            idResolucion: datosResolucion.CLAVE
          }));
          setMostrarFormulario(true);
        } else {
          console.error('Error: No se encontraron los datos necesarios');
        }
      } catch (error) {
        console.error('Error al obtener los datos necesarios:', error);
      }
    } else {
      console.error('Error: No se encontró el amparo seleccionado');
    }
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    // Validar que el campo no esté vacío
    if (value.trim() === '') {
      errorMessage = 'Este campo no puede estar vacío.';
    }

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'fechaAmparo':
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaActual.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`;

        let errorMessageFechaActual = '';
        let errorMessageFechaAmparo = '';

        let fechaLibramiento = datos.fechaLibramiento

        if (new Date(datos.fechaAmparo) < fechaActual) {
          errorMessageFechaActual = 'La fecha de amparo no puede ser menor a la fecha actual.';
        }

        if (datos.fechaAmparo < datos.fechaLibramiento) {
          errorMessageFechaAmparo = 'La fecha amparo no puede ser menor a la fecha libramiento ' + datos.fechaLibramiento
        }

        // Concatenar los mensajes de error si es necesario
        errorMessage = errorMessageFechaActual + ' ' + errorMessageFechaAmparo;

        break;

      default:
        // No se encontró ninguna validación para el campo
        console.warn(`Validación no definida para el campo: ${fieldName}`);
    }

    // Actualiza el estado de errores con el nuevo mensaje de error
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
  };


  const handleUpdateProceso = async () => {
    // Verifica si hay errores antes de intentar actualizar los datos
    if (Object.values(errors).some(error => error !== '')) {
      alert("No puedes guardar porque existen errores !!");
    } else {
      try {
        const response = await axios.put(`http://localhost:8081/e-amparos/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };

  return (
    <>
      <h3 style={{color:'black'}}>Edicion Amparos</h3>
      {mostrarFormulario ? (
        <>
          <div className='table-container form'>
            <div className='mb-3 row'>
              <div className="col-sm-6">
                <input type="hidden" className="form-control" name="idAmparoExt" id="ID_AMPARO_EXT" value={datos.idAmparoExt} onChange={handleChange}></input>
                <label className="form-label">Tipo de amparo</label>
                {datos.nombreAmparo && datos.nombreAmparo.length > 0 && (
                  <select
                    name="idAmparo"
                    id='ID_TIPO_AMPARO'
                    className="form-select"
                    value={datos.idAmparo}
                    onChange={handleSelectChange}>
                    <option value="">{datos.nombreAmparo}</option>
                    {amparo.map(amp => (
                      <option value={amp.CLAVE}>{amp.TIPO}</option>
                    ))}
                  </select>
                )}
            
              </div>
              <div className="col-sm-6">
                <label className="form-label">N° Amparo</label>
                <input type="text" className="form-control" name="noAmparo" id="NO_AMPARO" placeholder="" value={datos.noAmparo} onChange={handleChange}></input>
              </div>
              <div className="col-sm-6">
                <label className="form-label">Fecha Amparo</label>
                <input type="date" className="form-control" name="fechaAmparo" id="FECHA_AMPARO" placeholder="" value={datos.fechaAmparo} onChange={handleChange}></input>
                <span className="error-message">{errors.fechaAmparo}</span>
              </div>
              <div className="col-sm-6">
                <label className="form-label">Resolucion</label>
                {datos.nombreResolucion && datos.nombreResolucion.length > 0 && (
                  <select
                    name="idResolucion"
                    id='ID_RESOLUCION'
                    className="form-select"
                    value={datos.idResolucion}
                    onChange={handleSelectChange}>
                    <option value="">{datos.nombreResolucion}</option>
                    {resolucion.map(res => (
                      <option value={res.CLAVE}>{res.TIPO}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-sm-6">
                <label className="form-label">Juzgado</label>
                {datos.nombreJuzgado && datos.nombreJuzgado.length > 0 && (
                  <select
                    name="idJuzgado"
                    id='ID_JUZGADO'
                    className="form-select"
                    value={datos.idJuzgado}
                    onChange={handleSelectChange}>
                    <option value="">{datos.nombreJuzgado}</option>
                    {juzgado.map(juz => (
                      <option value={juz.ID_JUZGADO}>{juz.DESCRIP_JUZGADO}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <br></br>
            <div className="mb-3 row">
              <div className="col-sm-4">
                <button className="btn btn-success" onClick={handleUpdateProceso}>Actualizar</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='table-container large'>
          <div className="table-responsive">

            <table className="table table-striped table-hover">
              {/* Cabecera de la tabla */}
              <thead className="table-info">
                <tr>
                  <th>Id Amparo Extra</th>
                  <th>Amparo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              {/* Cuerpo de la tabla */}
              <tbody>
                {amparos.map((amparo, index) => (
                  <tr key={index}>
                    <td>{amparo.ID_AMPARO_EXT}</td>
                    <td>{datos.nombreAmparo && datos.nombreAmparo[index]}</td>
                    <td>
                      <button
                        onClick={() => handleModificarClick(amparo.ID_AMPARO_EXT)}
                        className="btn btn-secondary mr-2"
                        style={{ marginRight: '20px' }}
                      >
                        <FaEdit className='mr-2' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

    </>
  )
}

export default E_Amparos
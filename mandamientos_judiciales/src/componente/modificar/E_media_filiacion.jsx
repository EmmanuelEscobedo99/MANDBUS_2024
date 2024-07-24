import React, { useState, useEffect } from 'react'
import "../../../src/index.css"
import axios from 'axios'
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_media_filiacion = ({ id }) => {

  const [datos, setDatos] = useState({
    idMediaExt: [],
    valorFiliacion: [],
    noConsecutivo: '',
    nombreFiliacion: '',
    idFiliacion: '',
    nombreFiliacionExt: '',
    idFiliacionExt: '',
    tipoMFfiliacion: '',
    nombreValorFiliacion: '',
    nombreValorFiliacionExt: '',
    idValorFiliacion: '',
    idValorFiliacionExt: '',
    nombreEmisor: '',
    idEmisor: '',
    noConsecutivoExt: '',

    filiacion: [],
    valorFiliacion: [],
    emisor: [],
  })

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    noConsecutivoExt: ''
    // Agrega más campos de error según sea necesario
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [idSeleccionado, setIdSeleccionado] = useState(null)

  const handleModificarClick = async (index) => {
    setMostrarFormulario(true);
    setIdSeleccionado(datos.idMediaExt[index]);

    // Esperar a que se completen las llamadas a obtenerEmisor y obtenerNombreTipoFiliacion
    await obtenerEmisor(id, datos.idMediaExt[index]);
    await obtenerNombreTipoFiliacion(id, datos.idMediaExt[index]);
    await obtenerNombreValorFiliacion(id, datos.idMediaExt[index]);
    await obtenerNoConsecutivo(id, datos.idMediaExt[index]);
  };


  const obtenerDatos = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/getdatos/${id}`)
      if (response.data && response.data.length > 0) {
        const ID_MEDIA_EXT = response.data.map(res => res.ID_MEDIA_EXT)
        const NO_CONSECUTIVO = response.data.map(res => res.NO_CONSECUTIVO)
        setDatos({
          ...datos,
          idMediaExt: ID_MEDIA_EXT,
          noConsecutivo: NO_CONSECUTIVO,
        })
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado')
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  const obtenerTipoFiliacion = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/tipofiliacion/${id}`)
      if (response.data && response.data.length > 0) {
        const ID_FILIACION = response.data.map(res => res.CLAVE)
        const FILIACION = response.data.map(res => res.DESCRIPCION)
        setDatos(prevDatos => ({
          ...prevDatos,
          idFiliacion: ID_FILIACION,
          nombreFiliacion: FILIACION,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado')
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  const obtenerValorFiliacion = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/valorfiliacion/${id}`)
      if (response.data && response.data.length > 0) {
        const CLAVE = response.data.map(res => res.CLAVE)
        const TIPO_MF = response.data.map(res => res.TIPO_MF)
        const FILIACION = response.data.map(res => res.DESCRIPCION)
        setDatos(prevDatos => ({
          ...prevDatos,
          idValorFiliacion: CLAVE,
          tipoMFfiliacion: TIPO_MF,
          nombreValorFiliacion: FILIACION,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado')
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  const obtenerValorFiliacionPorTipo = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/getvalorportipo/${datos.idFiliacionExt}`)
      if (response.data && response.data.length > 0) {
        const valorFiliacion = response.data;
        setDatos(prevDatos => ({
          ...prevDatos,
          valorFiliacion: valorFiliacion,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado')
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  const handleSelectFiliacionChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    obtenerValorFiliacionPorTipo();
  };


  const obtenerEmisor = async (id, idMediaExt) => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/emisor/${id}/${idMediaExt}`);
      if (response.data && response.data.length > 0) {
        const ID_EMISOR = response.data[0].ID_EMISOR;
        const TIPO = response.data[0].TIPO;
        setDatos(prevDatos => ({
          ...prevDatos,
          idEmisor: ID_EMISOR,
          nombreEmisor: TIPO,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado');
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const obtenerNombreTipoFiliacion = async (id, idMediaExt) => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/nombretipofiliacion/${id}/${idMediaExt}`);
      if (response.data && response.data.length > 0) {
        const ID_FILIACION_EXT = response.data[0].CLAVE;
        const FILIACION_EXT = response.data[0].DESCRIPCION;
        setDatos(prevDatos => ({
          ...prevDatos,
          idFiliacionExt: ID_FILIACION_EXT,
          nombreFiliacionExt: FILIACION_EXT,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado');
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const obtenerNombreValorFiliacion = async (id, idMediaExt) => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/valorfiliacionext/${id}/${idMediaExt}`);
      if (response.data && response.data.length > 0) {
        const TIPO_MF = response.data[0].TIPO_MF;
        const DESCRIPCION = response.data[0].DESCRIPCION;

        setDatos(prevDatos => ({
          ...prevDatos,
          idValorFiliacionExt: TIPO_MF,
          nombreValorFiliacionExt: DESCRIPCION,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado');
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const obtenerNoConsecutivo = async (id, idMediaExt) => {
    try {
      const response = await axios.get(`http://localhost:8081/e-media-filiacion/getcatnoconsecutivo/${id}/${idMediaExt}`);
      if (response.data && response.data.length > 0) {
        const NO_CONSECUTIVO = response.data[0].NO_CONSECUTIVO;
        setDatos(prevDatos => ({
          ...prevDatos,
          noConsecutivoExt: NO_CONSECUTIVO,
        }));
      } else {
        console.error('Error: No se encontraron datos para el ID proporcionado');
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };


  const obtenerCatEmisor = async () => {
    try {
      const responseEmisor = await axios.get("http://localhost:8081/e-media-filiacion/getcatemisor");
      if (responseEmisor.data && responseEmisor.data.length > 0) {
        setDatos(prevState => ({
          ...prevState,
          emisor: responseEmisor.data,
        }));
      } else {
        console.error('Error: No se encontraron emisores');
      }
    } catch (error) {
      console.error('Error al obtener emisores:', error);
    }
  };

  const obtenerCatTipoFiliacion = async () => {
    try {
      const responseTipoFiliacion = await axios.get("http://localhost:8081/e-media-filiacion/getcattipofiliacion");
      if (responseTipoFiliacion.data && responseTipoFiliacion.data.length > 0) {
        setDatos(prevState => ({
          ...prevState,
          filiacion: responseTipoFiliacion.data,
        }));
      } else {
        console.error('Error: No se encontraron emisores');
      }
    } catch (error) {
      console.error('Error al obtener emisores:', error);
    }
  };

  // En lugar de usar eventos automáticos, desencadena manualmente el evento onChange después de actualizar los datos
  const handleGhostClick = () => {
    const selects = document.querySelectorAll('.form-select'); // Obtener todos los selectores de la página

    selects.forEach(select => {
      const event = new Event('change', { bubbles: true }); // Crear un evento de cambio
      select.dispatchEvent(event); // Despachar el evento en cada selector
    });
    // Llamar a handleGhostClick después de 1 segundo
    setTimeout(handleGhostClick, 1000);
  };



  useEffect(() => {
    obtenerDatos();
    obtenerTipoFiliacion();
    obtenerValorFiliacion();
    obtenerEmisor(id, datos.idMediaExt);
    obtenerNombreTipoFiliacion(id, datos.idMediaExt);
    obtenerNombreValorFiliacion(id, datos.idMediaExt);
    obtenerNoConsecutivo(id, datos.idMediaExt);
    obtenerCatEmisor();
    obtenerCatTipoFiliacion();
  }, [id])


  useEffect(() => {
    if (mostrarFormulario) {
      handleGhostClick();
    }
  }, [mostrarFormulario])

  useEffect(() => {
    if (datos.idFiliacionExt) {
      obtenerValorFiliacionPorTipo();
    }
  }, [datos.idFiliacionExt])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value)
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value)
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    // Validar que el campo no esté vacío
    if (value.trim() === '') {
      errorMessage = 'Este campo no puede estar vacío.';
    }

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'noConsecutivoExt':
        if (value.includes('  ')) {
          errorMessage = 'El campo "No Consecutivo" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "No Consecutivo" no puede terminar en espacio.'
        }
        break;
      default:
        // No se encontró ninguna validación para el campo
        console.warn(`Validación no definida para el campo: ${fieldName}`);
    }

    // Actualiza el estado de errores con el nuevo mensaje de error
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));

  };

  const handleUpdateProceso = async () => {
    try {
      const idMediaExtToUpdate = datos.idMediaExt[idSeleccionado - 1];
      const noConsecutivoToUpdate = datos.noConsecutivo[idSeleccionado - 1];

      // Crear el objeto actualizado con ambos valores
      const updatedData = {
        ...datos,
        idMediaExt: idMediaExtToUpdate,
        noConsecutivo: noConsecutivoToUpdate
      };

      // Enviar la solicitud al backend con los datos actualizados
      const response = await axios.put(`http://localhost:8081/e-media-filiacion/actualizar/${id}`, updatedData);

      alert('Datos actualizados correctamente!');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };


  return (
    <>

      {mostrarFormulario ? (
        <div>
          <div className='table-container form'>
            <div className='mb-12 row'>
              <h3 style={{color:'black'}}>Edición Media Filiación</h3>

              <div className='col-sm-6'>
                <label>Tipo Filiación</label>
                <select
                  name='idFiliacionExt'
                  id='ID_FILIACION_EXT'
                  className='form-select'
                  value={datos.idFiliacionExt}
                  onChange={handleSelectChange}
                  onClick={handleSelectFiliacionChange}
                >
                  <option value="">{datos.nombreFiliacionExt}</option>
                  {datos.filiacion.map(fil => (
                    <option value={fil.CLAVE}>{fil.DESCRIPCION}</option>
                  ))}
                </select>
              </div>
              <div className='col-sm-6'>
                <label>Valor Filiación</label>
                <select
                  name='idValorFiliacionExt'
                  id='ID_VALOR_FILIACION_EXT'
                  className='form-select'
                  value={datos.idValorFiliacionExt}
                  onChange={handleSelectChange}
                >
                  <option value="">{datos.nombreValorFiliacionExt}</option>
                  {datos.valorFiliacion.map(Vfil => (
                    <option value={Vfil.TIPO_MF}>{Vfil.DESCRIPCION}</option>
                  ))}
                </select>
              </div>
              <div className='col-sm-6'>
                <label className='form-label'>N° Consecutivo</label>
                <input type='text' className='form-control' name="noConsecutivoExt" id='NO_CONSECUTIVO_EXT' placeholder="" value={datos.noConsecutivoExt} onChange={handleChange}></input>
                <span className="error-message">{errors.noConsecutivoExt}</span>
              </div>
            </div>
            <br></br>
            <div className="col-sm-4">
              <button className="btn btn-success" onClick={handleUpdateProceso}> <FaCheck className='mr-2' /></button>
            </div>
          </div>
        </div>

      ) : (
        <div className='table-container large'>
          <div className="table-responsive">
            <table className="table table-striped table-hover ">
              <thead className="table-info">
                <tr>
                  <th>Id Media Filiación Extra</th>
                  <th>Filiación</th>
                  <th>Valor Filiación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {datos.idMediaExt.map((mediaExt, index) => (
                  <tr key={index}>
                    <th>
                      <label>{datos.idMediaExt[index]}</label>
                    </th>
                    <th>
                      <div>
                        <label>{datos.nombreFiliacion[index]}</label>
                      </div>
                    </th>
                    <th>
                      <div>
                        <label>{datos.nombreValorFiliacion[index]}</label>
                      </div>
                    </th>

                    <th>
                      <button
                        onClick={() => handleModificarClick(index)}
                        className="btn btn-secondary mr-2"
                        style={{ marginRight: '20px' }}
                      >
                        <FaEdit className='mr-2' />
                      </button>
                    </th>
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


export default E_media_filiacion
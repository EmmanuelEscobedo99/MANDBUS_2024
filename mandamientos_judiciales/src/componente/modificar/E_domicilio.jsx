import React, { useState, useEffect } from 'react';
import "../../../src/index.css";
import axios from 'axios';
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_domicilio = ({ id }) => {

  const [datos, setDatos] = useState({
    idDomicilioExt: '',
    calle: '',
    colonia: '',
    codigoPostal: '',
    observaciones: '',
    telefono: '',
    nombreEntidad: '',
    idEntidad: '',
    nombreMunicipio: '',
    idMunicipio: '',
    nombrePais: '',
    idPais: '',
    entidad: [],
    municipio: [],
    pais: []
  });

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    calle: '',
    colonia: '',
    codigoPostal: '',
    telefono: '',
    // Agrega más campos de error según sea necesario
  });

  const [domicilios, setDomicilios] = useState([]);
  const [nombrePais, setNombrePais] = useState([]);
  const [nombreMunicipio, setNombreMunicipio] = useState([]);
  const [nombreEntidad, setNombreEntidad] = useState([]);

  const [idPais, setIdPais] = useState([]);
  const [idEstado, setIdEstado] = useState([]);
  const [idMunicipio, setIdMunicipio] = useState([]);

  const [pais, setPais] = useState([]);
  const [estado, setEstado] = useState([]);
  const [municipio, setMunicipio] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-domicilio/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          const data = response.data;
          setDatos({
            ...datos,
            idDomicilioExt: data.ID_DOMICILIO_EXT,
            calle: data.CALLE,
            colonia: data.COLONIA,
            codigoPostal: data.CP,
            observaciones: data.OBSERVACIONES,
            telefono: data.TELEFONO,
          });
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const obtenerDomicilios = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-domicilio/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          setDomicilios(response.data)
        } else {
          console.error('Error al obtener los datos:', error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    const obtenerNombreMunicipio = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-domicilio/municipio/${id}`);
        if (response.data && response.data.length > 0) {
          setNombreMunicipio(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombreMunicipio: response.data[0].MUNICIPIO,
            idMunicipio: response.data[0].CLAVE_MPIO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const obtenerNombrePais = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-domicilio/pais/${id}`);
        if (response.data && response.data.length > 0) {
          setNombrePais(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombrePais: response.data[0].PAIS,
            idPais: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const obtenerNombreEntidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-domicilio/entidad/${id}`);
        if (response.data && response.data.length > 0) {
          setNombreEntidad(response.data)
          setDatos(prevState => ({
            ...prevState,
            nombreEntidad: response.data[0].ENTIDAD,
            idEntidad: response.data[0].ID_ESTADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };


    obtenerDatos();
    obtenerNombreEntidad();
    obtenerNombreMunicipio();
    obtenerNombrePais();
    obtenerDomicilios();

  }, [id]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Aquí se realizan todas las llamadas a las API
        const [datosResponse, entidadResponse, emisorResponse, municipioResponse, paisResponse] = await Promise.all([
          axios.get(`http://localhost:8081/e-domicilio/getdatos/${id}`),
          axios.get("http://localhost:8081/e-domicilio/getcatentidades"),
          axios.get("http://localhost:8081/e-domicilio/getcatemisor"),
          axios.get("http://localhost:8081/e-domicilio/getcatmunicipios"),
          axios.get("http://localhost:8081/e-domicilio/getcatpaises")
        ]);

        // Aquí se actualizan los estados después de obtener todas las respuestas
        if (datosResponse.data && datosResponse.data.length > 0) {
          const data = datosResponse.data;
          setDatos({
            ...datos,
            idDomicilioExt: data.ID_DOMICILIO_EXT,
            calle: data.CALLE,
            colonia: data.COLONIA,
            codigoPostal: data.CP,
            observaciones: data.OBSERVACIONES,
            telefono: data.TELEFONO,
          });
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado');
        }

        if (entidadResponse.data && entidadResponse.data.length > 0) {
          setIdEstado(entidadResponse.data);
          setEstado(entidadResponse.data);
          setDatos(prevState => ({
            ...prevState,
            entidad: entidadResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron entidades');
        }

        if (municipioResponse.data && municipioResponse.data.length > 0) {
          setIdMunicipio(municipioResponse.data);
          setMunicipio(municipioResponse.data);
          setDatos(prevState => ({
            ...prevState,
            municipio: municipioResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron municipios');
        }

        if (paisResponse.data && paisResponse.data.length > 0) {
          setIdPais(paisResponse.data);
          setPais(paisResponse.data);
          setDatos(prevState => ({
            ...prevState,
            pais: paisResponse.data,
          }));
        } else {
          console.error('Error: No se encontraron países');
        }

      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, [id]);


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

  const handleModificarClick = async (index) => {
    const domicilioSeleccionado = domicilios[index];

    const paisSeleccionado = nombrePais[index];
    const municipioSeleccionado = nombreMunicipio[index];
    const entidadSeleccionado = nombreEntidad[index];

    const idPaisSeleccionado = idPais[index];
    const idEstadoSeleccionado = idEstado[index];
    const idMunicipioSeleccionado = idMunicipio[index];

    const arrayPaisSeleccionado = pais[index];
    const arrayEstadoSeleccionado = estado[index];
    const arrayMunicipioSeleccionado = municipio[index];

    // Actualizar el estado con la información obtenida
    setDatos(prevDatos => ({
      ...prevDatos,
      idDomicilioExt: domicilioSeleccionado.ID_DOMICILIO_EXT,
      calle: domicilioSeleccionado.CALLE,
      colonia: domicilioSeleccionado.COLONIA,
      codigoPostal: domicilioSeleccionado.CP,
      observaciones: domicilioSeleccionado.OBSERVACIONES,
      telefono: domicilioSeleccionado.TELEFONO,
      nombreMunicipio: nombreMunicipio[index].MUNICIPIO,
      nombrePais: nombrePais[index].PAIS,
      nombreEntidad: nombreEntidad[index].ENTIDAD,
      idPais: nombrePais[index].CLAVE,
      idEntidad: nombreEntidad[index].ID_ESTADO,
      idMunicipio: nombreMunicipio[index].CLAVE_MPIO,
    }));
    setMostrarFormulario(true); // Mostrar el formulario después de actualizar los datos
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    // Validar que el campo no esté vacío
    if (value.trim() === '') {
      errorMessage = 'Este campo no puede estar vacío.';
    }

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'calle':
        if (value.includes('  ')) {
          errorMessage = 'El campo calle no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo calle no puede terminar con un espacio.';
        }
        break;
      case 'colonia':
        if (value.includes('  ')) {
          errorMessage = 'El campo colonia no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo colonia no puede terminar con un espacio.';
        }
        break;
      case 'codigoPostal':
        if (value.includes('  ')) {
          errorMessage = 'El campo código postal no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo codigo postal no puede terminar con un espacio.';
        }
        break;
      case 'telefono':
        if (value.includes('  ')) {
          errorMessage = 'El campo telefono no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo telefono no puede terminar con un espacio.';
        }
        break;
      case 'observaciones':
        if (value.includes('  ')) {
          errorMessage = 'El campo observaciones no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo observaciones no puede terminar con un espacio.';
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
    // Verifica si hay errores antes de intentar actualizar los datos
    if (Object.values(errors).some(error => error !== '')) {
      alert("No puedes guardar porque existen errores !!");
    } else {
      try {
        const response = await axios.put(`http://localhost:8081/e-domicilio/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };


  return (
    <>

      <div className="mb-12 row">

        <h3 style={{color:'black'}}>Edicion Domicilio</h3>

        {mostrarFormulario ? (
          <>
            <div className='table-container form'>
              <div className='mb-3 row'>
                <div className="col-sm-6">
                  <label className="form-label">País</label>
                  {datos.nombrePais && datos.nombrePais.length > 0 && (
                    <select
                      name="idPais"
                      id='ID_PAIS'
                      className="form-select"
                      value={datos.idPais}
                      onChange={handleSelectChange}>
                      <option value="">{datos.nombrePais}</option>
                      {pais.map(pa => (
                        <option key={pa.CLAVE} value={pa.CLAVE}>{pa.PAIS}</option>
                      ))}

                    </select>
                  )}
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Estado</label>
                  {datos.nombreEntidad && datos.nombreEntidad.length > 0 && (
                    <select
                      name="idEntidad"
                      id='ID_ENTIDAD'
                      className="form-select"
                      value={datos.idEntidad}
                      onChange={handleSelectChange}>
                      <option value="">{datos.nombreEntidad}</option>

                      {estado.map(est => (
                        <option key={est.ID_ESTADO} value={est.ID_ESTADO}>{est.ENTIDAD}</option>
                      ))}

                    </select>
                  )}
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Municipio</label>
                  {datos.nombreMunicipio && datos.nombreMunicipio.length > 0 && (
                    <select
                      name="idMunicipio"
                      id='ID_MUNICIPIO'
                      className="form-select"
                      value={datos.idMunicipio}
                      onChange={handleSelectChange}>
                      <option value="">{datos.nombreMunicipio}</option>

                      {municipio.map(muni => {
                        return <option key={muni.CLAVE_MPIO} value={muni.CLAVE_MPIO}>{muni.MUNICIPIO}</option>
                      })}

                    </select>
                  )}
                </div>
              </div>
              <div className="mb-3 row">

              </div>

              <div className="mb-3 row">
                <h3>Datos General</h3>
                <div className="col-sm-3">
                  <label className="form-label">Calle</label>
                  <input type="text" className="form-control" name="calle" id="CALLE" value={datos.calle} placeholder="" onChange={handleChange}></input>
                  <span className="error-message">{errors.calle}</span>
                </div>

                <input type="hidden" className="form-control" name="idDomicilioExt" id="ID_DOMICILIO_EXT" value={datos.id_domicilio_ext} onChange={handleChange}></input>

                <div className="col-sm-3">
                  <label className="form-label">Colonia</label>
                  <input type="text" className="form-control" name="colonia" id="COLONIA" value={datos.colonia} placeholder="" onChange={handleChange}></input>
                  <span className="error-message">{errors.colonia}</span>
                </div>

                <div className="col-sm-3">
                  <label className="form-label">Codigo Postal</label>
                  <input type="text" className="form-control" name="codigoPostal" id="CP" value={datos.codigoPostal} placeholder="" onChange={handleChange}></input>
                  <span className="error-message">{errors.codigoPostal}</span>
                </div>

                <div className="col-sm-3">
                  <label className="form-label">Telefono</label>
                  <input type="text" className="form-control" name="telefono" id="TELEFONO" value={datos.telefono} placeholder="" onChange={handleChange}></input>
                  <span className="error-message">{errors.telefono}</span>
                </div>

                <div className="col-sm-3">
                  <label className="form-label">Observaciones</label>
                  <input type="text" className="form-control" name="observaciones" id="OBSERVACIONES" value={datos.observaciones} placeholder="" onChange={handleChange}></input>
                  <span className="error-message">{errors.observaciones}</span>
                </div>

              </div>


              <div className="mb-3 row">
                <div className="col-sm-4">
                  <button className="btn btn-success" onClick={handleUpdateProceso}><FaCheck className="mr-2" /></button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='table-container large'>
            <div className="table-responsive">
              {domicilios.length > 0 ? (
                <table className="table table-striped table-hover">
                  {/* Cabecera de la tabla */}
                  <thead className="table-info">
                    <tr>
                      <th>Id Domicilio Extra</th>
                      <th>Calle</th>
                      <th>Colonia</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  {/* Cuerpo de la tabla */}
                  <tbody>
                    {domicilios.map((domicilio, index) => (
                      <tr key={index}>
                        <td>{domicilio.ID_DOMICILIO_EXT}</td>
                        <td>{domicilio.CALLE}</td>
                        <td>{domicilio.COLONIA}</td>
                        <td>
                          <button
                            onClick={() => handleModificarClick(index)}
                            className="btn btn-secondary mr-2"
                            style={{ marginRight: '20px' }}
                          >
                            <FaEdit className="mr-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Mensaje cuando no hay registros
                <>
                  <br></br>
                  <label>NO EXISTEN REGISTROS...</label>
                </>
              )}
            </div>
          </div>
        )}

      </div>


    </>
  )
}

export default E_domicilio
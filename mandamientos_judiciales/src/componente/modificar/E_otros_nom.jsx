import React, { useState, useEffect } from 'react'
import "../../../src/index.css"
import axios from 'axios'
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_otros_nom = ({ id }) => {

  const [datos, setDatos] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    alias: '',
    idOtroNombreExt: '',
    nombreEmisor: '',
    idEmisor: '',
    emisor: []
  })

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    alias: '',
    // Agrega más campos de error según sea necesario
  });

  const [otrosNombres, setOtrosNombres] = useState([]);

  const [nombreEmisor, setNombreEmisor] = useState([]);
  const [idEmisor, setIdEmisor] = useState([]);
  const [emisor, setEmisor] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-otros-nombres/getdatos/${id}`)
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            nombre: data.O_NOMBRE,
            paterno: data.O_PATERNO,
            materno: data.O_MATERNO,
            alias: data.O_ALIAS,
          });
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    const obtenerOtrosNombres = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-otros-nombres/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          setOtrosNombres(response.data)
        } else {
          console.error('Error al obtener los datos:', error);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    const obtenerNombreEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-otros-nombres/emisor/${id}`);
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

    obtenerDatos()
    obtenerOtrosNombres()
    obtenerNombreEmisor()
  }, [id])

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Aquí se realizan todas las llamadas a las API
        const [emisorResponse] = await Promise.all([
          axios.get("http://localhost:8081/e-otros-nombres/getcatemisor")
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

  const handleModificarClick = async (idOtroNombreExt) => {
    const otroNombreSeleccionado = otrosNombres.find(otroNombre => otroNombre.ID_OTRO_NOMBRE_EXT === idOtroNombreExt);

    if (otroNombreSeleccionado) {
      try {
        const response = await axios.get(`http://localhost:8081/e-otros-nombres/emisor/${idOtroNombreExt}`);
        if (response.data && response.data.length > 0) {
          const nombreEmisor = response.data[0].TIPO;
          const idEmisor = response.data[0].ID_EMISOR;

          setDatos(prevState => ({
            ...prevState,
            idOtroNombreExt: otroNombreSeleccionado.ID_OTRO_NOMBRE_EXT,
            nombre: otroNombreSeleccionado.O_NOMBRE,
            paterno: otroNombreSeleccionado.O_PATERNO,
            materno: otroNombreSeleccionado.O_MATERNO,
            alias: otroNombreSeleccionado.O_ALIAS,
            nombreEmisor,
            idEmisor
          }));
          setMostrarFormulario(true);
        } else {
          console.error('Error: No se encontraron los datos del emisor');
        }
      } catch (error) {
        console.error('Error al obtener los datos del emisor:', error);
      }
    } else {
      console.error('Error: No se encontró el otro nombre seleccionado');
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
      case 'nombre':
        // Verifica si hay un nombre proporcionado y si no hay apellidos
        if (value !== '' && datos.paterno === '' && datos.materno === '' && datos.alias !== '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Nombre" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Nombre" no puede terminar con espacio.'
        }
        break;
      case 'paterno':
        // Verifica si no hay apellido paterno cuando hay nombre
        if (datos.nombre !== '' && datos.materno === '' && value == '' && datos.alias !== '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Paterno" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Paterno" no puede terminar con espacio.'
        }
        break;
      case 'materno':
        // Verifica si no hay apellido materno cuando hay nombre
        if (datos.nombre !== '' && datos.paterno === '' && value == '' && datos.alias !== '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Materno" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Materno" no puede terminar con espacio.'
        }
      case 'alias':
        if (datos.nombre === '' && value === '') {
          errorMessage = 'Ingrese un alias en caso de no tener un nombre y apellido.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Alias" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Alias" no puede terminar con espacio.'
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
        const response = await axios.put(`http://localhost:8081/e-otros-nombres/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };

  return (
    <>


      <div className="mb-12 row">
        <h3 style={{color:'black'}}>Edicion Otros Nombres</h3>

        {mostrarFormulario ? (
          <>
            <div className='table-container form'>
              <div className="mb-3 row">
               
                <div className="col-sm-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="O_NOMBRE" name="nombre" placeholder="" value={datos.nombre} onChange={handleChange}></input>
                  <input type="hidden" className="form-control" name="idOtroNombreExt" id="ID_OTRO_NOMBRE_EXT" value={datos.idOtroNombreExt} onChange={handleChange}></input>
                  <span className="error-message">{errors.nombre}</span>
                </div>
                <div className="col-sm-3">
                  <label className="form-label">Paterno</label>
                  <input type="text" className="form-control" id="O_PATERNO" name="paterno" placeholder="" value={datos.paterno} onChange={handleChange}></input>
                  <span className="error-message">{errors.paterno}</span>
                </div>
                <div className="col-sm-3">
                  <label className="form-label"> Materno</label>
                  <input type="text" className="form-control" name="materno" id="O_MATERNO" placeholder="" value={datos.materno} onChange={handleChange}></input>
                  <span className="error-message">{errors.materno}</span>
                </div>
                <div className="col-sm-3">
                  <label className="form-label">Alias</label>
                  <input type="text" className="form-control" name="alias" id="O_ALIAS" placeholder="" value={datos.alias} onChange={handleChange}></input>
                  <span className="error-message">{errors.alias}</span>
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-sm-4">
                  <button className="btn btn-success" onClick={handleUpdateProceso}><FaCheck className='mr-2' /></button>
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
                    <th>Id Otro Nombre Extra</th>
                    <th>Nombre</th>
                    <th>Paterno</th>
                    <th>Materno</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                {/* Cuerpo de la tabla */}
                <tbody>
                  {otrosNombres.map((oNombres, index) => (
                    <tr key={index}>
                      <td>{oNombres.ID_OTRO_NOMBRE_EXT}</td>
                      <td>{oNombres.O_NOMBRE}</td>
                      <td>{oNombres.O_PATERNO}</td>
                      <td>{oNombres.O_MATERNO}</td>
                      <td>
                        <button
                          onClick={() => handleModificarClick(oNombres.ID_OTRO_NOMBRE_EXT)}
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

      </div>


    </>
  )
}
export default E_otros_nom
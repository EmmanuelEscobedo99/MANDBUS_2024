import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import "../../../src/index.css"
import { useParams } from 'react-router-dom';
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';
import useTokenLogin from '../../useTokenLogin';

const E_datosgrls = ({ id }) => {
  const hasToken = useTokenLogin();
  const [datos, setDatos] = useState({

    nombreEstadoJuzgado: '',
    idEstadoJuzgado: '',
    juzgadoPorEstado: [],

    noMandato: '',
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    alias: '',
    edad: '',
    sexo: '',
    estatura: '',
    peso: '',
    oficio: '',
    fechaOficio: '',
    noCausa: '',
    tipoCuantia: '',
    nacionalidad: '',
    usaAnteojos: '',

    nombreEmisor: '',
    idEmisor: '',
    nombreMunicipio: '',
    idMunicipio: '',
    nombreJuzgado: '',
    idJuzgado: '',
    nombreCuantia: '',
    idCuantia: '',
    nombreNacionalidad: '',
    idNacionalidad: '',
    nombreSexo: '',
    idSexo: '',
    nombreEstadoJuzgado: '',
    idEstadoJuzgado: '',

    emisor: [],
    municipio: [],
    juzgado: [],
    juzgadoPorEstado: [],
    cuantia: [],
    nacionalidad: [],
    sexo: [],
    estadoJuzgado: []
  })

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    noMandato: '',
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    edad: '',
    estatura: '',
    peso: '',
    oficio: '',
    noCausa: '',
    usaAnteojos: ''
    // Agrega más campos de error según sea necesario
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/edatosgenerales/${id}`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            noMandato: data.NO_MANDATO,
            nombre: data.NOMBRE,
            aPaterno: data.APATERNO,
            aMaterno: data.AMATERNO,
            alias: data.ALIAS,
            edad: data.EDAD,
            estatura: data.ESTATURA,
            peso: data.PESO,
            oficio: data.OFICIO_JUZGADO,
            fechaOficio: new Date(data.FECHA_OFICIO).toISOString().split('T')[0],
            noCausa: data.NO_CAUSA,
            usaAnteojos: data.ID_USO_ANTEOJOS
          })
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    };

    const obtenerNombreEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/emisor/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEmisor: response.data[0].TIPO,
            idEmisor: response.data[0].ID_EMISOR,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    };

    const obtenerNombreMunicipio = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/municipio/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreMunicipio: response.data[0].MUNICIPIO,
            idMunicipio: response.data[0].CLAVE_MPIO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    };

    const obtenerNombreJuzgado = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/juzgado/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreJuzgado: response.data[0].DESCRIP_JUZGADO,
            idJuzgado: response.data[0].ID_JUZGADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreCuantia = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/tipocuantia/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreCuantia: response.data[0].TIPO,
            idCuantia: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreNacionalidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/nacionalidad/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreNacionalidad: response.data[0].NACIONALIDAD,
            idNacionalidad: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreSexo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/sexo/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreSexo: response.data[0].TIPO,
            idSexo: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreEstadoJuzgado = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-datos-generales/estadojuzgado/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEstadoJuzgado: response.data[0].ENTIDAD,
            idEstadoJuzgado: response.data[0].ID_ESTADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    obtenerDatos();
    obtenerNombreEmisor();
    obtenerNombreMunicipio();
    obtenerNombreJuzgado();
    obtenerNombreCuantia();
    obtenerNombreNacionalidad();
    obtenerNombreSexo();
    obtenerNombreEstadoJuzgado();
  }, [id])

  useEffect(() => {
    const obtenerEmisor = async () => {
      try {
        const responseEmisor = await axios.get("http://localhost:8081/e-datos-generales/getcatemisor");
        if (responseEmisor.data && responseEmisor.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            emisor: responseEmisor.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerMunicipio = async () => {
      try {
        const responseMunicipio = await axios.get("http://localhost:8081/e-datos-generales/getcatmunicipios");
        if (responseMunicipio.data && responseMunicipio.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            municipio: responseMunicipio.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerJuzgado = async () => {
      try {
        const responseJuzgado = await axios.get("http://localhost:8081/e-datos-generales/getcatjuzgados");
        if (responseJuzgado.data && responseJuzgado.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            juzgado: responseJuzgado.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };



    const obtenerCuantia = async () => {
      try {
        const responseCuantia = await axios.get("http://localhost:8081/e-datos-generales/gettipocuantia");
        if (responseCuantia.data && responseCuantia.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            cuantia: responseCuantia.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerNacionalidad = async () => {
      try {
        const responseNacionalidad = await axios.get("http://localhost:8081/e-datos-generales/getcatnacionalidad");
        if (responseNacionalidad.data && responseNacionalidad.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nacionalidad: responseNacionalidad.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerSexo = async () => {
      try {
        const responseSexo = await axios.get("http://localhost:8081/e-datos-generales/getcatsexo");
        if (responseSexo.data && responseSexo.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            sexo: responseSexo.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerEstadoJuzgado = async () => {
      try {
        const responseEstadoJuzgado = await axios.get("http://localhost:8081/e-datos-generales/getcatestadojuzgado");
        if (responseEstadoJuzgado.data && responseEstadoJuzgado.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            estadoJuzgado: responseEstadoJuzgado.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    obtenerEmisor();
    obtenerMunicipio();
    obtenerJuzgado();
    obtenerCuantia();
    obtenerNacionalidad();
    obtenerSexo();
    obtenerEstadoJuzgado();
  }, [])

  useEffect(() => {
    const obtenerJuzgadoPorEstado = async () => {
      try {
        const responseJuzgado = await axios.get(`http://localhost:8081/e-datos-generales/getjuzgadosestado/${datos.idEstadoJuzgado}`);
        console.log(responseJuzgado.data);
        if (responseJuzgado.data && Array.isArray(responseJuzgado.data) && responseJuzgado.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            juzgadoPorEstado: responseJuzgado.data,
            idJuzgado: responseJuzgado.data[0].ID_JUZGADO, // Suponiendo que quieres el ID del primer juzgado
          }));
        } else {
          console.error('Error: No se encontraron juzgados para el estado seleccionado');
          setDatos(prevState => ({
            ...prevState,
            juzgadoPorEstado: [], // Inicializa como arreglo vacío si no hay datos válidos
          }));
        }
      } catch (error) {
        console.error('Error al obtener juzgados:', error);
      }
    };

    obtenerJuzgadoPorEstado();
  }, [datos.idEstadoJuzgado]);




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

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'noMandato':
        if (value.includes('  ')) {
          errorMessage = 'El campo "No de mandato" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "No de mandato" no puede terminar en espacio.'
        }
        break;
      case 'nombre':
        // Verifica si hay un nombre proporcionado y si no hay apellidos
        if (value !== '' && (datos.aPaterno === '' && datos.aMaterno === '')) {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "nombre" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "nombre" no puede terminar con un espacio.'
        }
        break;
      case 'aPaterno':
        // Verifica si no hay apellido paterno cuando hay nombre
        if (datos.nombre !== '' && value === '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Apellido Paterno" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Apellido Paterno" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'aMaterno':
        // Verifica si no hay apellido materno cuando hay nombre
        if (datos.nombre !== '' && value === '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Apellido Materno" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Apellido Materno" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'alias':
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Alias" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Alias" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'edad':
        if (!Number.isInteger(Number(value))) {
          errorMessage = 'La estatura debe ser un número entero.';
        } else {
          errorMessage = ''; // Limpiar el mensaje de error si la validación pasa
        }
        if (isNaN(value) || value < 12 || value > 100) {
          errorMessage = 'La edad no puede ser menor a 12 o mayor a 100';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Edad" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Edad" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'estatura':
        if (isNaN(value) || value.endsWith(' ')) {
          errorMessage = 'El campo "Estatura" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Estatura" no puede tener mas de dos espacios consecutivos.'
        }
        // Verifica si la estatura es un número entero
        if (!Number.isInteger(Number(value))) {
          errorMessage = 'La estatura debe ser un número entero en centímetros.';
        } else {
          errorMessage = ''; // Limpiar el mensaje de error si la validación pasa
        }
        break;
      case 'peso':
        if (isNaN(value) || value.endsWith(' ')) {
          errorMessage = 'El campo "Peso" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Peso" no puede tener mas de dos espacios consecutivos.'
        }
        // Verifica si la estatura es un número entero
        if (!Number.isInteger(Number(value))) {
          errorMessage = 'El peso debe ser un entero en kilogramos.';
        } else {
          errorMessage = ''; // Limpiar el mensaje de error si la validación pasa
        }
        break;
      case 'oficio':
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Oficio" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Oficio" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'noCausa':
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Oficio" no puede terminar en espacio.'
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Oficio" no puede tener mas de dos espacios consecutivos.'
        }
        break;
      case 'usaAnteojos':
        // Verifica si el valor es distinto de 'S' (Si usa anteojos) o 'N' (No usa anteojos)
        if (value !== 'S' && value !== 'N') {
          errorMessage = 'Los valores aceptados para este campo son "S" (Si usa anteojos) o "N" (No usa anteojos).';
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
        const response = await axios.put(`http://localhost:8081/e-datos-generales/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };


  return (
    <>
      <div className="mb-3 row">
        {/*<h3>Edicion Datos generales</h3>*/}
        <div className='table-container form'>
          <h3 style={{color:'black'}}>Edición de Datos Generales</h3>

          <div className='mb-3 row'>
            <div className="col-sm-4">
              <label className="form-label">N° de mandato</label>
              <input type="text" className="form-control" id="NO_MANDATO" name="noMandato" placeholder="" value={datos.noMandato} onChange={handleChange} ></input>
              {/* Muestra el mensaje de error debajo del campo */}
              <span className="error-message">{errors.noMandato}</span>
            </div>
            <div className="col-sm-4">
              <label className="form-label">Municipio</label>

              <select
                name="idMunicipio"
                id='ID_MUNICIPIO'
                className="form-select"
                value={datos.idMunicipio}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreMunicipio}</option>
                {datos.municipio.map(muni => (
                  <option key={muni.CLAVE_MPIO} value={muni.CLAVE_MPIO}>{muni.MUNICIPIO}</option>
                ))}
              </select>

            </div>
          </div>
        </div>


        <div className='table-container form'>
          <div className="mb-3 row">

            <div className="col-sm-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" name="nombre" id="NOMBRE" placeholder="" value={datos.nombre} onChange={handleChange}></input>
              <span className="error-message">{errors.nombre}</span>
            </div>

            <div className="col-sm-3">
              <label className="form-label">Apellido paterno</label>
              <input type="text" className="form-control" name="aPaterno" id="APATERNO" placeholder="" value={datos.aPaterno} onChange={handleChange}></input>
              <span className="error-message">{errors.aPaterno}</span>
            </div>

            <div className="col-sm-3">
              <label className="form-label">apellido materno</label>
              <input type="text" className="form-control" name="aMaterno" id="AMATERNO" placeholder="" value={datos.aMaterno} onChange={handleChange}></input>
              <span className="error-message">{errors.aMaterno}</span>
            </div>

            <div className="col-sm-3">
              <label className="form-label">alias</label>
              <input type="text" className="form-control" name="alias" id="ALIAS" placeholder="" value={datos.alias} onChange={handleChange}></input>
              <span className="error-message">{errors.alias}</span>
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-sm-3">
              <label className="form-label">edad</label>
              <input type="text" className="form-control" name="edad" id="EDAD" placeholder="" value={datos.edad} onChange={handleChange}></input>
              <span className="error-message">{errors.edad}</span>
            </div>

            <div className='col-sm-3'>
              <label className="form-label">sexo</label>
              {datos.nombreSexo && datos.nombreSexo.length > 0 && (
                <select
                  name="idSexo"
                  id='ID_SEXO'
                  className="form-select"
                  value={datos.idSexo}
                  onChange={handleSelectChange}>
                  <option value="">{datos.nombreSexo}</option>
                  {datos.sexo.map(sex => (
                    <option key={sex.CLAVE} value={sex.CLAVE}>{sex.TIPO}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-sm-3">
              <label className="form-label">estatura</label>
              <input type="text" className="form-control" name="estatura" id="ESTATURA" placeholder="" value={datos.estatura} onChange={handleChange}></input>
              <span className="error-message">{errors.estatura}</span>
            </div>

            <div className="col-sm-3">
              <label className="form-label">peso</label>
              <input type="text" className="form-control" name="peso" id="PESO" placeholder="" value={datos.peso} onChange={handleChange}></input>
              <span className="error-message">{errors.peso}</span>
            </div>
          </div>
        </div>

        <div className='table-container form'>
          <div className="mb-3 row">

            <div className="col-sm-4">
              <div>
                <label htmlFor="idEstadoJuzgado">Estado Juzgado:</label>
                <select
                  className='form-select'
                  name="idEstadoJuzgado"
                  id="idEstadoJuzgado"
                  value={datos.idEstadoJuzgado}
                  onChange={(event) => {
                    handleSelectChange(event);
                    obtenerJuzgadoPorEstado(); // Llama a obtenerJuzgadoPorEstado cuando cambie el estado del juzgado
                  }}
                >
                  <option value="">Seleccione un estado de juzgado</option>
                  {datos.estadoJuzgado.map(ej => (
                    <option key={ej.ID_ESTADO} value={ej.ID_ESTADO}>{ej.ENTIDAD}</option>
                  ))}
                </select>
                <label className="form-label">oficio</label>
                <input type="text" className="form-control" name="oficio" id="OFICIO_JUZGADO" placeholder="" value={datos.oficio} onChange={handleChange}></input>
                <span className="error-message">{errors.oficio}</span>

              </div>

            </div>

            <div className="col-sm-4">
              <label htmlFor="juzgadoPorEstado">Juzgado por Estado:</label>
              <select
                className='form-select'
                name="idJuzgado" // Asegúrate de que name sea correcto según tu estructura de datos
                id="juzgadoPorEstado"
                value={datos.idJuzgado}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione un juzgado</option>
                {datos.juzgadoPorEstado.map(juzgado => (
                  <option key={juzgado.ID_JUZGADO} value={juzgado.ID_JUZGADO}>{juzgado.DESCRIP_JUZGADO}</option>
                ))}
              </select>
            </div>

            <div className="col-sm-4">
              <label className="form-label">Fecha de oficio</label>
              <input type="date" className="form-control" name="fechaOficio" id="FECHA_OFICIO" placeholder="" value={datos.fechaOficio} onChange={handleChange}></input>
            </div>
            <div className="col-sm-4">
              <label className="form-label">N° causa</label>
              <input type="text" className="form-control" name="noCausa" id="NO_CAUSA" placeholder="" value={datos.noCausa} onChange={handleChange}></input>
              <span className="error-message">{errors.noCausa}</span>
            </div>
            <div className="col-sm-4">
              <label className="form-label">Tipo cuantia</label>
              {datos.nombreCuantia && datos.nombreCuantia.length > 0 && (
                <select
                  name="idCuantia"
                  id='IDCuantia'
                  className="form-select"
                  value={datos.idCuantia}
                  onChange={handleSelectChange}>
                  <option value="">{datos.nombreCuantia}</option>
                  {datos.cuantia.map(cua => (
                    <option key={cua.CLAVE} value={cua.CLAVE}>{cua.TIPO}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-sm-4">
              <label className="form-label">Usa anteojos</label>
              <input type="text" className="form-control" name="usaAnteojos" id="ID_USO_ANTEOJOS" placeholder="" value={datos.usaAnteojos} onChange={handleChange}></input>
              <span className="error-message">{errors.usaAnteojos}</span>
            </div>
            <div className="col-sm-4">

              <div className="col-sm-12">
                <label className="form-label">Nacionalidad del individuo</label>
                {datos.nombreNacionalidad && datos.nombreNacionalidad.length > 0 && (
                  <select
                    name="idNacionalidad"
                    id='ID_NACIONALIDAD'
                    className="form-select"
                    value={datos.idNacionalidad}
                    onChange={handleSelectChange}>
                    <option value="">{datos.nombreNacionalidad}</option>
                    {datos.nacionalidad.map(nac => (
                      <option key={nac.CLAVE} value={nac.CLAVE}>{nac.NACIONALIDAD}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="mb-3 row">
            <div className='col-sm-4'>
              <button className='btn btn-success' onClick={handleUpdateProceso}>
                <FaCheck className='mr-2' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default E_datosgrls;



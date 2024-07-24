import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../src/index.css";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_delitos = ({ id }) => {

  const [datos, setDatos] = useState({
    delitoExt: [],
    nombreDelito: [],
    idDelito: [],
    nombreEmisor: [],
    idEmisor: [],
    nombreModalidad: '',
    idModalidad: '',
    idDelitoHidden: '',
    delExt: '',

    delito: [],
    emisor: [],
  })

  const [modalidades, setModalidades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-delitos/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          const delitoExt = response.data.map(item => item.ID_DELITO_EXT);
          const idDelito = response.data.map(item => item.ID_DELITO);
          const idEmisor = response.data.map(item => item.ID_EMISOR)
          setDatos({
            ...datos,
            delitoExt,
            idDelito,
            idEmisor,
          });
          // Obtener nombres de los delitos
          const nombresDelitosResponse = await axios.get(`http://localhost:8081/e-delitos/delito/${id}`);
          if (nombresDelitosResponse.data && nombresDelitosResponse.data.length > 0) {
            const nombreDelito = nombresDelitosResponse.data.map(item => item.DESCRIP_DELITO);
            setDatos(prevState => ({
              ...prevState,
              nombreDelito,
            }));
          }
          const nombresEmisorResponse = await axios.get(`http://localhost:8081/e-delitos/emisor/${id}`);
          if (nombresEmisorResponse.data && nombresEmisorResponse.data.length > 0) {
            const nombreEmisor = nombresEmisorResponse.data.map(item => item.TIPO);
            setDatos(prevState => ({
              ...prevState,
              nombreEmisor,
            }));
          }
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const obtenerNombreTipoModalidad = async () => {
      try {
        if (selectedRowIndex !== null) { // Verificar si selectedRowIndex no es null
          const response = await axios.get(`http://localhost:8081/e-delitos/modalidad/${id}`)
          if (response.data && response.data.length > 0) {
            setDatos(prevState => ({
              ...prevState,
              nombreModalidad: response.data[selectedRowIndex].DESCRIP_MODALIDAD,
              idModalidad: response.data[selectedRowIndex].CLAVE_MODALIDAD,
            }));
          } else {
            console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
          }
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    obtenerNombreTipoModalidad()
  }, [selectedRowIndex])


  useEffect(() => {
    const obtenerDelito = async () => {
      try {
        const responseDelito = await axios.get("http://localhost:8081/e-delitos/getcatdelitos");
        if (responseDelito.data && responseDelito.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            delito: responseDelito.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerCatEmisor = async () => {
      try {
        const responseEmisor = await axios.get("http://localhost:8081/e-delitos/getcatemisor");
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

    obtenerDelito()
    obtenerCatEmisor()
  }, [])

  useEffect(() => {
    const obtenerModalidadesPorDelito = async () => {
      try {
        if (selectedRowIndex !== null && datos.idDelito[selectedRowIndex]) {
          const responseModalidad = await axios.get(`http://localhost:8081/e-delitos/modalidades/${datos.idDelito[selectedRowIndex]}`);
          if (responseModalidad.data && responseModalidad.data.length > 0) {
            setModalidades(responseModalidad.data);
          } else {
            console.error('Error: No se encontraron modalidades');
          }
        }
      } catch (error) {
        console.error('Error al obtener modalidades:', error);
      }
    };

    obtenerModalidadesPorDelito();
  }, [selectedRowIndex, datos.idDelito]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const handleSelectChange = (event, index) => {
    const { name, value } = event.target;
    const newIdDelito = [...datos.idDelito];
    newIdDelito[index] = value;
    setDatos({
      ...datos,
      idDelito: newIdDelito,
      idDelitoHidden: value,
    });
  };

  const handleSelectEmisorChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleUpdateProceso = async () => {
    try {
      // Incluir delExt en los datos enviados al servidor
      const datosActualizados = {
        ...datos,
        delExt: datos.delitoExt[selectedRowIndex] // Establecer delExt como el valor del delitoExt correspondiente
      };

      console.log(datosActualizados)

      const response = await axios.put(`http://localhost:8081/e-delitos/actualizar/${id}`, datosActualizados);
      if (response.status === 200) {
        alert('Datos actualizados correctamente!');
      } else {
        console.error('Error al actualizar los datos:', response.data);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };


  const handleModificarClick = (index) => {
    setMostrarFormulario(true);
    setSelectedRowIndex(index);
  };

  return (
    <>

      <div className="mb-12 row">
        <h3 style={{color:'black'}}>Edición Delitos</h3>

        {mostrarFormulario ? (
          <div className='table-container large'>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-info">
                  <tr>
                    <th>Delito</th>
                    <th>Modalidad</th>
                    <th>Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        name='idDelito'
                        className="form-select"
                        value={datos.idDelito[selectedRowIndex]}
                        onChange={(e) => handleSelectChange(e, selectedRowIndex)}
                      >
                        <option value="">{datos.nombreDelito[selectedRowIndex]}</option>
                        {datos.delito.map((del) => (
                          <option key={del.CLAVE_DELITO} value={del.CLAVE_DELITO}>
                            {del.DESCRIP_DELITO}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="ID_MODALIDAD"
                        className="form-select"
                        value={datos.idModalidad[selectedRowIndex]}
                        onChange={handleChange}
                      >
                        <option value="">{datos.nombreModalidad}</option>
                        {modalidades.map((mod) => (
                          <option key={mod.CLAVE_MODALIDAD} value={mod.CLAVE_MODALIDAD}>
                            {mod.DESCRIP_MODALIDAD}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    <td>
                      <button className='btn btn-success' onClick={handleUpdateProceso}><FaCheck className='mr-2' /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='table-container large'>
            <div className="table-responsive">
              <table className="table table-striped table-hover">

                <thead className="table-info">
                  <tr>
                    <th>Id Delito Extra</th>
                    <th>Delito</th>
                    <th>Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.nombreDelito.map((nombreDelito, index) => (
                    <tr key={index}>
                      <th>
                        <label>{datos.delitoExt[index]}</label>
                      </th>
                      <th>
                        <div>
                          <label>{nombreDelito}</label>
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
      </div>

    </>
  );
};

export default E_delitos;

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Menu from '../menu/MenuLateral';
import Titulo from '../menu/Titulo';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import CryptoJS from 'crypto-js';
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';
import useRequireAuth from '../../useRequireAuth';
import useTokenLogin from '../../useTokenLogin';
import MenuModificar from '../menu/MenuModificar';

const Ver_errores = () => {
    const { id } = useParams();
    const hasToken = useTokenLogin();
    //useRequireAuth();
    const [movimientos, setMovimientos] = useState([]);
    const [llave, setLlave] = useState([]);
    const [datosGenerales, setDatosGenerales] = useState([]);
    const [errores, setErrores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageRegistrosErrores, setCurrentPageRegistrosErrores] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const perPage = 12;

    useEffect(() => {
        obtenerMovimientos();
        obtenerDatosGenerales();
        obtenerErrores();
    }, []);

    useEffect(() => {
        // Obtener la llave para cada registro de error
        errores.forEach(error => {
            obtenerLlave(error.LLAVE);
        });
    }, [errores]); // Ejecutar cuando errores cambie

    const encryptId = (id) => {
        try {
            const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'clave_secreta').toString();
            return encodeURIComponent(encryptedId);  // Asegúrate de codificar la URL
        } catch (error) {
            console.error("Error al encriptar el ID:", error);
            return null;
        }
    };

    const obtenerMovimientos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/getmovimientos');
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
        }
    };

    const obtenerDatosGenerales = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/getdatosgenerales');
            setDatosGenerales(response.data);
        } catch (error) {
            console.error('Error al obtener los datos generales:', error);
        }
    };

    const obtenerErrores = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/geterror');
            setErrores(response.data);
        } catch (error) {
            console.error('Error al obtener los errores:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerLlave = async (llave_error) => {
        try {
            const response = await axios.get(`http://localhost:8081/validar/getLlaveError/${llave_error}`);
            setLlave(response.data[0].LLAVE_1);
        } catch (error) {
            console.error('Error al obtener la llave:', error);
        }
    };

    const handlePageChangeRegistrosErrores = ({ selected }) => {
        setCurrentPageRegistrosErrores(selected);
    };

    const handleProcesado = async (idAlterna, registro, tipoInformacion) => {
        try {
            const [response1, response2] = await Promise.all([
                axios.put(`http://localhost:8081/validar/actualizar/${idAlterna}/${tipoInformacion}/${registro}`),
                axios.delete(`http://localhost:8081/validar/borrarerror/${idAlterna}`)
            ]);

            window.location.reload(); // Esta línea debe ser revisada si hay una forma mejor de actualizar los datos sin recargar la página
        } catch (error) {
            console.error('Error al actualizar el estado del movimiento:', error);
        }
    };

    const registrosProcesados = movimientos.filter(mov => mov.PROCESADO === 2);
    const registrosPendientes = movimientos.filter(mov => mov.PROCESADO !== 2);

    const getDisplayRange = () => {
        const start = currentPage * perPage + 1;
        const end = Math.min((currentPage + 1) * perPage, errores.length);
        return `${start} a ${end}`;
    };

    return (
        <>
            <div className={`contenedor_principal_t ${hasToken ? '' : 'd-none'}`}>
                <Titulo />
                <MenuModificar />
                <div className='mb-12 row'>
                    <h3 style={{ color: 'black' }}>Registros Con Errores</h3>
                    <p className="card-text">Aquí se visualizan los registros validados por México que tuvieron errores.</p>
                    <div className='table-container'>
                        {isLoading ? (
                            <div className="loading" style={{color: 'black'}}>
                                CARGANDO...
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Registro</th>
                                                <th>Tipo Información</th>
                                                <th>Procesado</th>
                                                <th>Descripción</th>
                                                <th>Error</th>
                                                <th>Descripción del Error</th>
                                                <th>Modificar</th>
                                                <th>Refrescar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {errores.length === 0 && (
                                                <tr>
                                                    <td colSpan="8">No hay registros con errores.</td>
                                                </tr>
                                            )}
                                            {errores
                                                .slice(currentPageRegistrosErrores * perPage, (currentPageRegistrosErrores + 1) * perPage)
                                                .map((error, index) => {
                                                    const mov = movimientos.find(dato => dato.ID_ALTERNA === error.ID_ALTERNA);

                                                    return (
                                                        <tr key={index}>
                                                            <td>{error ? error.LLAVE : 'No disponible'}</td>
                                                            <td>{mov ? (() => {
                                                                switch (mov.TIPO_INFORMACION) {
                                                                    case 1:
                                                                        return 'Datos Generales';
                                                                    case 2:
                                                                        return 'Domicilio';
                                                                    case 3:
                                                                        return 'Delitos';
                                                                    case 4:
                                                                        return 'Otros Nombres';
                                                                    case 5:
                                                                        return 'Amparos';
                                                                    case 6:
                                                                        return 'Proceso';
                                                                    case 7:
                                                                        return 'Imagen';
                                                                    case 8:
                                                                        return 'Media Filiación';
                                                                    case 9:
                                                                        return 'Ministerial';
                                                                    case 10:
                                                                        return 'Colaboración';
                                                                    default:
                                                                        return 'No disponible';
                                                                }
                                                            })() : 'No disponible'}</td>
                                                            <td>{mov ? mov.PROCESADO : 'No disponible'}</td>
                                                            <td>{mov ? (() => {
                                                                switch (mov.PROCESADO) {
                                                                    case -1:
                                                                        return 'Bloqueado';
                                                                    case 0:
                                                                        return 'En espera';
                                                                    case 1:
                                                                        return 'En proceso';
                                                                    case 2:
                                                                        return 'Procesado';
                                                                    case 3:
                                                                        return 'Error funcional';
                                                                    case 4:
                                                                        return 'Error técnico';
                                                                    default:
                                                                        return 'No disponible';
                                                                }
                                                            })() : 'No disponible'}</td>
                                                            <td>{error ? error.COD_ERROR : 'No disponible'}</td>
                                                            <td>{error ? error.DESC_ERROR : 'No disponible'}</td>
                                                            <td>
                                                                {mov && mov.PROCESADO === 3 && (
                                                                    <Link
                                                                        to={`/Modificar/${encryptId(error.LLAVE)}/${error.DESC_ERROR}`}
                                                                        className={`btn btn-secondary mr-2`}
                                                                    >
                                                                        <FaEdit className='mr-1' />
                                                                        Modificar
                                                                    </Link>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {mov && (mov.PROCESADO === 3 || mov.PROCESADO === 4) && (
                                                                    <button className='btn btn-warning' onClick={() => handleProcesado(mov.ID_ALTERNA, mov.LLAVE, mov.TIPO_INFORMACION)}>
                                                                        <FaSyncAlt className="mr-1" />
                                                                        Refrescar
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination-info">
                                    Mostrando registros {getDisplayRange()} de un total de {errores.length} registros
                                </div>
                                <ReactPaginate
                                    previousLabel={'Anterior'}
                                    nextLabel={'Siguiente'}
                                    breakLabel={'...'}
                                    pageCount={Math.ceil(errores.length / perPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChangeRegistrosErrores}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    previousClassName={'page-item'}
                                    nextClassName={'page-item'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousLinkClassName={'page-link'}
                                    nextLinkClassName={'page-link'}
                                    disabledClassName={'disabled'}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Ver_errores;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../menu/MenuLateral';
import Titulo from '../menu/Titulo';
import axios from 'axios';
import { FaCheck, FaEdit, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import useRequireAuth from '../../useRequireAuth';
import useTokenLogin from '../../useTokenLogin';
import MenuModificar from '../menu/MenuModificar';

const Ver_validados = () => {
    const hasToken = useTokenLogin();
    //useRequireAuth();
    const [movimientos, setMovimientos] = useState([]);
    const [datosGenerales, setDatosGenerales] = useState([]);
    const [errores, setErrores] = useState([]);
    const [filtros, setFiltros] = useState([]);
    const [currentPageRegistrosErrores, setCurrentPageRegistrosErrores] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const perPage = 5;

    useEffect(() => {
        obtenerMovimientos();
        obtenerDatosGenerales();
        obtenerErrores();
        cargarFiltros();
    }, []);

    const cargarFiltros = () => {
        const filtrosGuardados = localStorage.getItem('filtros');
        if (filtrosGuardados) {
            setFiltros(JSON.parse(filtrosGuardados));
        } else {
            setFiltros(movimientos);
        }
    };

    const obtenerMovimientos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/getmovimientos');
            console.log('Movimientos:', response.data);
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerDatosGenerales = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/getdatosgenerales');
            console.log('Datos Generales:', response.data);
            setDatosGenerales(response.data);
        } catch (error) {
            console.error('Error al obtener los datos generales:', error);
        }
    };

    const obtenerErrores = async () => {
        try {
            const response = await axios.get('http://localhost:8081/validar/geterror');
            console.log('Errores:', response.data);
            setErrores(response.data);
        } catch (error) {
            console.error('Error al obtener los errores:', error);
        }
    };

    const handlePageChangeRegistrosErrores = ({ selected }) => {
        setCurrentPageRegistrosErrores(selected);
    };

    const handleClean = async (TIPO_INFORMACION, LLAVE) => {
        const tipoInfoMap = {
            1: 'registro_temporal',
            2: 'reg_domicilio_temporal',
            3: 'reg_delitos_temporal',
            4: 'reg_otros_nom_temp',
            5: 'reg_amparos_temporal',
            6: 'reg_proceso_temporal',
            7: 'reg_imagen_temporal',
            8: 'reg_media_filiacion_temp',
            9: 'reg_ministerial_temporal',
            10: 'reg_colaboracion_temporal',
        };

        const tabla = tipoInfoMap[TIPO_INFORMACION];

        try {
            const response = await axios.delete(`http://localhost:8081/validar/borrartemp/${LLAVE}/${tabla}`);
            if (response.status === 200) {
                alert(`Tabla ${tabla} con llave ${LLAVE} borrada`);

                const response2 = await axios.get(`http://localhost:8081/validar/getTemp/${LLAVE}/${tabla}`);
                if (response2.status === 200) {
                    if (response2.data.length === 0) {
                        // Eliminar el registro del estado movimientos
                        const updatedMovimientos = movimientos.filter(mov => !(mov.LLAVE === LLAVE && mov.TIPO_INFORMACION === TIPO_INFORMACION));
                        setMovimientos(updatedMovimientos);
                        actualizarFiltros(LLAVE, TIPO_INFORMACION);
                        // Actualizar filtros locales
                        const nuevosFiltros = filtros.filter(mov => !(mov.LLAVE === LLAVE && mov.TIPO_INFORMACION === TIPO_INFORMACION));
                        setFiltros(nuevosFiltros);
                        localStorage.setItem('filtros', JSON.stringify(nuevosFiltros));

                    }
                } else {
                    console.error("Error en la solicitud para obtener los datos");
                }
            } else {
                alert('Error al borrar el registro');
            }
        } catch (error) {
            console.error('Error al borrar el registro:', error);
            alert('Error al borrar el registro');
        }
    }

    const actualizarFiltros = (LLAVE, TIPO_INFORMACION) => {
        const nuevosMovimientos = movimientos.filter(mov => !(mov.LLAVE === LLAVE && mov.TIPO_INFORMACION === TIPO_INFORMACION));
        setFiltros(nuevosMovimientos);
        localStorage.setItem('filtros', JSON.stringify(nuevosMovimientos));
    };

    const registrosProcesados = movimientos.filter(mov => mov.PROCESADO === 2);
    const ultimosRegistrosProcesados = registrosProcesados.slice(-10);
    console.log("Últimos registros procesados:", ultimosRegistrosProcesados);

    const getDisplayRange = () => {
        const start = currentPage * perPage + 1;
        const end = Math.min((currentPage + 1) * perPage, ultimosRegistrosProcesados.length);
        return `${start} a ${end}`;
    };

    return (
        <>
            <div className={`contenedor_principal_t ${hasToken ? '' : 'd-none'}`}>
                <Titulo />
                <MenuModificar />
                <div className='mb-12 row'>
                    <h3 style={{ paddingBottom: '20px', color: 'black' }}>Registros Validados por México</h3>
                    <p className='card-text' style={{ paddingBottom: '20px' }}>Aquí se visualizan los registros validados satisfactoriamente por México. Solo se muestran los últimos 10 registros más recientes.</p>
                    <div className='table-container large'>
                        {isLoading ? (
                            <div className="loading" style={{color: 'black'}}>
                                CARGANDO...
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover" style={{ height: '300px' }}>
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Registro</th>
                                                <th>Nombre</th>
                                                <th>Apellido Paterno</th>
                                                <th>Apellido Materno</th>
                                                <th>Alias</th>
                                                <th>Tipo Información</th>
                                                <th>Id Bloque Funcional</th>
                                                <th>Procesado</th>
                                                <th>Descripción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ultimosRegistrosProcesados.length === 0 ? (
                                                <tr>
                                                    <td colSpan="10">No hay registros validados.</td>
                                                </tr>
                                            ) : (
                                                ultimosRegistrosProcesados
                                                    .slice(currentPageRegistrosErrores * perPage, (currentPageRegistrosErrores + 1) * perPage)
                                                    .map((mov, index) => {
                                                        const datoGeneral = datosGenerales.find(dato => dato.LLAVE === mov.LLAVE);

                                                        if (datoGeneral) {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{datoGeneral.LLAVE}</td>
                                                                    <td>{datoGeneral.NOMBRE}</td>
                                                                    <td>{datoGeneral.APATERNO}</td>
                                                                    <td>{datoGeneral.AMATERNO}</td>
                                                                    <td>{datoGeneral.ALIAS}</td>
                                                                    <td>{
                                                                        (() => {
                                                                            switch (mov.TIPO_INFORMACION) {
                                                                                case 1:
                                                                                    return 'DATOS_GENERALES';
                                                                                case 2:
                                                                                    return 'DOMICILIO';
                                                                                case 3:
                                                                                    return 'DELITOS';
                                                                                case 4:
                                                                                    return 'OTROS_NOMBRES';
                                                                                case 5:
                                                                                    return 'AMPAROS';
                                                                                case 6:
                                                                                    return 'PROCESO';
                                                                                case 7:
                                                                                    return 'IMAGEN';
                                                                                case 8:
                                                                                    return 'MEDIA_FILIACION';
                                                                                case 9:
                                                                                    return 'MINISTERIAL';
                                                                                case 10:
                                                                                    return 'COLABORACION';
                                                                                default:
                                                                                    return 'Desconocido';
                                                                            }
                                                                        })()
                                                                    }
                                                                    </td>
                                                                    <td>{mov.ID_BLOQUE_FUNCIONAL}</td>
                                                                    <td>{mov.PROCESADO}</td>
                                                                    <td style={{ color: '#2AB42B' }}>
                                                                        {
                                                                            (() => {
                                                                                switch (mov.PROCESADO) {
                                                                                    case -1:
                                                                                        return 'BLOQUEADO';
                                                                                    case 0:
                                                                                        return 'EN ESPERA';
                                                                                    case 1:
                                                                                        return 'EN PROCESO';
                                                                                    case 2:
                                                                                        return 'PROCESADO';
                                                                                    case 3:
                                                                                        return 'ERROR FUNCIONAL';
                                                                                    case 4:
                                                                                        return 'ERROR TÉCNICO';
                                                                                    default:
                                                                                        return 'No disponible';
                                                                                }
                                                                            })()
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } else {
                                                            return (
                                                                <tr key={index}>
                                                                    <td colSpan="10">Datos generales no disponibles</td>
                                                                </tr>
                                                            );
                                                        }
                                                    })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination-info">
                                    Mostrando registros {getDisplayRange()} de un total de {ultimosRegistrosProcesados.length} registros
                                </div>
                                <ReactPaginate
                                    previousLabel={'Anterior'}
                                    nextLabel={'Siguiente'}
                                    breakLabel={'...'}
                                    pageCount={Math.ceil(ultimosRegistrosProcesados.length / perPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChangeRegistrosErrores}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousClassName={'page-item'}
                                    previousLinkClassName={'page-link'}
                                    nextClassName={'page-item'}
                                    nextLinkClassName={'page-link'}
                                    breakClassName={'page-item'}
                                    breakLinkClassName={'page-link'}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ver_validados;

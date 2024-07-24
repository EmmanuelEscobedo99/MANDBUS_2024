import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import useTokenLogin from '../../useTokenLogin';
import MenuModificar from '../menu/MenuModificar';
import Titulo from '../menu/Titulo';


const Ver_tablas = () => {
    const hasToken = useTokenLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const perPage = 10;

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/validar/buscar?searchTerm=${encodeURIComponent(searchTerm)}`);
            setSearchResults(response.data);
            setCurrentPage(0); // Reiniciar la página a la primera después de la búsqueda
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            setSearchResults([]);
        }
        setIsLoading(false);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const getDisplayRange = () => {
        const start = currentPage * perPage + 1;
        const end = Math.min((currentPage + 1) * perPage, searchResults.length);
        return `${start} - ${end}`;
    };

    return (
        <div className={`contenedor_principal_t ${hasToken ? '' : 'd-none'}`}>
            <Titulo />
            <MenuModificar />
            <div className='mb-12 row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h3 className='card-title'>Registros Pendientes de Validar por México</h3>
                        </div>
                        <div className='card-body'>
                            <p className='card-text'>Aquí se visualizan los registros validados por el Administrador pero NO por México.</p>
                            <div className='mb-3 input-group'>
                                <input
                                    type='text'
                                    className='form-control form-control-lg' // Cambia a form-control-sm para un input más pequeño
                                    placeholder='Ingrese un nombre para buscar.'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className='input-group-append'>
                                    <button className='btn btn-white' type='button' onClick={handleSearch}>
                                        <FaSearch style={{ fontSize: '25px' }}/>
                                    </button>
                                </div>
                                {isLoading && <span className='ml-2 loading-message'>Cargando...</span>}
                            </div>

                            <div className='table-responsive'>
                                <table className='table table-hover'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th></th>
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
                                        {searchResults.length === 0 ? (
                                            <tr>
                                                <td colSpan='10'>No se ha buscado ningún registro.</td>
                                            </tr>
                                        ) : (
                                            searchResults
                                                .slice(currentPage * perPage, (currentPage + 1) * perPage)
                                                .map((mov, index) => (
                                                    <tr key={index}>
                                                        <td><FaUserAlt style={{ color: 'grey' }}></FaUserAlt></td>
                                                        <td>{mov.LLAVE}</td>
                                                        <td>{mov.NOMBRE}</td>
                                                        <td>{mov.APATERNO}</td>
                                                        <td>{mov.AMATERNO}</td>
                                                        <td>{mov.ALIAS}</td>
                                                        <td>{mov.TIPO_INFORMACION}</td>
                                                        <td>{mov.ID_BLOQUE_FUNCIONAL}</td>
                                                        <td>{mov.PROCESADO}</td>
                                                        <td>{mov.PROCESADO === -1 ? 'BLOQUEADO' :
                                                            mov.PROCESADO === 0 ? 'EN ESPERA' :
                                                                mov.PROCESADO === 1 ? 'EN PROCESO' :
                                                                    mov.PROCESADO === 2 ? 'PROCESADO' :
                                                                        mov.PROCESADO === 3 ? 'ERROR FUNCIONAL' :
                                                                            mov.PROCESADO === 4 ? 'ERROR TÉCNICO' :
                                                                                'No disponible'}</td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    Mostrando registros {getDisplayRange()} de un total de {searchResults.length} registros
                                </div>
                                {searchResults.length > 0 && (
                                    <ReactPaginate
                                        previousLabel={'Anterior'}
                                        nextLabel={'Siguiente'}
                                        breakLabel={'...'}
                                        pageCount={Math.ceil(searchResults.length / perPage)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageChange}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                        pageLinkClassName={'page-link'}
                                        previousLinkClassName={'page-link'}
                                        nextLinkClassName={'page-link'}
                                        disabledClassName={'disabled'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ver_tablas;

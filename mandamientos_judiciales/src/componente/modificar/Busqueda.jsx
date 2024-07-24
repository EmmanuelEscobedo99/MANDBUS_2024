import React, { useState, useEffect } from 'react';
import axios from 'axios';








const Busqueda = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/modificacion/busqueda', {
          params: { page, limit }
        });
        setData(response.data.data || []);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, limit]);

  const handleNextPage = () => {
    setPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === page}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <>
       <div>Busqueda</div>
     
       <div>
      <h1>Busqueda</h1>
      
      <h1>Data List</h1>
      <table>
        <thead>
          <tr>
            <th>LLAVE</th>
            <th>NOMBRE</th>
            {/* Agrega más encabezados según los datos */}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.LLAVE}>
              <td>{item.LLAVE}</td>
              <td>{item.NOMBRE}</td>
              {/* Agrega más celdas según los datos */}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
      <p>
        Page {page} of {totalPages} (Total Records: {totalRecords})
      </p>
    </div>




    
    </>
    
    
  )
}

export default Busqueda
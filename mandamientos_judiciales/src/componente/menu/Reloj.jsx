import React, { useState, useEffect } from 'react';

const Reloj = () => {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [fecha, setFecha] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    const intervalID = setInterval(() => {
      const now = new Date();
      setHora(now.toLocaleTimeString());
      setFecha(now.toLocaleDateString());
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalID);
  }, []); 

  return (
    <div className="reloj">
      <p style={{marginLeft:'20px', marginTop:'10px'}}>{fecha} - {hora}</p>
    </div>
  );
};

export default Reloj;

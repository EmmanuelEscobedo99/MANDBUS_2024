import Menu from "../menu/MenuLateral"
import Titulo from "../menu/Titulo"




const Menu_intermedio = () => {
  return (
    <>
    
    <Titulo></Titulo>
    <Menu></Menu>
    
    <div className="contenedor">
       <div className="contenedor_principal">

              <div className="mb-12 row"> 
              <h4>Informacion necesaria para el registro</h4>
              

            <div className="col-sm-4">
            <label  className="form-label">Datos generales</label>
           
           </div>
        
           <div className="col-sm-4">
            <label  className="form-label">Proceso</label>
           
           </div>

           <div className="col-sm-4">
            <label  className="form-label">Delitos</label>
           
           </div>              
         </div>


         <div className="mb-3 row">   
         <h4>Informacion complementaria</h4>
           <div className="col-sm-4">
            <label  className="form-label">Domicilio</label>
           
            </div>

            <div className="col-sm-4">
            <label  className="form-label">Otros nombres</label>
            
           </div>
        
           <div className="col-sm-4">
            <label  className="form-label">Amparos</label>
           
           </div>
               
         </div>


         <div className="mb-3 row">   
        
           <div className="col-sm-4">
            <label  className="form-label">Ministerial</label>
           
            </div>

            <div className="col-sm-4">
            <label  className="form-label">Colaboracion</label>
            
           </div>
        
           <div className="col-sm-4">
            <label  className="form-label">Imagen</label>
           
           </div>
               
         </div>



         <div className="mb-3 row">   
         <h3>Iniciar Registro</h3>
           
               
         </div>

     
        </div>         
    </div>

    
    
    
    </>
  )
}

export default Menu_intermedio
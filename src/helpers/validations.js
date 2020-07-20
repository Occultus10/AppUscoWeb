function validacionDatosIngreso(data) {    
    const {nombres,cedula,email,telefono,temperatura,genero,direccion,lugaVisitar,nota} = data ;

    console.log(data.name)
    if (!nombres) {
       throw new Errors("Por favor seleccione una función.");
      
    }
  
}
module.exports = {
   validacionDatosIngreso,
};


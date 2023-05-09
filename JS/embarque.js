const buscador = document.querySelector("#buscador") //Formulario para saber si el cliente existe
const informacionCliente = document.querySelector("#informacion-cliente") //Tabla para mostrar la informacion del cliente
const registro = document.querySelector("#registro") //Formulario para extraer la informacion del registro

let config = { //Inicializo la configuracion de comunicacion para el json-server
    headers:new Headers({
        "Content-Type": "application/json"
    }),
};

const searchCliente= async(e)=>{ //Funcion para buscar si existe el cliente y comprobar la informacion, lo buscamos usando el id
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    config.method = "GET";
    let infoCliente = await ( await fetch(`http://localhost:3000/clientes/${data.id}`,config)).json();
    let publicarInfo = `
    <tr>
        <td>${infoCliente.id}</td>
        <td>${infoCliente.nombres}</td>
        <td>${infoCliente.apellidos}</td>
        <td>${infoCliente.telefono}</td>
        <td>${infoCliente.fechaNacimiento}</td>
        <td>${infoCliente.ciudad}</td>
        <td>${infoCliente.pais}</td>
        <td>${infoCliente.correo}</td>
    </tr>
    `
    informacionCliente.innerHTML=publicarInfo
  
}

const postRegistro = async(e)=>{ //Funcion para guardar el registro nuevo del embarque
    e.preventDefault()
    let data = Object.fromEntries(new FormData(e.target)); //Se obtiene la informacion del formulario
    config.method = "POST"; 
    config.body = JSON.stringify(data);
    await ( await fetch("http://localhost:3000/embarque",config)).json();

}

buscador.addEventListener("submit",searchCliente)
registro.addEventListener("submit",postRegistro)
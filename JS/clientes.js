const infoClientes = document.querySelector("#info-clientes") //Formulario con la informacion de los clientes
const buscador = document.querySelector("#buscador") //Formulario para buscar por documento, nombre o apellido
const informacionCliente = document.querySelector("#informacion-cliente") //Tabla para mostrar la informacion de los clientes


let config = { //Inicializo la configuracion de comunicacion para el json-server
    headers:new Headers({
        "Content-Type": "application/json"
    }),
};

const getClientesAll = async()=>{ //funcion para listar todos los clientes que existan en el json-server
    config.method = "GET";
    publicarInfo =""
    let infoCliente= await ( await fetch("http://localhost:3000/clientes",config)).json();
    for(index in infoCliente){
        publicarInfo += `
        <tr>
            <td>${infoCliente[index].id}</td>
            <td>${infoCliente[index].nombres}</td>
            <td>${infoCliente[index].apellidos}</td>
            <td>${infoCliente[index].telefono}</td>
            <td>${infoCliente[index].fechaNacimiento}</td>
            <td>${infoCliente[index].ciudad}</td>
            <td>${infoCliente[index].pais}</td>
            <td>${infoCliente[index].correo}</td>
        </tr>
    `
    }
    informacionCliente.innerHTML=publicarInfo

}

const postCliente = async(data)=>{ //funcion para agregar un cliente nuevo al json-server
    config.method = "POST";
    config.body = JSON.stringify(data);
    await ( await fetch("http://localhost:3000/clientes",config)).json();

}

const deleteCliente = async(data)=>{ //funcion para eliminar un cliente del json-server usando su id
    config.method = "DELETE";
    await ( await fetch(`http://localhost:3000/clientes/${data.id}`,config)).json();

}

const putCliente = async(data)=>{ // funcion para actualizar informacion de un cliente
    config.method = "PUT";
    config.body = JSON.stringify(data);
    await ( await fetch(`http://localhost:3000/clientes/${data.id}`,config)).json();
}

const searchCliente= async(e)=>{ // funcion para mostrar la informacion de los clientes buscados en el buscador, los que tengan alguna coincidencia seran mostrados
    e.preventDefault();
    let publicarInfo = ""
    let data = Object.fromEntries(new FormData(e.target));
    config.method = "GET";
    let infoCliente = await ( await fetch(`http://localhost:3000/clientes?q=${Object.values(data).join("")}`,config)).json();
    if(infoCliente[0]){
        for(index in infoCliente){ //Se realiza de esta manera porque puede tener 1 o más coincidencias
            publicarInfo += `
            <tr>
                <td>${infoCliente[index].id}</td>
                <td>${infoCliente[index].nombres}</td>
                <td>${infoCliente[index].apellidos}</td>
                <td>${infoCliente[index].telefono}</td> 
                <td>${infoCliente[index].fechaNacimiento}</td>
                <td>${infoCliente[index].ciudad}</td>
                <td>${infoCliente[index].pais}</td>
                <td>${infoCliente[index].correo}</td>
            </tr>
        `
        }
        informacionCliente.innerHTML=publicarInfo
    }
    else{
        informacionCliente.innerHTML="No se encontraron coincidencias"
    }
}


const opc = { // objeto tipo menu para saber cual de todas las funciones elegir dependiendo del submit
    "GET": () => getClientesAll(),
    "PUT": (data) => putCliente(data),
    "DELETE": (data) => deleteCliente(data),
    "POST": (data) => postCliente(data)
}

const guardarCliente = function(e){ //funcion para extraer informacion del formulario y saber cual funcion de manejo de datos ejecutar luego, basandonos en el data-accion
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target)); 
    opc[e.submitter.dataset.accion](data) 
}

infoClientes.addEventListener("submit",guardarCliente) 
buscador.addEventListener("submit",searchCliente)
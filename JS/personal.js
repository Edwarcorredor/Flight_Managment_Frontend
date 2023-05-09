const formPersonal = document.querySelector("#info-personal")


let config = { //Inicializo la configuracion de comunicacion para el json-server
    headers:new Headers({
        "Content-Type": "application/json"
    }),
};

const opc = { // objeto tipo menu para saber cual de todas las funciones elegir dependiendo del submit
    "DELETE": (data) => deletePersonal(data),
    "POST": (data) => postPersonal(data)
}

const postPersonal = async(data)=>{ //funcion para agregar un personal nuevo al json-server
    config.method = "POST";
    config.body = JSON.stringify(data);
    await ( await fetch("http://localhost:3000/personal",config)).json();

}

const deletePersonal = async(data)=>{ //funcion para eliminar un personal del json-server usando su id
    config.method = "DELETE";
    await ( await fetch(`http://localhost:3000/personal/${data.id}`,config)).json();

}

const guardarPersonal = function(e){ //funcion para extraer informacion del formulario y saber cual funcion de manejo de datos ejecutar luego, basandonos en el data-accion
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    opc[e.submitter.dataset.accion](data) 
}



formPersonal.addEventListener("submit",guardarPersonal)
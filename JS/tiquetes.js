const formComprobar = document.querySelector("#formComprobar") //Formulario para comprobar que existe el cliente 
const comprobar = document.querySelector("#comprobar") //Se usa para indicar si existe el cliente o no
const usuarioNoRegistrado = document.querySelector("#usuarioNoRegistrado") //Formulario para ingresar el nuevo usuario, pero registrado incorrectamente
const divNoRegistrado = document.querySelector("#usuarioSinRegistrar") //div que oculto, y muestro solo si el usuario no existe
const viajes = document.querySelector("#viajes") //div para informacion del viaje, que dejo oculto hasta que ingresen informacion
const infoViaje = document.querySelector("#infoViaje")//formulario para informacion del viaje
const informacionRuta = document.querySelector("#informacionRutas") //Tabla para mostrar todas las rutas existentes
const resumenDeCompra = document.querySelector("#resumen-compra") //Tabla para mostrar el resumen de la compra

let config = { //Inicializo la configuracion de comunicacion para el json-server
    headers:new Headers({
        "Content-Type": "application/json"
    }),
};

const searchRutas= async()=>{ // funcion para mostrar al usuario todas las rutas existentes con su informacion detallada
    config.method = "GET";
    let publicarRuta =""
    let rutas = await ( await fetch(`http://localhost:3000/rutas`,config)).json();
    for(index in rutas){
        publicarRuta += `
        <tr>
            <td>${rutas[index].nombreRuta}</td>
            <td>${rutas[index].ciudadOrigen}</td>
            <td>${rutas[index].ciudadDestino}</td>
            <td>${rutas[index].millasRuta}</td>
            <td>${rutas[index].valorMilla}</td>

        </tr>
    `
    }
    informacionRuta.innerHTML = publicarRuta 
}

const enviarPuntos = async function(puntosUsuario,puntosAcumulados){
    if(puntosAcumulados == 0){
        config.method = "POST";
        config.body = JSON.stringify(puntosUsuario);
        await( await fetch("http://localhost:3000/puntos",config)).json()
    }
    else{
        config.method = "PUT";
        let acumulado = parseFloat(puntosAcumulados.millas)+parseFloat(puntosUsuario.millas)
        puntosUsuario.millas = acumulado
        config.body = JSON.stringify(puntosUsuario);
        await( await fetch(`http://localhost:3000/puntos/${puntosUsuario.id}`,config)).json()
    }

}

const asignarPuntos = async function(viajeInfo){
    let data = Object.fromEntries(new FormData(formComprobar))
    config.method = "GET";
    let cliente = await( await fetch(`http://localhost:3000/clientes/${data.id}`,config)).json()
    if(cliente.ciudad){
        config.method = "GET";
        let puntosAcumulados = await( await fetch(`http://localhost:3000/puntos/${cliente.id}`,config)).json()
        let infoPunto = {}
        infoPunto.id = data.id
        infoPunto.millas=viajeInfo[0].millasRuta
        if(puntosAcumulados !=""){
            enviarPuntos(infoPunto,puntosAcumulados)
        }
        else{
            enviarPuntos(infoPunto,"0")
        }
        
    }
}

const comprobarCliente = async function(e){ // Funcion para comprobar si el cliente existe

    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    config.method = "GET";
    let cliente = await( await fetch(`http://localhost:3000/clientes/${data.id}`,config)).json()
    if(cliente.id){
        comprobar.innerHTML = "Existe" //si el cliente existe, se mostrará el formulario para el viaje
        viajes.style.display = "block"
    }
    else{
        comprobar.innerHTML = "No existe"
        divNoRegistrado.style.display = "block" // si el cliente no existe, se mostrara el formulario para añadir mas informacion sobre él
    }
};



const nuevoCliente = async function(e){//Funcion para obtener la informacion del nuevo cliente y guardarla en el json-server
    e.preventDefault();
    let cliente = Object.fromEntries(new FormData(e.target));
    viajes.style.display = "block"
    config.method = "POST";
    config.body = JSON.stringify(cliente);
    await ( await fetch("http://localhost:3000/clientes",config)).json(); 

}



const valorCompra = async function(ruta){ //funcion para calcular el valor total de la compra
    let valorMillas = parseFloat(ruta[0].millasRuta)*parseFloat(ruta[0].valorMilla) //se recibe como parametro la informacion detallada del viaje
    let tasa = valorMillas*0.05
    let impuesto = valorMillas*0.16
    let valorTotal = valorMillas+tasa+impuesto
    let resumenCompra = `
    <tr>
        <td>${ruta[0].nombreRuta}</td>
        <td>${tasa}</td>    
        <td>${impuesto}</td>
        <td>${valorTotal}</td>
    </tr>`
    //se ingresa informacion para mostrar en el modal
    resumenDeCompra.innerHTML=resumenCompra
}

const searchViaje = async(e)=>{ //buscar la informacion del viaje, con la informacion recibida por formulario
    e.preventDefault();
    let viaje = Object.fromEntries(new FormData(e.target));
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:3000/rutas?ciudadOrigen=${viaje.ciudadOrigen}&ciudadDestino=${viaje.ciudadDestino}`,config)).json();
    valorCompra(res)
    asignarPuntos(res)
}

formComprobar.addEventListener("submit", comprobarCliente)
usuarioNoRegistrado.addEventListener("submit",nuevoCliente)
infoViaje.addEventListener("submit",searchViaje)
searchRutas()
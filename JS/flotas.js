const infoFlotas = document.querySelector("#info-flotas")

let config = { //Inicializo la configuracion de comunicacion para el json-server
    headers:new Headers({
        "Content-Type": "application/json"
    }),
};

const guardarFlota = async function(e){ //Funcion para guardar la nueva flota
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target)); //Se obtiene la informacion del formulario
    config.method = "POST";
    config.body = JSON.stringify(data);
    await ( await fetch("http://localhost:3000/flotas",config)).json();
}


infoFlotas.addEventListener("submit",guardarFlota)





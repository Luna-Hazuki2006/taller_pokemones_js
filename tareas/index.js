let pokedex = []
let vistaPokedex = document.getElementById('pokedex')

async function cargar() {
    if (localStorage.getItem('token') == undefined || 
        localStorage.getItem('token') == null) {
        alert('Necesita iniciar sesión para acceder aquí, lo siento :(')
        location.href = '../'
    }
    await consultarPokedex()
    let bottonAtrapar = document.querySelector('#atrapar button')
    console.log(bottonAtrapar);
    bottonAtrapar.addEventListener('click', encontrarPokemon)
}

async function consultarPokedex() {
    try {
        console.log('Tu pokedex');
        const respuesta = await fetch('https://graco-api.onrender.com/pokedex', {
            method: 'GET', 
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        const lista = await respuesta.json()
        console.log(lista);
        console.log(lista['data']);
        pokedex = lista['data']
        console.log(pokedex);
        // mostrarPokedex()
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un error al consultar la pokedex')
    } 
}

function mostrarPokedex() {
    vistaPokedex.innerHTML = ''
    let indices = Object.keys(pokedex[0])
    for (const pokemon of pokedex) {
        for (const esto of indices) {
            let p = document.createElement('p')
            p.innerText = esto + ': ' + pokemon[esto]
            vistaPokedex.appendChild(p)
        }   
    }
}

async function encontrarPokemon() {
    try {
        console.log('vas a encontrar un pokemon');
        const respuesta = await fetch('https://graco-api.onrender.com/solicitarPokemon', {
            method: 'POST', 
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        const pokemon = await respuesta.json()
        console.log(pokemon);
        console.log(pokemon['data']);
        await atraparPokemon(pokemon['data']['id'])
        console.log('felicidades');
        alert('felicidades, te econtraste con un pokemón')
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un erro al atrapar al pokemón')
    }
}

async function atraparPokemon(id) {
    try {
        console.log('vas atrapar un pokemon');
        const respuesta = await fetch('https://graco-api.onrender.com/solicitarPokemon', {
            method: 'POST', 
            headers: {
                'Authorization': localStorage.getItem('token')
            }, 
            body: JSON.stringify({
                'id': id, 
                'estado': 2
            })
        })
        const pokemon = await respuesta.json()
        console.log(pokemon);
        console.log('felicidades');
        alert('felicidades, atrapaste un pokemón')
        await consultarPokedex()
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un erro al atrapar al pokemón')
    }
}

async function prueba() {
    console.log('inicio');
    fetch('https://graco-api.onrender.com/registrar', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ "email": "ggimenez", "password": "1" }) 
    }).then(r=> r.json()).then(r=> console.log(r))
    console.log('final');
}

cargar()
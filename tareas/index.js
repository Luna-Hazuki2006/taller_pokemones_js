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
    bottonAtrapar.addEventListener('click', async () => {
        await encontrarPokemon()
    })
}

async function consultarPokedex() {
    try {
        console.log('Tu pokedex');
        const respuesta = await fetch('https://graco-api.onrender.com/pokedex', {
            method: 'GET', 
            headers: {
                'Authorization': JSON.stringify(localStorage.getItem('token')), 
            }
        })
        const lista = await respuesta.json()
        console.log('La pokedex');
        console.log(lista);
        console.log(lista['data']);
        pokedex = lista['data']
        console.log(pokedex);
        mostrarPokedex()
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un error al atrapar al pokemón\nTrata de iniciar sesión de nuevo')
        location.href = '../'
    } 
}

function mostrarPokedex() {
    vistaPokedex.innerHTML = ''
    let indices = Object.keys(pokedex[0])
    for (const pokemon of pokedex) {
        let div = document.createElement('div')
        let img = document.createElement('img')
        img.src = pokemon['image']
        if (String(pokemon['estado']) == '0' || 
            String(pokemon['estado']) == '1') {
            div.classList.add('presente')
        } else {
            div.classList.add('presente')
        }
        div.appendChild(img)
        vistaPokedex.appendChild(div)
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
        if (pokemon['success']) {
            console.log(pokemon);
            console.log(pokemon['data']);
            console.log('felicidades');
            alert('felicidades, te econtraste con un pokemón')
            await atraparPokemon(pokemon['data']['id'])
        } else {
            console.log('No se pudo encontrar el pokemon');
            alert('¡Oh no! no pudiste encontrar un pokemon')
        }
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un error al atrapar al pokemón\nTrata de iniciar sesión de nuevo')
    }
}

async function atraparPokemon(id) {
    try {
        console.log('vas atrapar un pokemon');
        alert('Pero... ¿Atraparás al pokemon?')
        const respuesta = await fetch('https://graco-api.onrender.com/atrapar', {
            method: 'PUT', 
            headers: {
                'Authorization': localStorage.getItem('token')
            }, 
            body: JSON.stringify({
                'id': id, 
                'estado': '2'
            })
        })
        const pokemon = await respuesta.json()
        console.log('Esto es el pokemon');
        console.log(pokemon);
        console.log('felicidades');
        alert('felicidades, atrapaste un pokemón')
        await consultarPokedex()   
        // if (respuesta['success']) {
        //     const pokemon = await respuesta.json()
        //     console.log(pokemon);
        //     console.log('felicidades');
        //     alert('felicidades, atrapaste un pokemón')
        //     await consultarPokedex()
        // } else {
        //     alert('¡Oh no! El pokemón escapó :(')
        //     console.log('Se escapó :(');
        // }
    } catch (error) {
        console.error(error)
        alert('Oh no, el pokemon escapó')
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
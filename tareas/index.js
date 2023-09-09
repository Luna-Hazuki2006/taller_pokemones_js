let pokedex = []
let vistaPokedex = document.getElementById('pokedex')
// vistaPokedex.classList.add('invisible')

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
    // let botonMostrar = document.querySelector('section:nth-child(4) button')
    // console.log(botonMostrar);
    // botonMostrar.addEventListener('click', () => {
    //     vistaPokedex.classList.toggle('invisible')
    // })
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
    llenado(vistaPokedex, pokedex)
    let texto = document.querySelector('#encontrar input')
    texto.addEventListener('keyup', () => {
        let buscar = texto.value
        console.log(buscar);
        let lista = pokedex.filter((poke) => String(poke['name']).includes(buscar) || 
                                            String(poke['id']).includes(buscar) || 
                                            String(poke['type']).includes(buscar))
        llenado(vistaPokedex, lista)
        console.log(lista);
    })
}

function llenado(origen, lista) {
    origen.innerHTML = ''
    for (const pokemon of lista) {
        let div = document.createElement('div')
        div.id = pokemon['id']
        div.addEventListener('click', () => {
            consultarPokemon(div.id)
            location.href = '#consulta'
        })
        let img = document.createElement('img')
        img.src = pokemon['image']
        switch (String(pokemon['estado'])) {
            case '0':
                div.classList.add('ocultar')
                break;
            case '1': 
                div.classList.add('ausente')
                break
            case '2': 
                div.classList.add('presente')
                break
            default:
                console.log('Algo está MUY mal');
                break;
        }
        div.appendChild(img)
        origen.appendChild(div)
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
                'Authorization': localStorage.getItem('token'), 
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                'id': id, 
                'estado': 2
            })
        })
        if (respuesta['success']) {
            
        }
        const pokemon = await respuesta.json()
        console.log('Esto es el pokemon');
        console.log(pokemon);
        await consultarPokedex()
        for (const esto of pokedex) {
            if (esto['id'] == id && 
                esto['estado'] == 2) {
                console.log('felicidades');
                alert('felicidades, atrapaste un pokemón')
                return
            }
        }
        alert('¡Oh no! El pokemón escapó :(')
        console.log('Se escapó :(');
    } catch (error) {
        console.error(error)
        alert('Oh no, el pokemon escapó')
    }
}

function consultarPokemon(id) {
    console.log(id);
    let pokemon = null
    for (const esto of pokedex) {
        if (esto['id'] == id) {
            pokemon = esto
            break
        }
    }
    let consulta = document.getElementById('consulta')
    consulta.innerHTML = ''
    if (pokemon['estado'] == '0') {
        let div = document.createElement('div')
        div.classList.add('pokemon')
        div.classList.add('triste')
        let h3 = document.createElement('h3')
        h3.innerText = pokemon['name']
        div.appendChild(h3)
        let p = document.createElement('p')
        p.innerText = pokemon['id']
        div.appendChild(p)
        p = document.createElement('p')
        p.innerText = pokemon['type']
        div.appendChild(p)
        let div2 = document.createElement('div')
        p = document.createElement('p')
        p.innerText = pokemon['height']
        div2.appendChild(p)
        p = document.createElement('p')
        p.innerText = pokemon['weight']
        div2.appendChild(p)
        div.appendChild(div2)
        let div3 = document.createElement('div')
        let img = document.createElement('img')
        img.src = pokemon['image']
        div3.appendChild(img)
        div3.classList.add('ocultar')
        div.appendChild(div3)
        consulta.appendChild(div)
    } else if (pokemon['estado'] == '1') {
        let div = document.createElement('div')
        div.classList.add('pokemon')
        let h3 = document.createElement('h3')
        h3.innerText = pokemon['name']
        div.appendChild(h3)
        let p = document.createElement('p')
        p.innerText = pokemon['id']
        div.appendChild(p)
        p = document.createElement('p')
        p.innerText = pokemon['type']
        div.appendChild(p)
        let div2 = document.createElement('div')
        p = document.createElement('p')
        p.innerText = pokemon['height']
        div2.appendChild(p)
        p = document.createElement('p')
        p.innerText = pokemon['weight']
        div2.appendChild(p)
        div.appendChild(div2)
        let div3 = document.createElement('div')
        let img = document.createElement('img')
        img.src = pokemon['image']
        div3.appendChild(img)
        div3.classList.add('ausente')
        div.appendChild(div3)
        consulta.appendChild(div)
    } else if (pokemon['estado'] == '2') {
        let div = document.createElement('div')
        div.classList.add('pokemon')
        let h3 = document.createElement('h3')
        h3.innerText = pokemon['name']
        div.appendChild(h3)
        let p = document.createElement('p')
        p.innerText = pokemon['id']
        div.appendChild(p)
        p = document.createElement('p')
        let ul = document.createElement('ul')
        for (const esto of String(pokemon['type']).split(',')) {
            let li = document.createElement('li')
            li.innerText = esto
            ul.appendChild(li)
        }
        p.appendChild(ul)
        div.appendChild(p)
        let div2 = document.createElement('div')
        p = document.createElement('p')
        p.innerText = 'Altura: ' + pokemon['height']
        div2.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Peso: ' + pokemon['weight']
        div2.appendChild(p)
        div.appendChild(div2)
        let div3 = document.createElement('div')
        let img = document.createElement('img')
        img.src = pokemon['image']
        div3.appendChild(img)
        div3.classList.add('presente')
        div.appendChild(div3)
        consulta.appendChild(div)
    }
}

cargar()
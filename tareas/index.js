let pokedex = []
let vistaPokedex = document.getElementById('pokedex')
let pokebola = document.getElementById('pokebola')
let atrapar = document.getElementById('atrapar')

async function cargar() {
    if (localStorage.getItem('token') == undefined || 
        localStorage.getItem('token') == null) {
        alert('Necesita iniciar sesión para acceder aquí, lo siento :(')
        location.href = '../'
        return
    }
    await consultarPokedex()
    let multiples = document.querySelector('#multiples button')
    multiples.addEventListener('click', async () => {
        await encontrarPokemon()
    })
}

async function consultarPokedex() {
    pokebola.classList.remove('invisible')
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
        localStorage.removeItem('token')
        alert('Disculpa, ocurrió un error al atrapar al pokemón\nTrata de iniciar sesión de nuevo')
        location.href = '../'
    }
    pokebola.classList.add('invisible')
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
                alert('Un error a sucedido pero no te preocupes, no es tu culpa :(')
                location.href = '../'
                break;
        }
        div.appendChild(img)
        origen.appendChild(div)
    } 
}

async function encontrarPokemon() {
    pokebola.classList.remove('invisible')
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
            encontrar(pokemon['data'])
        } else {
            console.log('No se pudo encontrar el pokemon');
            alert('¡Oh no! no pudiste encontrar un pokemon')
            escapar()
        }
    } catch (error) {
        console.error(error)
        alert('Disculpa, ocurrió un error al atrapar al pokemón\nTrata de iniciar sesión de nuevo')
    }
    pokebola.classList.add('invisible')
}

function escapar() {
    let contenedor = atrapar.querySelector('div:nth-of-type(3)')
    contenedor.classList.add('invisible')
    let botones = contenedor.querySelectorAll('button')
    for (const este of botones) {
        let nuevo = este.cloneNode(true)
        este.parentNode.replaceChild(nuevo, este)
    }
}

function encontrar(poke) {
    atrapar.classList.add('triste')
    let h3 = atrapar.querySelector('h3')
    h3.innerText = '????'
    let p = atrapar.querySelectorAll('p')
    p[0].innerText = poke['id']
    p[1].innerHTML = '????'
    let p2 = atrapar.querySelectorAll('div:first-of-type p')
    p2[0].innerHTML = '????'
    p2[1].innerHTML = '????'
    let div = atrapar.querySelector('div:nth-of-type(2)')
    div.classList.add('ocultar')
    div.classList.remove('presente')
    div.innerHTML = ''
    let img = document.createElement('img')
    img.src = (poke['imagen']) ? poke['imagen'] : poke['image']
    div.appendChild(img)
    let contenedor = atrapar.querySelector('div:nth-of-type(3)')
    contenedor.classList.remove('invisible')
    let botones = contenedor.querySelectorAll('button')
    botones[0].addEventListener('click', async () => {
        await atraparPokemon(poke['id'])
    })
    botones[1].addEventListener('click', async () => {
        p[0].innerText = '????'
        div.innerHTML = ''
        contenedor.classList.add('invisible')
        await consultarPokedex()
    })
    console.log('final');
}

async function atraparPokemon(id) {
    console.log(id);
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
        console.log('la respuesta');
        console.log(respuesta);
        const pokemon = await respuesta.json()
        if (pokemon['success']) {
            await consultarPokedex()
            console.log('Esto es el pokemon');
            console.log(pokemon);
            console.log('felicidades');
            alert('felicidades, atrapaste un pokemón')
            mostrar(id)
        } else {
            alert('¡Oh no! El pokemón escapó :(')
            console.log('Se escapó :(');
            escapar()
        }
    } catch (error) {
        console.error(error)
        alert('Ha ocurrido un error al atrapar')
    }
}

function mostrar(id) {
    let poke = pokedex.find((p) => p['id'] == id)
    console.log(poke);
    atrapar.classList.remove('triste')
    let h3 = atrapar.querySelector('h3')
    h3.innerText = poke['name']
    let p = atrapar.querySelectorAll('p')
    p[0].innerText = poke['id']
    p[1].innerText = ''
    let ul = document.createElement('ul')
    for (const esto of String(poke['type']).split(',')) {
        let li = document.createElement('li')
        li.innerText = esto
        ul.appendChild(li)
    }
    p[1].appendChild(ul)
    p = atrapar.querySelectorAll('div:first-of-type p')
    p[0].innerText = 'Altura: ' + poke['height']
    p[1].innerText = 'Peso: ' + poke['weight']
    let div = atrapar.querySelector('div:nth-of-type(2)')
    div.classList.remove('ocultar')
    let img = div.querySelector('img')
    img.src = (poke['imagen']) ? poke['imagen'] : poke['image']
    div.classList.add('presente')
    escapar()
}

function consultarPokemon(id) {
    console.log(id);
    let pokemon = pokedex.find((poke) => poke['id'] == id)
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
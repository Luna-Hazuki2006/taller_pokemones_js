let url = 'https://pokeapi.co/api/v2/pokemon/'
const paginas = document.getElementById('paginacion')
const lista = document.getElementById('lista')
let original = []
let objetosCompletos = []

async function obtenerTodos() {
    if (comprobar()) {
        return
    }
    await obtenerListas()
}

async function obtenerListas() {
    let objetos = []
    original = []
    objetosCompletos = []
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    original = await respuesta.json()
    objetos = original['results']
    for (const dato of objetos) {
        await obtenerDetalles(dato)
    }
    almacenar()
    await cargar()
}

async function obtenerDetalles(dato) {
    const respuesta = await fetch(dato['url'])
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    objetosCompletos.push(data)
}

function almacenar() {
    console.log('por aqui');
    const pokemones = JSON.stringify(objetosCompletos)
    console.log(objetosCompletos);
    localStorage.setItem('pokemones', pokemones)
    const listado = JSON.stringify(original)
    console.log(original);
    localStorage.setItem('lista', listado)
}

function comprobar() {
    if (localStorage.getItem('pokemones') && 
        localStorage.getItem('lista')) {
        let revisar = JSON.parse(localStorage.getItem('pokemones'))
        let listado = JSON.parse(localStorage.getItem('lista'))
        if (revisar != [] && listado != []) {
            objetosCompletos = revisar
            original = listado
            return true
        }
        return false
    } else {
        return false
    }
}

async function obtenerMovimientos(campo) {
    const respuesta = await fetch(campo)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    return [...data]
}

function limpiar() {
    let borradas = document.querySelectorAll('#paginacion a:not(.flechas)')
    for (let i = borradas.length - 1; i >= 0; i--) {
        paginas.removeChild(borradas[i])
    }
}

function filtrar() {
    console.log('incluso aqui');
    let filtrado = document.getElementById('filtrado').value
    let ver = []
    for (const esto of objetosCompletos) {
        if (String(esto['name']).includes(filtrado)) {
            console.log(esto['name']);
            let pokemon = document.getElementById(esto['id'])
            ver.push(pokemon)
        }
    }
    let todos = document.querySelectorAll('#lista div')
    for (const esto of todos) {
        if (ver.indexOf(esto) == -1) {
            esto.classList.add('invisible')
        } else {
            esto.classList.remove('invisible')
        }
    }
}

obtenerTodos()
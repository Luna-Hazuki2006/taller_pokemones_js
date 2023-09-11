let mensaje = document.getElementById('modal')

window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
    }
}

function cargar() {
    let form = document.querySelector('form')
    let boton = document.querySelector('form button')
    boton.classList.add('ingresar')
    let pokebola = document.querySelector('#pokebola')
    pokebola.classList.add('invisible')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        pokebola.classList.remove('invisible')
        let data = new FormData(form)
        let correo = data.get('correo')
        let clave = data.get('contraseña')
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'email': correo, 
                    'password': clave
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                pokebola.classList.add('invisible')
                let jwt = verdad['data']['token']
                console.log(jwt);
                localStorage.setItem('token', jwt)
                console.log('felicidades');
                // alert('Felicidades, inicio de sesión exitoso')
                modal('Felicidades, inicio de sesión exitoso', '/tareas/')
            } else {
                console.log('¡Oh no! No pudiste iniciar sesión');
                // alert('¡Oh no! parece que hubo un problema para iniciar sesión')
                modal('¡Oh no! parece que hubo un problema para iniciar sesión')
                pokebola.classList.add('invisible')
            }
        } catch (error) {
            console.error(error)
            // alert('Ha sucedido un error pero no preocupes, no es tu culpa :D')
            modal('Ha sucedido un error pero no preocupes, no es tu culpa :D')
            pokebola.classList.add('invisible')
        }
    })
}

function modal(texto, pasar = undefined) {
    let p = mensaje.querySelector('div div:first-of-type p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
    let boton = mensaje.querySelector('div div:last-of-type button')
    if (pasar != undefined) {
        console.log('pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            location.href = pasar
            let nuevo = mensaje.cloneNode(true)
            mensaje.parentNode.replaceChild(nuevo, mensaje)
        })
    } else {
        console.log('no pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            let nuevo = mensaje.cloneNode(true)
            mensaje.parentNode.replaceChild(nuevo, mensaje)
        })
    }
}

cargar()
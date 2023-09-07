function cargar() {
    let form = document.querySelector('form')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let data = new FormData(form)
        let nombre = data.get('nombre')
        let apellido = data.get('apellido')
        let correo = data.get('correo')
        let clave = data.get('contraseña')
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/registrar', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'name': nombre, 
                    'lastname': apellido, 
                    'email': correo, 
                    'password': clave
                })
            })
            const verdad = await respuesta.json()
            const jwt = verdad.token
            localStorage.setItem('token', jwt)
            console.log('felicidades');
            location.href = '../'
        } catch (error) {
            console.error(error)
        }
    })
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
function cargar() {
    let form = document.querySelector('form')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
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
                let jwt = verdad['data']['token']
                localStorage.setItem('token', jwt)
                console.log('felicidades');
                alert('Felicidades, inicio de sesión exitoso')
                location.href = '../'   
            }
        } catch (error) {
            console.error(error)
            alert('Ha sucedido un error pero no preocupes, no es tu culpa :D')
        }
    })
}

cargar()
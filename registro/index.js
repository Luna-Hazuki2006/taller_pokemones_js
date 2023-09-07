function cargar() {
    let form = document.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })
}

cargar()
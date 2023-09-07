function cargar() {
    let form = document.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        let data = new FormData(form)
        
    })
}

cargar()
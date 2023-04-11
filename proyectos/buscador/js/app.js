const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;
    if (terminoBusqueda === ''){
        console.log('Agrega un termino de busqueda');
        return;
    }

}

function mostrarAlerta(mensaje) {
    const alerta = document.createElement('P');
    alerta.classList.add()
}
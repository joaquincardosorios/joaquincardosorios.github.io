const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;
    if (terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }

}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-danger');

    if (!existeAlerta){
        const alerta = document.createElement('P');
        alerta.classList.add('bg-danger', 'border', 'px-4', 'py-3', 'rounded', 'col-5', 'mx-auto', 'mt-3', 'text-center', 'text-white');

        alerta.innerHTML= `
            <strong class="d-block fw-bold">Error!</strong>
            <span class="block d-sm-inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }

    
}
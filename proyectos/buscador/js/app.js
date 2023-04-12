const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

const registrosPorPagina = 40;
let totalPaginas;

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

    buscarImagenes(terminoBusqueda)

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
function buscarImagenes(termino) {
    const key = '35313468-e9d074455f8222ad8457e5d3b';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = Math.ceil( resultado.totalHits / registrosPorPagina );
            mostrarImagenes(resultado.hits);
        })
}
function mostrarImagenes(imagenes){

    // Limpiar resultados anteriores
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    // Iterar sobre arreglo de imagenes y construir HTML
    imagenes.forEach(imagen => {

        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `

            <div class="col-lg-3 col-md-4 col-sm-6 p-2 mb-3">
                <div class="bg-white change-overlay">
                    <a 
                        class=""
                        href="${largeImageURL}" 
                        target="_blank" 
                        rel="noopener noreferer"
                    ><img 
                        class="w-100" 
                        src="${previewURL}">
                    </a>

                    <div class="p-2">
                        <p class="fw-bold mb-0">${likes}<span class="fw-light"> Me gusta</span></p>
                        <p class="fw-bold mb-0">${views}<span class="fw-light"> Vistos</span></p>
                    </div>
                </div>
            </div>

        `
    });
}
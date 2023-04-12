const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;

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
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = Math.ceil( resultado.totalHits / registrosPorPagina );
            mostrarImagenes(resultado.hits);
        })
}

// Registra la cantidad e elementos de acuerdo a las paginas
function *crearPaginador(total){
    console.log(total)
    for (let i= 1; i <= total; i++){
        yield i;
    }
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

            <div class="">
                    <a 
                        class=""
                        href="${largeImageURL}" 
                        target="_blank" 
                        rel="noopener noreferer"
                    ><img 
                        class="img-fluid w-100 change-hover " 
                        src="${previewURL}">
                    </a>
                    <div class="bg-white">
                    <div class="p-2">
                        <p class="fw-bold mb-0">${likes}<span class="fw-light"> Me gusta</span></p>
                        <p class="fw-bold mb-0">${views}<span class="fw-light"> Vistos</span></p>
                    </div>
                </div>
            </div>

        `
    });
    // Limpiar paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    const listaPaginacion = document.createElement('UL');
    listaPaginacion.classList.add('pagination','pagination-lg','justify-content-center','flex-wrap')
    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        // Genera un boton por cada elemento en el generador
        const enumLista = document.createElement('li');
        enumLista.classList.add('page-item');
        const boton = document.createElement('A');
        boton.classList.add('page-link','bg-warning','bg-gradient-warning', 'text-white')
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        enumLista.appendChild(boton)
        listaPaginacion.appendChild(enumLista)
        paginacionDiv.appendChild(listaPaginacion)
    }

    
}
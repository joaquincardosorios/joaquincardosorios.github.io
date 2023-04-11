function iniciarApp() {

    const resultado = document.querySelector('#resultado');

    // Solo carga en index.html, donde existe #categorias
    const selectCategorias = document.querySelector('#categorias');
    if(selectCategorias){
        selectCategorias.addEventListener('change', seleccionarCategoria);
        obtenerCategorias();
    }

    const favoritosDiv = document.querySelector('.favoritos');
    if(favoritosDiv){
        obtenerFavoritos();
    }

    const modal = new bootstrap.Modal('#modal', {})

    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        fetch(url)
            .then( respuesta => respuesta.json())
            .then( resultado => mostrarCategorias(resultado.categories))
    }

    function mostrarCategorias(categorias = []) {
        categorias.forEach( categoria => {
            const { strCategory } = categoria;
            const option = document.createElement('OPTION');
            option.value = strCategory;
            option.textContent = strCategory;
            selectCategorias.appendChild(option);
        })
    }
    function seleccionarCategoria(e){
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
        fetch(url)
            .then( respuesta => respuesta.json())
            .then( resultado => mostrarRecetas(resultado.meals))
        
    }
    function mostrarRecetas(recetas = []) {
        limpiarHTML(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5')
        heading.textContent = recetas.length ? 'Resultado': 'No hay Resultados';
        resultado.appendChild(heading);
        // Itera e los resultados
        recetas.forEach(receta => {

            const {strMeal, strMealThumb, idMeal  } = receta
            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4');

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'mb-4')

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb ?? receta.img;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body')

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal ?? receta.title;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            recetaButton.textContent = 'Ver Receta';

            //recetaButton.dataset.bsTarget = '#modal'
            //recetaButton.dataset.bsToggle = 'modal'

            recetaButton.onclick =  function() {
                seleccionarReceta(idMeal ?? receta.id)
            }

            // Inyectar en el codigo HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard)

            resultado.appendChild(recetaContenedor)
        })

    }
    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]))
    }

    function mostrarRecetaModal(receta){
        const {idMeal, strInstructions, strMeal, strMealThumb } = receta

        // Añadir contenido al modal
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');
        

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <img src="${strMealThumb}" alt="receta ${strMeal}" class="img-fluid">
                        <div id="ingredientes">
                            <h3 class="my-3">Ingredientes y Cantidades</h3>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div id="instrucciones">
                            <h3 class="my-3">Instrucciones</h3>
                            <p class="text-justify">${strInstructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        `; 

        const modalBodyIng = document.querySelector('.modal .modal-body #ingredientes');
        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        //Mostrar ingredientes
        for(let i = 1; i<=20 ; i++){
            if(receta[`strIngredient${i}`]){
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredientLi = document.createElement('LI');
                ingredientLi.classList.add('list-group-item');
                ingredientLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredientLi)
            }
        }

        modalBodyIng.appendChild(listGroup);

        const modalFooter = document.querySelector('.modal-footer');
        limpiarHTML(modalFooter)

        // Botones de cerrar y favoritos
        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeStorage(idMeal) ? 'Borrar Favorito' : 'Guardar Favorito';

        // localStorage
        btnFavorito.onclick = function() {

            if(existeStorage(idMeal)){
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Guardar Favorito';
                mostratToast('Eliminado Correctamente');
                return
            }

            agregarFavorito({
                id: idMeal,
                title: strMeal,
                img: strMealThumb
            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostratToast('Agregado Correctamente');
        }

        const btnCerrarModal = document.createElement('BUTTON');
        btnCerrarModal.classList.add('btn', 'btn-secondary', 'col');
        btnCerrarModal.textContent = 'Cerrar'
        btnCerrarModal.onclick = function() {
            modal.hide();
        }


        //Boton Exportar PDF
        const btnExportar = document.createElement('BUTTON');
        btnExportar.classList.add('btn', 'btn-primary', 'col');
        btnExportar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg> Imprimir
        `;
        btnExportar.onclick = function () {
            const modalContent = document.querySelector('#modal').innerHTML;
            const printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write('<html><head><title>Imprimir modal</title>');
            printWindow.document.write('</head><body >');
            printWindow.document.write(modalContent);
            printWindow.document.write('</body></html>');

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();

        }

        
        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnExportar);
        modalFooter.appendChild(btnCerrarModal);
        // Muestra la receta
        modal.show();
    }

    function agregarFavorito(receta){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        localStorage.setItem('favoritos', JSON.stringify([... favoritos, receta]))
    }

    function eliminarFavorito(id){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevoFavoritos = favoritos.filter(favoritos => favoritos.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevoFavoritos));
    }

    function existeStorage(id){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    } 

    function mostratToast(mensaje){
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show()
    }

    function obtenerFavoritos(){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        if(favoritos.length){
            mostrarRecetas(favoritos)
            return
        } 

        const noFavoritos = document.createElement('P')
        noFavoritos.textContent = 'No hay favoritos aun';
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        favoritosDiv.appendChild(noFavoritos);
    }

    function limpiarHTML(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild)
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp)
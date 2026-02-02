let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


const inputBusqueda = document.querySelector("#input-busqueda");
const filtroAnime = document.querySelector("#filtro-anime");
const filtroOrden = document.querySelector("#filtro-orden");


function aplicarFiltros() {
    const terminoBusqueda = inputBusqueda.value.toLowerCase();
    const animeSeleccionado = filtroAnime.value;
    const ordenSeleccionado = filtroOrden.value;
    
    let productosFiltrados = productos;
    
    
    if (terminoBusqueda) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.titulo.toLowerCase().includes(terminoBusqueda)
        );
    }
    
    
    if (animeSeleccionado !== "todos") {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.categoria.id === animeSeleccionado
        );
        
        
        const productoCategoria = productos.find(producto => producto.categoria.id === animeSeleccionado);
        if (productoCategoria) {
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
        }
    } else {
        tituloPrincipal.innerText = "Todas las figuras";
    }
    
    
    if (ordenSeleccionado === "asc") {
        productosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (ordenSeleccionado === "desc") {
        productosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
    }
    
    cargarProductos(productosFiltrados);
}


inputBusqueda.addEventListener("input", aplicarFiltros);
filtroAnime.addEventListener("change", aplicarFiltros);
filtroOrden.addEventListener("change", aplicarFiltros);


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        
        if (e.currentTarget.id !== "todos") {
            filtroAnime.value = e.currentTarget.id;
        } else {
            filtroAnime.value = "todos";
        }
        
        aplicarFiltros();
    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #F88C3A, #F8EB3A)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
          },
        onClick: function(){}
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

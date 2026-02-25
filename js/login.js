const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const formTitle = document.getElementById('form-title');
const profileContainer = document.getElementById('profile-container');
const profileName = document.getElementById('profile-name');
const purchaseHistoryContainer = document.getElementById('purchase-history');
const logoutBtn = document.getElementById('logout-btn');

const checkLoginStatus = () => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
        const user = JSON.parse(usuarioLogueado);
        formTitle.innerText = 'Mi Cuenta';
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        profileContainer.classList.remove('hidden');
        profileName.innerText = user.nombre;

        mostrarHistorial(user.historialCompras || []);
    } else {
        formTitle.innerText = 'Iniciar Sesión';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        profileContainer.classList.add('hidden');
    }
};

const mostrarHistorial = (historial) => {
    purchaseHistoryContainer.innerHTML = '';
    if (historial.length === 0) {
        purchaseHistoryContainer.innerHTML = '<p style="color: var(--clr-main); text-align: center;">Aún no tienes compras realizadas.</p>';
        return;
    }

    historial.forEach(compra => {
        const compraDiv = document.createElement('div');
        compraDiv.style.cssText = 'background-color: var(--clr-white); padding: 1rem; border-radius: 1rem; display: flex; flex-direction: column; gap: 0.5rem;';

        let productosList = '';
        compra.productos.forEach(p => {
            productosList += `<p style="font-size: 0.85rem; color: var(--clr-main);">- ${p.titulo} x${p.cantidad} ($${p.precio})</p>`;
        });

        compraDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: var(--clr-main);">
                <span>Total: $${compra.total}</span>
                <span style="font-size: 0.8rem; opacity: 0.7;">${compra.fecha}</span>
            </div>
            <div style="margin-top: 0.5rem;">
                ${productosList}
            </div>
        `;
        purchaseHistoryContainer.appendChild(compraDiv);
    });
};

goToRegister.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    formTitle.innerText = 'Registrarse';
});

goToLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    formTitle.innerText = 'Iniciar Sesión';
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');
    checkLoginStatus();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Toastify({
                    text: data.error,
                    duration: 3000,
                    style: {
                        background: "#961818",
                        borderRadius: "2rem",
                        textTransform: "uppercase",
                        fontSize: ".75rem"
                    }
                }).showToast();
                return;
            }

            Toastify({
                text: "Sesión iniciada correctamente",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #F88C3A, #F8EB3A)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                }
            }).showToast();

            localStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
            loginForm.reset();
            checkLoginStatus();
        })
        .catch(error => console.error(error));
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Toastify({
                    text: data.error,
                    duration: 3000,
                    style: {
                        background: "#961818",
                        borderRadius: "2rem",
                        textTransform: "uppercase",
                        fontSize: ".75rem"
                    }
                }).showToast();
                return;
            }

            Toastify({
                text: "Registro completado correctamente",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #F88C3A, #F8EB3A)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                }
            }).showToast();
            registerForm.reset();
            goToLogin.click();
        })
        .catch(error => console.error(error));
});

checkLoginStatus();

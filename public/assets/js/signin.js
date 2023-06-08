
async function submit() {

    try {
        const response = await API.call('/auth/login', 'POST', {
            mail: document.getElementById('mail').value,
            password: document.getElementById('password').value,
        });
        /* console.log(response.id, response.token) */

        if (response.id != null && response.token != null) {
            window.location.replace("/profil.html")
        }


        /* window.location.href = response.url */
    } catch (error) {
        console.error(error);

        const errorMessageContainer = document.getElementById('ErrorMessage');
        errorMessageContainer.innerHTML = '';

        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Oups, votre pseudo et mail ne correspondent pas. Veuillez re-essayez.";
        errorMessage.style.color = 'red';

        errorMessageContainer.appendChild(errorMessage);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginUsers').addEventListener('click', submit)
})

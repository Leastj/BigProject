
    
    async function submit() {
      try {
        const response = await API.call('/auth/signup', 'POST', {
          pseudo: document.getElementById('pseudo').value,
          mail: document.getElementById('mail').value,
          password: document.getElementById('password').value,
        });

        const myHeaders = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'your-token'
        });
        // console.log(response.id, response.token)

        if (response.id != null && response.token != null) {
          window.location.replace("http://localhost:3000/profil.html")
        }


      } catch (error) {
        console.error(error);

        const errorMessageContainer = document.getElementById('ErrorMessage');
        errorMessageContainer.innerHTML = '';

        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Oups, votre pseudo ou mail existe déjà.";
        errorMessage.style.color = 'red';

        errorMessageContainer.appendChild(errorMessage);
      }
    }

    
  

  document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('creatUsers').addEventListener('click', submit)
  })


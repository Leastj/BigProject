async function submit() {
  try {
    const pseudo = document.getElementById('pseudo').value;
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    console.log('Données du formulaire :', pseudo, mail, password);

    // Supprimer les messages d'erreur existants
    const errorMessageContainer = document.getElementById('ErrorMessage');
    errorMessageContainer.innerHTML = '';

    const response = await API.call('/auth/signup', 'POST', {
      pseudo,
      mail,
      password
    });

    console.log('Réponse de l\'API :', response);

    if (response && response.id && response.token) {
      const confirmed = confirm('Utilisateur créé avec succès. Voulez-vous vous connecter ?');

      if (confirmed) {
        // Redirection vers la page de connexion
        window.location.replace("/signin.html");
      } else {
        // Autres actions à effectuer si l'utilisateur choisit de ne pas se connecter
        // Par exemple, vider les champs du formulaire
        document.getElementById('pseudo').value = '';
        document.getElementById('mail').value = '';
        document.getElementById('password').value = '';
      }
    } else {
      console.log('La réponse de l\'API est incorrecte.');
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);

    const errorMessageContainer = document.getElementById('ErrorMessage');
    errorMessageContainer.innerHTML = '';

    const errorMessage = document.createElement('p');
    errorMessage.textContent = "Oups, votre pseudo ou mail existe déjà.";
    errorMessage.style.color = 'red';

    errorMessageContainer.appendChild(errorMessage);
  }
}

function showAlertMessage(message) {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = '';

  const alertMessage = document.createElement('p');
  alertMessage.textContent = message;
  alertMessage.classList.add('alert-message');

  alertContainer.appendChild(alertMessage);
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById('creatUsers').addEventListener('click', submit);
});
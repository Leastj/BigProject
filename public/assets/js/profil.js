// RÉCUPÉRER TOUT LES ÉVÉNEMENTS 

async function generateEventCards() {
  const eventsContainer = document.getElementById('competitionsContainer');
  eventsContainer.innerHTML = ''; // Vider le conteneur avant de générer les cartes

  try {
    const events = await API.call('/events', 'GET');

    if (Array.isArray(events) && events.length > 0) {
      events.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <h3>${event.title}</h3>
          <p class="date">Date de début : ${event.start_date}</p>
          <p class="date">Date de fin : ${event.end_date}</p>
          <button class="participate-button" data-event-id="${event.id}" data-max-participants="${event.maxParticipants}">
            Participer
          </button>
        `;
        eventsContainer.appendChild(card);
      });

      // Gestion du bouton pour participer 
      const participateButtons = document.querySelectorAll('.participate-button');
      participateButtons.forEach(button => {
        button.addEventListener('click', participateEvent);
      });
    } else {
      console.error('Les données des événements sont vides ou non valides.');
    }
  } catch (error) {
    console.error(error);
    // Gérer les erreurs lors de la récupération des événements
  }
}

document.addEventListener('DOMContentLoaded', generateEventCards);




// FONCTION POUR PARTICIPER À L'ÉVÉNEMENT

async function participateEvent(event) {
  const eventId = event.target.dataset.eventId;
  const maxParticipants = parseInt(event.target.dataset.maxParticipants);

  // Vérifiez si le nombre de participants est atteint
  if (maxParticipants > 0) {
    try {
      // Appeler l'API pour enregistrer la participation de l'utilisateur
      const response = await API.call(`/events/${eventId}/participate`, 'POST', {
        userId: userId // Remplacez userId par l'ID de l'utilisateur actuel
      });

      // Indication à l'utilisateur qu'il participe
      event.target.textContent = 'Accéder au tournois';
      event.target.disabled = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('Le tournoi est complet.');
  }
}



// FONCTION OPEN EVENT POPUP

function openCreateEventPopup() {
  var popup = document.getElementById("createEventPopup");
  popup.style.display = "block";
}

function closeCreateEventPopup() {
  var popup = document.getElementById("createEventPopup");
  popup.style.display = "none";
}


// Fonction pour formater la date au format "AAAA-MM-JJ"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fonction pour afficher une erreur dans le formulaire
function showError(message) {
  errorDateMessage.textContent = message;
  errorDateMessage.style.color = "red";
}

// Fonction pour effacer l'erreur dans le formulaire
function clearError() {
  errorDateMessage.textContent = '';
}

async function submitForm(event) {
  event.preventDefault(); // Empêche le rechargement de la page par défaut


  try {

    // Appeler l'API pour soumettre le formulaire
    const response = await API.call('/events', 'POST', {
      title: document.getElementById('titleEvent').value,
      participants: parseInt(document.getElementById('nombreParticipants').value),
      start_date: document.getElementById('dateDebut').value,
      end_date: document.getElementById('dateFin').value
    });
    console.log("Réponse de l'API :", response);

    // Afficher un message d'alerte pour indiquer que l'événement a été créé
    alert("Événement créé !");


    window.location.replace("http://localhost:3000/profil.html")

  } catch (error) {
    // Gérer les erreurs et afficher un message d'erreur approprié
    console.error(error);
    const errorMessageContainer = document.getElementById('ErrorMessage');
    errorMessageContainer.innerHTML = '';
    const errorMessage = document.createElement('p');
    errorMessage.textContent = "Oups, une erreur s'est produite lors de la création de l'événement.";
    errorMessage.style.color = 'red';
    errorMessageContainer.appendChild(errorMessage);
  }
}











document.addEventListener("DOMContentLoaded", () => {



  

  // OPEN POPUP

  var openPopup = document.getElementById("openpopup");
  openPopup.addEventListener("click", openCreateEventPopup);

  var closePopupIcon = document.getElementById("closePopupIcon");
  closePopupIcon.addEventListener("click", closeCreateEventPopup);



// GESTION ERREUR DATE DE L'ÉVÉNEMENT

const dateDebutInput = document.getElementById('dateDebut');
const dateFinInput = document.getElementById('dateFin');
const errorDateMessage = document.getElementById('errorDate');



// Ajouter un écouteur d'événement lorsque la valeur du champ date de début change
dateDebutInput.addEventListener('change', function () {
  clearError();

  const dateDebut = new Date(dateDebutInput.value);
  const dateFin = new Date(dateFinInput.value);
  const today = new Date();

  if (dateDebut < today) {
    showError("Hop hop hop ! La date de début ne peut pas être antérieure à la date d'aujourd'hui.");
  } else if (dateFin < today) {
    showError("Hop hop hop ! La date de fin ne peut pas être après à la date actuelle.");
  } else if (dateDebut > dateFin) {
    showError("La date de fin ne peut pas être antérieur à la date du jour.");
  }

});

// Ajouter un écouteur d'événement lorsque la valeur du champ date de fin change
dateFinInput.addEventListener('change', function () {
  clearError();

  const dateDebut = new Date(dateDebutInput.value);
  const dateFin = new Date(dateFinInput.value);

  if (dateDebut > dateFin) {
    showError("La date de début ne peut pas être postérieure à la date de fin.");
  }
});







})


// ENVOIE DU FORMULAIRE VERS L'API


document.addEventListener("DOMContentLoaded", (event) => {

  document.getElementById('creatEvent').addEventListener('click', submitForm);

});

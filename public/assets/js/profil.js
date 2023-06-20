
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
  const errorDateMessage = document.getElementById('errorDate');
  errorDateMessage.textContent = message;
  errorDateMessage.style.color = "red";
}

// Fonction pour effacer l'erreur dans le formulaire
function clearError() {
  const errorDateMessage = document.getElementById('errorDate');
  errorDateMessage.textContent = '';
}

async function submitForm(event) {
  event.preventDefault(); // Empêche le rechargement de la page par défaut

  try {
    // Appeler l'API pour soumettre le formulaire
    const response = await API.call('/events', 'POST', {
      title: document.getElementById('titleEvent').value,
      maxParticipants: parseInt(document.getElementById('nombreParticipants').value),
      start_date: document.getElementById('dateDebut').value,
      end_date: document.getElementById('dateFin').value
    });
    console.log("Réponse de l'API :", response);

    // Afficher un message d'alerte pour indiquer que l'événement a été créé
    alert("Événement créé !");

    window.location.replace("http://localhost:3000/profil.html");
  } catch (error) {
    
    // Gérer les erreurs et afficher un message d'erreur approprié
    console.error(error);

    if (error.response && error.response.status === 403) {
      const errorMessage = error.response.data.message;
      alert(errorMessage);
    } else {
      const errorMessageContainer = document.getElementById('ErrorMessage');
      errorMessageContainer.innerHTML = '';
      const errorMessage = document.createElement('p');
      errorMessage.textContent = "Oups, une erreur s'est produite lors de la création de l'événement.";
      errorMessage.style.color = 'red';
      errorMessageContainer.appendChild(errorMessage);
    }
  }
}

const EventUtils = {
  async generateEventCards() {
    const eventsContainer = document.getElementById('competitionsContainer');
    eventsContainer.innerHTML = '';

    try {
      const events = await API.call('/events', 'GET');
      const currentUser = await API.call('/users/current', 'GET');
      const currentUserID = currentUser ? currentUser._id : null;

      if (Array.isArray(events) && events.length > 0 && currentUserID) {
        events.forEach(event => {
          const card = document.createElement('div');
          card.classList.add('card');

          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);

          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);

          // Vérifier si l'utilisateur participe déjà à l'événement
          const isUserParticipating = Array.isArray(event.registeredUsers) && event.registeredUsers.includes(currentUserID);

          // Calculer le nombre de participants inscrits et le nombre maximum de participants
          const participantsCount = Array.isArray(event.registeredUsers) ? event.registeredUsers.length : 0;
          const maxParticipantsCount = typeof event.maxParticipants === 'number' ? event.maxParticipants : 0;

          // Récupérer l'état du bouton depuis le stockage local en utilisant l'ID de l'utilisateur
          const isButtonClicked = localStorage.getItem(`event_${event._id}_${currentUserID}`);

          card.innerHTML = `
            <h3>${event.title}</h3>
            <div class="information">
              <p class="date">Date de début : ${formattedStartDate}</p>
              <p class="date">Date de fin : ${formattedEndDate}</p>
              <p class="participantName">Participants:</p>
              <p class="participants">${participantsCount}  / ${maxParticipantsCount} (participants)</p>
            </div>
            <button class="participate-button" 
                    data-event-id="${event._id}" 
                    data-max-participants="${maxParticipantsCount}"
                    ${isUserParticipating ? 'disabled' : ''}
                    ${isButtonClicked ? 'data-clicked="true"' : ''}>
              ${isButtonClicked ? 'Attendez le début du match' : 'Participer'}
            </button>
          `;

          const participateButton = card.querySelector('.participate-button');
          participateButton.addEventListener('click', () => this.addParticipant(event._id, currentUserID));

          eventsContainer.appendChild(card);
        });
      } else {
        console.error('Les données des événements sont vides ou non valides, ou l\'ID utilisateur actuel est manquant.');
      }
    } catch (error) {
      console.error(error);
      // Gérer les erreurs lors de la récupération des événements
    }
  },
  

  async addParticipant(eventID, userID) {
    try {
      const response = await API.call(`/events/participate/${eventID}`, 'POST');
      const button = document.querySelector(`[data-event-id="${eventID}"]`);
      if (button) {
        button.classList.add('grey-button');
        button.innerText = 'Attendez le début du match';
        button.disabled = true;
        button.dataset.clicked = 'true';
        // Enregistrer l'état du bouton dans le stockage local en utilisant l'ID de l'utilisateur
        localStorage.setItem(`event_${eventID}_${userID}`, 'true');
      }
    } catch (error) {
      console.error(error);
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // OPEN POPUP
  const openPopup = document.getElementById("openpopup");
  openPopup.addEventListener("click", openCreateEventPopup);

  const closePopupIcon = document.getElementById("closePopupIcon");
  closePopupIcon.addEventListener("click", closeCreateEventPopup);

  // GESTION ERREUR DATE DE L'ÉVÉNEMENT
  const dateDebutInput = document.getElementById('dateDebut');
  const dateFinInput = document.getElementById('dateFin');

  // Ajouter un écouteur d'événement lorsque la valeur du champ date de début change
  dateDebutInput.addEventListener('change', function () {
    clearError();

    const dateDebut = new Date(dateDebutInput.value);
    const dateFin = new Date(dateFinInput.value);
    const today = new Date();

    if (dateDebut < today) {
      showError("Hop hop hop ! La date de début ne peut pas être antérieure à la date d'aujourd'hui.");
    } else if (dateFin < today) {
      showError("Hop hop hop ! La date de fin ne peut pas être après la date actuelle.");
    } else if (dateDebut > dateFin) {
      showError("La date de fin ne peut pas être antérieure à la date de début.");
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

  // ENVOIE DU FORMULAIRE VERS L'API
  const createEventButton = document.getElementById('creatEvent');
  createEventButton.addEventListener('click', submitForm);

  // GÉNÉRER LES CARTES D'ÉVÉNEMENTS
  await EventUtils.generateEventCards();

  // Afficher le pseudo de l'utilisateur connecté
  const currentUser = await API.call('/users/current', 'GET');
  if (currentUser) {
    const pseudo = currentUser.pseudo; // Utiliser "pseudo" au lieu de "username"
    const userLabel = document.getElementById('userLabel');
    userLabel.textContent = `Bienvenue dans votre espace ${pseudo}`;
  }
});

window.EventUtils = EventUtils;

export { EventUtils };
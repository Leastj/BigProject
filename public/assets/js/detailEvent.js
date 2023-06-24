

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



const detailEventUtils = {




    // Fonction pour récupérer l'ID utilisateur actuel
    async getCurrentUserID() {
        try {
            const currentUser = await API.call('/users/current', 'GET');
            return currentUser ? currentUser._id : null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getUserDetails(userId) {
        try {
          const userDetails = await API.call(`/users/${userId}`, 'GET');
          return userDetails;
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
          return null;
        }
      },

    async displayEventDetails(eventId) {
        const eventDetailsContainer = document.getElementById('eventDetails');


        try {
            const eventDetails = await API.call(`/events/${eventId}`, 'GET');
            const currentUserID = await detailEventUtils.getCurrentUserID();

            if (eventDetails && currentUserID) {
                const formattedEndDate = formatDate(new Date(eventDetails.end_date));
                const participantsCount = eventDetails.participantIds.length;

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
              <h1>${eventDetails.title}</h1>
              <p>Date de fin : ${formattedEndDate}</p>
              <p>Nombre de participants : ${participantsCount}</p>
            `;

                eventDetailsContainer.appendChild(card);
            } else {
                console.error('Les détails de l\'événement sont vides ou non valides, ou l\'ID utilisateur actuel est manquant.');
            }
        } catch (error) {
            console.error(error);
            // Gérer les erreurs lors de la récupération des détails de l'événement
        }
    },


    async generateTournamentTable(eventId) {
        try {
            const eventDetails = await API.call(`/events/${eventId}`, 'GET');
            const matchIds = eventDetails.matches;
            const tournamentTable = document.getElementById('tournamentTable');
            const tableBody = tournamentTable.querySelector('tbody');
            tableBody.innerHTML = '';
    
            for (let matchIndex = 0; matchIndex < matchIds.length; matchIndex++) {
                const matchId = matchIds[matchIndex];
                const matchDetails = await API.call(`/matches/${matchId}`, 'GET');
                console.log('Match Details:', matchDetails);
                console.log('Player 1:', matchDetails.player1);
                console.log('Player 2:', matchDetails.player2);
                console.log('Score player 1:', matchDetails.u1score1);
                console.log('Score player 2:', matchDetails.u2score1);
    
                const matchRow = document.createElement('tr');
                matchRow.innerHTML = `
                <td>Match ${matchIndex + 1}</td>
                <td>${matchDetails.score ? matchDetails.u1score1 : 'N/A'}</td> 
                <td>${matchDetails.score ? matchDetails.u2score1 : 'N/A'}</td> 
                <td>${matchDetails.score ? matchDetails.score : 'N/A'}</td>
                <td id="scoreButtonCell${matchIndex}"></td>
                `;
                tableBody.appendChild(matchRow);
    
                const scoreButton = document.createElement('button');
                scoreButton.innerText = 'Entrez mon score';
                scoreButton.addEventListener('click', () => this.handleEnterScore(matchId));
                document.getElementById(`scoreButtonCell${matchIndex}`).appendChild(scoreButton);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des matches:', error);
        }
    },



      
      async handleEnterScore(matchID) {
        const userScore = prompt('Entrez votre score');
        const opponentScore = prompt('Entrez le score de votre adversaire');
    
        try {
            const response = await API.call(`/matches/${matchID}/enterScore`, 'PUT', { userScore, opponentScore });
            console.log(response.message);
            // Mettez à jour l'interface utilisateur en conséquence (par exemple, afficher un message de succès ou d'erreur)
        } catch (error) {
            console.error(error);
            // Gérer les erreurs (par exemple, afficher un message d'erreur à l'utilisateur)
        }
    }



};

document.addEventListener("DOMContentLoaded", async () => {



    // DÉTAIL EVENT
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    if (eventId) {
        console.log('Event ID:', eventId);

        async function displayEventDetailsAndTournamentTable(eventId) {
            try {
                const eventDetailsContainer = document.getElementById('eventDetails'); // Utilisez l'ID "eventDetails" ici
                await detailEventUtils.displayEventDetails(eventId, eventDetailsContainer); // Passez l'élément conteneur en tant que deuxième argument
                await detailEventUtils.generateTournamentTable(eventId);
            } catch (error) {
                console.error('Une erreur est survenue lors de l\'affichage des détails de l\'événement et du tableau des matchs.', error);
            }
        }

        displayEventDetailsAndTournamentTable(eventId);
    } else {
        console.error('ID de l\'événement manquant dans l\'URL.');
    }


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


    // Afficher le pseudo de l'utilisateur connecté
    const currentUser = await API.call('/users/current', 'GET');
    if (currentUser) {
        const pseudo = currentUser.pseudo; // Utiliser "pseudo" au lieu de "username"
        const userLabel = document.getElementById('userLabel');
        userLabel.textContent = `Bienvenue dans votre espace ${pseudo}`;
    }


});


window.detailEventUtils = detailEventUtils;

export { detailEventUtils };
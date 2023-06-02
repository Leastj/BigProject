export default class ApiService{
    
API_BASE_URL = 'http://localhost:3000'; // Remplacez cela par votre URL de base de l'API

// Fonction générique pour appeler une API
async function call(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Une erreur est survenue lors de l\'appel de l\'API.');
  }

  return responseData;
}

}
class ApiService {
  static API_BASE_URL = 'http://localhost:3000/api';

  constructor() {
    if (ApiService.instance instanceof ApiService) {
      return ApiService.instance;
    }
    Object.freeze(this);
    ApiService.instance = this;
  }

  async call(endpoint, method = 'GET', data = null) {
    const url = `${ApiService.API_BASE_URL}${endpoint}`;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Une erreur est survenue lors de l\'appel de l\'API.');
      }

      return responseData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async signin(data) {
    const url = `${ApiService.API_BASE_URL}/auth/login`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Une erreur est survenue lors de l\'appel de l\'API.');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const API = new ApiService();
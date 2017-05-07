class Biocaching {
  /** 
   * Initializes the framework by adding an API key.
   * @constructor
   * @param {string} key your API key.
   * @param {string} language the preferred language as ISO 639-2 strings.
   */
  constructor(key, language = 'eng') {
    this._endpoint = 'https://api.biocaching.com/';
    this._apiKey = key;

    this.authorized();

    this.language = localStorage.getItem('language');
    if (!this.language) {
      this.language = language;
      localStorage.setItem('language', language);
    }
  }

  /**
   * Used to login an user
   * @public
   * @param {string} username the email of the user.
   * @param {string} username the ´password of the user.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  login(username, password, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('POST', this._endpoint + 'users/sign_in', true);
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        localStorage.setItem('email', response.email);
        localStorage.setItem('token', response.authentication_token);
        localStorage.setItem('user-id', response.user_id);
        this.email = response.email;
        this._token = response.authentication_token;
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send(JSON.stringify({
      user : {
        email : username,
        password : password
      }
    }));
  }


  /**
   * Used to check if an user is logged in
   * @public
   * @returns {bool}
   */
  authorized() {
    this.email = localStorage.getItem('email');
    this._token = localStorage.getItem('token');
    // check if any of them isn't set
    if (!this.email || !this._token) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Used to retrieve user settings
   * @public
   * @param {function} callback the function to run when the function has finished successfully.
   */
  getUserSettings(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'settings', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Used to update a user's settings
   * @public
   * @param {object} settingsObject settings defined in an object.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  updateUserSettings(settingsObject, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('PUT', this._endpoint + 'settings', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send(JSON.stringify(settingsObject));
  }

  /**
   * Used to upload a observation
   * @public
   * @param {object} observationObject observation data defined in an object.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  uploadObservation(observationObject, callback) {
    var data = new FormData();
    data.append('observation[picture]', observationObject.file);
    data.append('observation[taxon_id]', observationObject.taxon);
    data.append('observation[observed_at]', observationObject.timestamp);
    data.append('observation[latitude]', observationObject.latitude);
    data.append('observation[longitude]', observationObject.longitude);

    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('POST', this._endpoint + 'observations', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send(data);
  }

  /**
   * Used to edit an existing observation
   * @public
   * @param {number} observation id of the observation to edit.
   * @param {object} observationObject observation data defined in an object.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  editObservation(observation, observationObject, callback) {
    var data = new FormData();
    if (observationObject.file) {
      data.append('observation[picture]', observationObject.file);
    } else if (observationObject.taxon) {
      data.append('observation[taxon_id]', observationObject.taxon);
    } else if (observationObject.timestamp) {
      data.append('observation[observed_at]', observationObject.timestamp);
    } else if (observationObject.latitude && observationObject.longitude) {
      data.append('observation[latitude]', observationObject.latitude);
      data.append('observation[longitude]', observationObject.longitude);
    }

    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('PUT', this._endpoint + 'observations/' + observation, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send(data);
  }

  /**
   * Used to retrieve observations nearby a geographic origin
   * @public
   * @param {number} distance distance in meters from origin.
   * @param {number} lat latitude value of the geographic origin.
   * @param {number} lon longitude value of the geographic origin.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  getObservationsByDistance(distance, lat, lon, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'observations/?latitude=' + lat + '&longitude=' + lon + '&distance=' + distance, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Used to retrieve observations by a specific user
   * @public
   * @param {number} user id of the user.
   * @param {number} from observations to skip.
   * @param {number} size number of observations to return.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  getObservationsByUser(user, from, size, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'observations/?user_id=' + user + '&from=' + from + '&size=' + size, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Used to retrieve observations.
   * @public
   * @param {number} from observations to skip.
   * @param {number} size number of observations to return.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  getObservations(from, size, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'observations/?from=' + from + '&size=' + size, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Used to delete an observation.
   * @public
   * @param {number} observation id of the observation to delete.
   * @param {function} callback the function to run when the function has finished successfully.
   */
  deleteObservation(observation, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('DELETE', this._endpoint + 'observations/' + observation, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Retrieves the terms of use.
   * @public
   * @param {function} callback the function to run when the function has finished successfully.
   */
  retrieveTerms(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'terms/', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // turn terms into one big HTML string
        var response = JSON.parse(xhr.responseText);
        var fullTerms;
        for (index = 0; index < response.terms.length; ++index) {
          fullTerms = fullTerms + (index + 1) + '. ' + response.terms[index] + '<br>';
        }
        fullTerms = fullTerms + response.updated_at;

        if (typeof callback == 'function') {
          callback.apply(null, [fullTerms]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Checks if the user has accepted the terms or not.
   * @public
   * @param {function} callback the function to run when the function has finished successfully.
   */
  statusTerms(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'terms/status', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // check status true/false
        var response = JSON.parse(xhr.responseText);
        if (response.status == 'accepted') {
          response = true;
        } else {
          response = false;
        }

        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }

  /**
   * Accepts the terms.
   * @public
   * @param {function} callback the function to run when the function has finished successfully.
   */
  acceptTerms(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', this._endpoint + 'terms/accept', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-User-Api-Key', this._apiKey);
    xhr.setRequestHeader('X-User-Email', this.email);
    xhr.setRequestHeader('X-User-Token', this._token);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }
}

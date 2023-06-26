/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;

  if (!options.data) {
      options.data = {};
  }

  const optionsArr = Object.entries(options.data);

  xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
          options.callback(null, xhr.response);
      } else {
          options.callback(xhr.status);
      }
  }

  if (options.method === 'GET') {
    
    let paramString = '';
    for (let i = 0; i < optionsArr.length; i++) {
      if (i > 0) {
        paramString += '@';
      }
      paramString += optionsArr[i][0] + '=' + optionsArr[i][1];
    }

    xhr.open('GET', options.url + '?' + paramString);
    xhr.responseType = 'json';
    xhr.send();

  } else {

    const formData = new FormData;
    for (let i = 0; i < optionsArr.length; i++) {
    formData.append(optionsArr[i][0], optionsArr[i][1]);
    }

    xhr.open(options.method, options.url);
    xhr.responseType = 'json';
    xhr.send(formData);

  }
}
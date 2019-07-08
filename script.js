'use strict';

const apiKey= 'QIdFyQRWUW0XRWx7IufaYAF1k9k3bklOH6vr0UtC';

const searchUrl= 'https://developer.nps.gov/api/v1/parks/';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function displayResults(responseJson){
  console.log(responseJson);
  $("#js-search-results").empty();
  for (let i=0; i < responseJson.data.length; i++){
    $('#js-search-results').append(
      `<li><h3>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
      </li>`
    )
  }
$('.results').removeClass('hidden');
}

function getParksList(whichStates, maxResults=10){
  const params= {
    api_key: apiKey,
    stateCode: whichStates,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + '?' + queryString;
    console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.total == "0"){
        $('#js-error-message').text(`We couldn't find you any parks. Try typing something else`);
      }
      else {displayResults(responseJson)};
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    console.log('hi');
    event.preventDefault();
    const chosenStates = $('#js-search-states').val();
    const whichStates= chosenStates.replace(/\s+/g, '&stateCode=');
    //getStatesString(whichStates);
    console.log(whichStates);
    const maxResults = $('#js-max-results').val();
    getParksList(whichStates, maxResults);
  });
}

$(watchForm);
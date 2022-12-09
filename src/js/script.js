'use strict';
class Restaurant {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  

  constructor(nameRes, coords, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget) {
    this.type = nameRes;
    this.coords = coords; // [lat, lng]
    this.smoker = smokerType;
    this.drinker = drinker; // in km
    this.dressPref = dressPref;
    this.ambience = ambience;
    this.transport = transport;
    this.maritalS = maritalS;
    this.ageValue = ageValue;
    this.interest = interest;
    this.personality = personality;
    this.activity = activity;
    this.budget = budget;
   
  }

  _setDescription() {

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)}`;
  }

  click() {
    this.clicks++;
  }
}


class Outlet extends Restaurant {

  constructor(nameRes, coords, coordsY, city, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget) {
    super(nameRes, coords, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget);
    this.city = city; 
    this.coordsY = coordsY;
    this.far();
    this._setDescription();
    this.yourPrefs = {
      "smoker":`${smokerType}`,
      "drinker":`${drinker}`,
      "dressPref":`${dressPref}`,
      "ambience":`${ambience}`,
      "transport":`${transport}`,
      "maritalS":`${maritalS}`,
      "ageValue":`${ageValue}`,
      "interest":`${interest}`,
      "personality":`${personality}`,
      "activity":`${activity}`,
      "budget":`${budget}`,
    }

  }
  far() {
    var lat1 = this.coordsY[0];
    var lon1 = this.coordsY[1];
    var lat2 = this.coords[0];
    var lon2 = this.coords[1];
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    this.dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    this.dist = Math.acos(this.dist)
    this.dist = this.dist * 180/Math.PI
    this.dist = this.dist * 60 * 1.1515
    this.dist = this.dist * 1.609344
    return this.dist
  }

  pref() {
    console.log(this.yourPrefs);  
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerRestaurants = document.querySelector('.restaurants');
const inputSmokerType = document.querySelector('.form__input--smoker');
const inputDrinkerLevel = document.querySelector('.form__input--drinkerLevel');
const inputDressPreference = document.querySelector('.form__input--dressPreference');
const inputAmbience = document.querySelector('.form__input--ambience');
const inputTransport = document.querySelector('.form__input--transport');
const inputMarital = document.querySelector('.form__input--marital');
const inputAge = document.querySelector('.form__input--age');
const inputInterest = document.querySelector('.form__input--interest');
const inputPersonality = document.querySelector('.form__input--personality');
const inputActivity = document.querySelector('.form__input--activity');
const inputBudget = document.querySelector('.form__input--budget');
const inputCity = document.querySelector('.form__input--city');
const resetBtn = document.querySelector('.sidebar__header__button');



class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #restaurants = [];
  #yourLoc;
  #yourPref;

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this.handleFormSubmission.bind(this));
    containerRestaurants.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const {latitude}= position.coords;
    const {longitude} = position.coords;
    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    // const coords = [latitude, longitude];
    const coords = [19.432038, -99.132600];
    this.#yourLoc = coords;

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    console.log(this.#map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    console.log(coords);

      L.circleMarker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `location-popup`
        })
      )
      .setPopupContent(
        `Your Location`
      )
      .openPopup();


    

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#restaurants.forEach(work => {
      this._renderRestaurantMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    // form.classList.remove('hidden');
    inputDrinkerLevel.focus();
  }

  async handleFormSubmission(e) {
    e.preventDefault();

    // Get data from form
    const smokerType = inputSmokerType.value;
    const drinker = inputDrinkerLevel.value;
    // const rating = +inputRating.value;
    const dressPref = inputDressPreference.value;
    const ambience = inputAmbience.value;
    const transport = inputTransport.value;
    const maritalS = inputMarital.value;
    const ageValue = +inputAge.value;
    const interest = inputInterest.value;
    const personality = inputPersonality.value;
    const activity = inputActivity.value;
    const budget = inputBudget.value;

    let restaurant;

    inputAge.value = '';

    const payload = {
      "smoker":`${inputSmokerType.value}`,
      "drink_level":`${inputDrinkerLevel.value}`,
      "dress_preference":`${inputDressPreference.value}`,
      "ambience":`${inputAmbience.value}`,
      "transport":`${inputTransport.value}`,
      "marital_status":`${inputMarital.value}`,
      "age":`${ageValue}`,
      "interest":`${inputInterest.value}`,
      "personality":`${inputPersonality.value}`,
      "activity":`${inputActivity.value}`,
      "budget":`${inputBudget.value}`,
    }

    // call api here

    /**
     * restaurant details
     * name, city, longitude, latitude
     */
    const restaurantSuggestions = await fetch("http://localhost:8000/suggestions", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      }
    })
    .then(res => res.json())
    .catch(error => console.log("An Error occurred while fetching restaurant suggestions!", { error }));


    // pass it through map function below
    
    restaurantSuggestions?.map(suggestion => {
      restaurant = new Outlet(suggestion.name ,suggestion.coords, this.#yourLoc, suggestion.city, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget);  
        
      // Add new object to restaurant array
      this.#restaurants.push(restaurant);

      console.log(restaurant);

      // Render restaurant on map as marker
      this._renderRestaurantMarker(restaurant);

      // Render restaurant on list
      this._renderRestaurant(restaurant);
    })
      
      
  /////////////////////////////


    // Hide form + clear input fields
    // this._hideForm();

    // Set local storage to all restaurants
    this._setLocalStorage();
  }

  _renderRestaurantMarker(restaurant) {

      L.marker(restaurant.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          // autoClose: false,
          // closeOnClick: false,
          className: `${restaurant.type}-popup`,
        })
      )
      .setPopupContent(
        ` 🍟 ${restaurant.description}`
      )
      .openPopup();

  }

  _renderRestaurant(restaurant) {
    let html = `
      <li class="restaurant restaurant--${restaurant.type}" data-id="${restaurant.id}">
        <h2 class="restaurant__title">${restaurant.description}</h2>

        <div class="restaurant__details">
          <span class="restaurant__icon">🖇</span>
          <span class="restaurant__value">${restaurant.dist.toFixed(1)}</span>
          <span class="restaurant__unit">km</span>
        </div>
        
        <div class="restaurant__details">
          <span class="restaurant__icon">💰</span>
          <span class="restaurant__value">${restaurant.budget}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">🧍🏻‍♂️</span>
          <span class="restaurant__value">${restaurant.interest}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">📍</span>
          <span class="restaurant__value">${restaurant.city != '?' ? restaurant.city : 'unknown'}</span>
        </div>
        
    </li>
    `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {

    if (!this.#map) return;

    const restaurantEl = e.target.closest('.restaurant');

    if (!restaurantEl) return;

    const restaurant = this.#restaurants.find(
      work => work.id === restaurantEl.dataset.id
    );

    this.#map.setView(restaurant.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        rating: 10,
      },
    });

  }

  _setLocalStorage() {
    localStorage.setItem('restaurants', JSON.stringify(this.#restaurants));
  }

  _getLocalStorage(){
    const data = JSON.parse(localStorage.getItem('restaurants'));
    console.log(data);


    if(!data) return;

    this.#restaurants = data;

    this.#restaurants.forEach(work => {
        this._renderRestaurant(work);
    })

  }

  reset() {
    localStorage.removeItem('restaurants');
    location.reload();
  }



  
}


resetBtn.addEventListener('click', function() {
    app.reset();
})

const app = new App();


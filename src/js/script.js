'use strict';
class Restaurant {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  

  constructor(nameRes, coords, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget) {
    // this.date = ...
    // this.id = ...
    this.type = nameRes;
    this.coords = coords; // [lat, lng]
    this.smoker = smokerType;
    this.drinker = drinker; // in km
    // this.rating = rating; 
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
    // prettier-ignore
    // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
    //   months[this.date.getMonth()]
    // } ${this.date.getDate()}`;
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)}`;
  }

  click() {
    this.clicks++;
  }
}

// Outlet(obj.resName ,obj.cords, this.#yourLoc, rating, obj.city, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget); 

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

    // this.pref();
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


// const inputRating = document.querySelector('.form__input--rating');
const inputCity = document.querySelector('.form__input--city');
// const inputLatitude = document.querySelector('.form__input--latitude');
// const inputLongitude= document.querySelector('.form__input--longitude');
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

    const coords = [latitude, longitude];
    this.#yourLoc = coords;

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    console.log(this.#map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    console.log(coords);

    // your current location
    // var greenIcon = new L.Icon({
    //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [1, -34],
    //   shadowSize: [41, 41]
    // });

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

  // _hideForm() {
  //   // Empty inputs
  //   inputDrinkerLevel.value = inputRating.value = inputCity.value = '';

  //   // form.style.display = 'none';
  //   // form.classList.add('hidden');
  //   // setTimeout(() => (form.style.display = 'grid'), 1000);
  // }

  // _toggleElevationField() {
  //   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  //   inputCity.closest('.form__row').classList.toggle('form__row--hidden');
  // }
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
    
    // const { lat, lng } = this.#mapEvent.latlng;
    // let restaurant;

    // // Empty inputs
    // inputDrinkerLevel.value = inputRating.value = inputCity.value = '';
    
    // // Check if data is valid
    // if (
    //   !validInputs(drinker, rating) ||
    //   !allPositive(drinker, rating)
    //   )
    //   return alert('Inputs have to be positive numbers!');
      
    //   restaurant = new Outlet([lat, lng], this.#yourLoc, drinker, rating, city);  
    //   console.log(restaurant);

    // // Add new object to restaurant array
    // this.#restaurants.push(restaurant);

    // // Render restaurant on map as marker
    // this._renderRestaurantMarker(restaurant);

    // // Render restaurant on list
    // this._renderRestaurant(restaurant);



    //////////////
    // TEST

    const objRes = [
        {
          resName: 'Domino',
          cords: [28.53538174 , 77.19692286],
          city: 'Noida'
        },
        {
          resName: 'Pizza Hut',
          cords: [28.53565588 , 77.19679244],
          city: 'Delhi'
        },
        {
          resName: 'Mc Donalds',
          cords: [28.6564531, 77.3916337],
          city: 'New Delhi'
        },
        {
          resName: 'La Pino Pizza',
          cords: [28.55169    , 77.126642],
          city: 'delhi'
        },
        {
          resName: 'Uncles',
          cords: [28.6560516  , 77.3811977],
          city: 'Noida'
        }

    ];

    // const cords = [
    //   [28.53549388 , 77.19747473],
    //   [28.5375472  , 77.1980333 ],
    //   [28.5355234  , 77.1969242 ],
    //   [28.5381335  , 77.1981225 ],
    //   [28.53744768 , 77.19815936],
    //   [28.53747419 , 77.19795015],
    //   [28.53839431 , 77.19804244],
    //   [28.5386662  , 77.1988082 ],
    //   [28.53576259 , 77.19696745],
    //   [28.53565588 , 77.19679244],
    //   [28.538438   , 77.199152  ],
      
    //   [28.53789627 , 77.19815668],
    //   [28.6557549  , 77.3986287 ],
    //   [28.6560516  , 77.3811977 ],
    //   // [28.6564531  , 77.3916337 ],
    //   [28.6562624  , 77.3816026 ],
    //   [28.554463   , 77.087897  ],
    //   [28.55169    , 77.126642  ],
    //   [28.5620725  , 77.2683524 ],
    //   [28.6564531, 77.3916337]
    // ];
    let restaurant;

    // const smokerType = inputSmokerType.value;
    // const drinker = inputDrinkerLevel.value;
    // // const rating = +inputRating.value;
    // const dressPref = inputDressPreference.value;
    // const ambience = inputAmbience.value;
    // const transport = inputTransport.value;
    // const maritalS = inputMarital.value;
    // const ageValue = +inputAge.value;
    // const interest = inputInterest.value;
    // const personality = inputPersonality.value;
    // const activity = inputActivity.value;
    // const budget = inputBudget.value;

    // Empty inputs
    inputAge.value = '';
    
    // Check if data is valid
    // if (
    //   !validInputs(drinker, rating) ||
    //   !allPositive(drinker, rating)
    //   )
    //   return alert('Inputs have to be positive numbers!');

    const payload = {
      "smoker":`${inputSmokerType.value}`,
      "drinker":`${inputDrinkerLevel.value}`,
      "dressPref":`${inputDressPreference.value}`,
      "ambience":`${inputAmbience.value}`,
      "transport":`${inputTransport.value}`,
      "maritalS":`${inputMarital.value}`,
      "ageValue":`${inputAge.value}`,
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
    const restaurantSuggestions = await fetch("http://localhost:9000", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json"
      }
    }).then(res => res.json()).catch(error => console.log("An Error occurred while fetching restaurant suggestions!", { error }));


    // pass it through map function below
    
    restaurantSuggestions?.map(suggestion => {
      restaurant = new Outlet(suggestion.resName ,suggestion.cords, this.#yourLoc, suggestion.city, smokerType, drinker, dressPref, ambience, transport, maritalS, ageValue, interest, personality, activity, budget);  
        
      // Add new object to restaurant array
      this.#restaurants.push(restaurant);

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
          <span class="restaurant__icon">👘</span>
          <span class="restaurant__value">${restaurant.dressPref}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">🧍🏻‍♂️</span>
          <span class="restaurant__value">${restaurant.interest}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">👩🏻‍🤝‍👩🏻</span>
          <span class="restaurant__value">${restaurant.ambience}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">📍</span>
          <span class="restaurant__value">City</span>
        </div>
        
    </li>
    `;

    // <div class="restaurant__details">
    //       <span class="restaurant__icon">🛵</span>
    //       <span class="restaurant__value">${restaurant.drinker}</span>
    //       <span class="restaurant__unit">km</span>
    //     </div>

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    // BUGFIX: When we click on a restaurant before the map has loaded, we get an error. But there is an easy fix:
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

    // using the public interface
    // restaurant.click();
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

  // renderRestaurantMarker(cords) {

  //   cords.forEach(cr => {
  //     L.marker(cr)
  //   .addTo(this.#map)
  //   .bindPopup(
  //     L.popup({
  //       maxWidth: 250,
  //       minWidth: 100,
  //       autoClose: false,
  //       closeOnClick: false,
  //       // className: `${restaurant.type}-popup`,
  //     })
  //   )
  //   .setPopupContent(
  //     // ` 🍟 ${restaurant.description}`
  //   )
  //   .openPopup();
  //   })
  //   }


  
}


resetBtn.addEventListener('click', function() {
    app.reset();
})

// const cords = [[28.524654,77.5706987], [29.524654,77.5706987], [28.524654,78.5706987],[29,77.5706987]];


const app = new App();


// let url = 'http://127.0.0.1:5500/software/Restaurant-Recommendation-System/index.html';
// let data = {
//     range : `${inputDrinkerLevel}`,
//     rating : `${inputRating}`,
//     city : `${inputCity}`
// }

// let fetchData = {
//   Method: 'POST',
//   Body: JSON.stringify(data),
//   Headers: {
//     Accept: 'application.json',
//     'Content-Type': 'application/json'
//   }
// }

// fetch(url, fetchData)
//   .then(function() {
//     // Handle response you get from the API
//     console.log(fetchData);
//   });
// // app.renderRestaurantMarker(cords);



// const Http = new XMLHttpRequest();
// // const url1='https://jsonplaceholder.typicode.com/posts';
// const url1='http://127.0.0.1:5500/software/Restaurant-Recommendation-System/index.html';
// Http.open("GET", url1);
// Http.send();

// Http.onreadystatechange = (e) => {
//   console.log(Http.responseText + "lol haha")
//   console.log("lol");
// }
console.log("hello");
'use strict';

class Restaurant {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  

  constructor(coords, distance, rating) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.rating = rating; 
   
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Outlet extends Restaurant {

  type = 'ResName';
  constructor(coords, coordsY, distance, rating, city) {
    super(coords, distance, rating);
    this.city = city; 
    this.coordsY = coordsY;
    this.far();
    this._setDescription();
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
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerRestaurants = document.querySelector('.restaurants');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputRating = document.querySelector('.form__input--rating');
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

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newRestaurant.bind(this));
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
    inputDistance.focus();
  }

  // _hideForm() {
  //   // Empty inputs
  //   inputDistance.value = inputRating.value = inputCity.value = '';

  //   // form.style.display = 'none';
  //   // form.classList.add('hidden');
  //   // setTimeout(() => (form.style.display = 'grid'), 1000);
  // }

  // _toggleElevationField() {
  //   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  //   inputCity.closest('.form__row').classList.toggle('form__row--hidden');
  // }
  _newRestaurant(e) {
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const rating = +inputRating.value;
    const city = inputCity.value;

    
    // const { lat, lng } = this.#mapEvent.latlng;
    // let restaurant;

    // // Empty inputs
    // inputDistance.value = inputRating.value = inputCity.value = '';
    
    // // Check if data is valid
    // if (
    //   !validInputs(distance, rating) ||
    //   !allPositive(distance, rating)
    //   )
    //   return alert('Inputs have to be positive numbers!');
      
    //   restaurant = new Outlet([lat, lng], this.#yourLoc, distance, rating, city);  
    //   console.log(restaurant);

    // // Add new object to restaurant array
    // this.#restaurants.push(restaurant);

    // // Render restaurant on map as marker
    // this._renderRestaurantMarker(restaurant);

    // // Render restaurant on list
    // this._renderRestaurant(restaurant);



    //////////////
    // TEST

    const cords = [
      [28.53538174 , 77.19692286],
      [28.53549388 , 77.19747473],
      [28.5375472  , 77.1980333 ],
      [28.5355234  , 77.1969242 ],
      [28.5381335  , 77.1981225 ],
      [28.53744768 , 77.19815936],
      [28.53747419 , 77.19795015],
      [28.53839431 , 77.19804244],
      [28.5386662  , 77.1988082 ],
      [28.53576259 , 77.19696745],
      [28.53565588 , 77.19679244],
      [28.538438   , 77.199152  ],
      
      [28.53789627 , 77.19815668],
      [28.6557549  , 77.3986287 ],
      [28.6560516  , 77.3811977 ],
      // [28.6564531  , 77.3916337 ],
      [28.6562624  , 77.3816026 ],
      [28.554463   , 77.087897  ],
      [28.55169    , 77.126642  ],
      [28.5620725  , 77.2683524 ],
      [28.6564531, 77.3916337]
    ];
    
    let restaurant;

    // Empty inputs
    inputDistance.value = inputRating.value = inputCity.value = '';
    
    // Check if data is valid
    if (
      !validInputs(distance, rating) ||
      !allPositive(distance, rating)
      )
      return alert('Inputs have to be positive numbers!');
    
    cords.forEach(cr => {
      restaurant = new Outlet(cr, this.#yourLoc, distance, rating, city);  
      console.log(restaurant);

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
          <span class="restaurant__icon">⭐</span>
          <span class="restaurant__value">${restaurant.rating}</span>
        </div>
        <div class="restaurant__details">
          <span class="restaurant__icon">📍</span>
          <span class="restaurant__value">${restaurant.city}</span>
        </div>
        
    </li>
    `;

    // <div class="restaurant__details">
    //       <span class="restaurant__icon">🛵</span>
    //       <span class="restaurant__value">${restaurant.distance}</span>
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

// app.renderRestaurantMarker(cords);
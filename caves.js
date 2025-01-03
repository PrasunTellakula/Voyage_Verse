import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyMAhcamfnjH9TtPKbP9BcGluDW8XbY0U",
  authDomain: "user-auth-80d87.firebaseapp.com",
  projectId: "user-auth-80d87",
  storageBucket: "user-auth-80d87.firebasestorage.app",
  messagingSenderId: "207285303304",
  appId: "1:207285303304:web:5b940a45926dfc8d11f9bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const apiKey = "vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM";
const exchangeRateApiKey = "d31455c4fb73039038ecd5a5";


const locationCurrencyMap = {
  "Carlsbad Caverns National Park": "USD",
  "Waitomo Caves": "NZD",
  "Postojna Cave": "EUR",
  "Lascaux": "EUR",
  "Cave of the Crystals": "MXN",
  "Cave of Swallows": "MXN",
  "Sơn Đoòng Cave": "VND",
  "Blue Grotto (Capri)": "EUR",
  "Fingal's Cave": "GBP",
  "Shandong Underground Grand Canyon caves": "CNY",
  "Cave of Altamira": "EUR",
  "Lechuguilla Cave": "USD",
  "Eisriesenwelt caves": "EUR",
  "Cueva de las Manos": "ARS",
  "Cueva de las Estrellas caves": "MXN",
  "Marble Cave": "CLP",
  "Grotta del Vento": "EUR",
  "Waitomo Glowworm Caves": "NZD",
  "Doltso Cave": "EUR",
  "Cueva de la Pileta": "EUR",
  "Cavernas de Santo Domingo cave": "DOP",
  "Cueva del Viento": "EUR",
  "Sardine Caves": "VUV",
  "Cueva de las Maravillas": "DOP",
  "Luray Caverns": "USD",
  "Cave of the Winds (Colorado)": "USD",
  "Harrison's Cave": "BBD",
  "Devil's Marbles Conservation Reserve": "AUD",
  "Altamira Cave": "EUR"
};

async function fetchSliderImages() {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  for (let i = 0; i < Object.keys(locationCurrencyMap).length; i++) {
    const category = Object.keys(locationCurrencyMap)[i];
    const apiUrl = `https://api.pexels.com/v1/search?query=${category}&page=1&per_page=1`;

    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: apiKey },
      });

      if (!response.ok) throw new Error(`Failed to fetch images for ${category}`);
      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        const image = data.photos[0];

        const frame = document.createElement("div");
        frame.className = "frame";
        frame.innerHTML = `
          <img src="${image.src.large}" alt="${category}">
          <p class="content">${category}</p>
        `;

        frame.addEventListener("click", () => openPopup(category));
        gridContainer.appendChild(frame);
      }
    } catch (error) {
      console.error(`Error fetching images for ${category}:`, error);
    }
  }
}

async function fetchWeatherData(placeName) {
  const weatherWidget = document.getElementById("weather-widget");
  const weatherDescription = document.getElementById("weather-description");
  const weatherIcon = document.getElementById("weather-icon");
  const temperature = document.getElementById("temperature");
  const forecastContainer = document.getElementById("forecast-container");

  const queryPlace = placeName.replace(/\s+/g, "+");
  const weatherApiKey = "51375c64d2323a9047535d524afd4cea";
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${queryPlace}&appid=${weatherApiKey}&units=metric`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    if (data.cod === "200") {
      const currentWeather = data.list[0];
      weatherDescription.textContent = currentWeather.weather[0].description;
      weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
      temperature.textContent = `Temperature: ${currentWeather.main.temp}°C`;
      weatherWidget.style.display = "block";

      forecastContainer.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const forecastElement = document.createElement("div");
        forecastElement.className = "forecast-item";

        forecastElement.innerHTML = `
          <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
          <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          <p>${forecast.weather[0].description}</p>
          <p>Temp: ${forecast.main.temp}°C</p>
        `;

        forecastContainer.appendChild(forecastElement);
      }
    } else {
      console.error(`Weather data for ${placeName} not found.`);
      weatherWidget.style.display = "none";
    }
  } catch (error) {
    console.error(`Failed to fetch weather data:`, error);
    weatherWidget.style.display = "none";
  }
}

// map
let mapInstance;

async function fetchMapData(placeName) {
    const mapWidget = document.getElementById("map-widget");
    const mapDiv = document.getElementById("map");


    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&accept-language=en`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];



            mapWidget.style.display = "block";


            if (mapInstance) {
                mapInstance.remove();
            }


            mapInstance = L.map(mapDiv).setView([lat, lon], 10);


            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapInstance);


            L.marker([lat, lon]).addTo(mapInstance).bindPopup(`<b>${placeName}</b>`).openPopup();
        } else {
            console.error("Geocoding failed. No results found.");
            mapWidget.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching map data:", error);
        mapWidget.style.display = "none";
    }
}


async function fetchCurrencyRates() {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`);
    if (!response.ok) throw new Error("Failed to fetch currency rates.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return null;
  }
}

async function populateCurrencyDropdowns(baseCurrency) {
  const currencyData = await fetchCurrencyRates();
  if (currencyData) {
    const currencies = Object.keys(currencyData.conversion_rates);
    const currencyFrom = document.getElementById("currency-from");
    const currencyTo = document.getElementById("currency-to");

    currencyFrom.innerHTML = "";
    currencyTo.innerHTML = "";

    currencies.forEach((currency) => {
      const optionFrom = document.createElement("option");
      optionFrom.value = currency;
      optionFrom.textContent = currency;
      currencyFrom.appendChild(optionFrom);

      const optionTo = document.createElement("option");
      optionTo.value = currency;
      optionTo.textContent = currency;
      currencyTo.appendChild(optionTo);
    });

    currencyFrom.value = baseCurrency;
    currencyTo.value = "USD";
  }
}

async function convertCurrency() {
  const currencyData = await fetchCurrencyRates();
  if (currencyData) {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("currency-from").value;
    const toCurrency = document.getElementById("currency-to").value;
    const conversionRate = currencyData.conversion_rates[toCurrency] / currencyData.conversion_rates[fromCurrency];

    const result = (amount * conversionRate).toFixed(2);
    document.getElementById("conversion-result").textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
  }
}



async function openPopup(placeName) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupSummary = document.getElementById("popup-summary");
  const popupWikipediaLink = document.getElementById("popup-wikipedia-link");
  const reviewsList = document.getElementById("reviews-list");
  const reviewInput = document.getElementById("review-input");
  const reviewFeedback = document.getElementById("review-feedback");
  const submitReviewButton = document.getElementById("submit-review");

  popupTitle.textContent = placeName;
  reviewInput.value = "";
  reviewFeedback.textContent = "";
  const baseCurrency = locationCurrencyMap[placeName] || "USD";
  populateCurrencyDropdowns(baseCurrency);

  const wikipediaApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${placeName}`;
  const response = await fetch(wikipediaApiUrl);
  const data = await response.json();
  popupSummary.textContent = data.extract || "No additional information found.";
  popupWikipediaLink.href = data.content_urls?.desktop?.page || "#";
  popupWikipediaLink.style.display = data.content_urls ? "inline" : "none";

  fetchWeatherData(placeName);
  fetchMapData(placeName);
 
 
  reviewsList.innerHTML = "";
  const reviewsQuery = query(collection(db, "reviews", placeName, "userReviews"));
  const reviewsSnapshot = await getDocs(reviewsQuery);

  if (!reviewsSnapshot.empty) {
    reviewsSnapshot.forEach((doc) => {
      const reviewItem = document.createElement("li");
      reviewItem.textContent = doc.data().review;
      reviewsList.appendChild(reviewItem);
    });
  } else {
    const noReviewsMessage = document.createElement("li");
    noReviewsMessage.textContent = "No reviews yet. Be the first to review!";
    reviewsList.appendChild(noReviewsMessage);
  }

  popup.style.display = "flex";

  document.querySelector(".close-btn").addEventListener("click", () => {
    popup.style.display = "none";
  });

  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dm9nkjxro/upload";
  const uploadPreset = "VoyageVerse";


  submitReviewButton.replaceWith(submitReviewButton.cloneNode(true));
  const newSubmitReviewButton = document.getElementById("submit-review");

  newSubmitReviewButton.addEventListener("click", async () => {
    const review = reviewInput.value.trim();
    const fileInput = document.getElementById("file-input");
    let fileUrl = "";

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "VoyageVerse");
  
      try {
          const response = await fetch("https://api.cloudinary.com/v1_1/dm9nkjxro/upload", {
              method: "POST",
              body: formData,
          });
  
          if (response.ok) {
              const data = await response.json();
              fileUrl = data.secure_url;
              console.log("Uploaded file URL:", fileUrl);
          } else {
              throw new Error("File upload failed");
          }
      } catch (error) {
          console.error("Error uploading file:", error);
      }
  }
  

  if (review || fileUrl) {
    console.log("Saving to Firestore:", { review, fileUrl });
    const reviewDoc = doc(collection(db, "reviews", placeName, "userReviews"));
    await setDoc(reviewDoc, { review, fileUrl });



        reviewFeedback.textContent = "Thank you for your review!";
        reviewInput.value = "";
        fileInput.value = "";

        reviewsList.innerHTML = "";
        const reviewsSnapshot = await getDocs(reviewsQuery);
        reviewsSnapshot.forEach((doc) => {
            const reviewItem = document.createElement("li");
            reviewItem.textContent = doc.data().review;
            reviewsList.appendChild(reviewItem);
        });
    } else {
        reviewFeedback.textContent = "Please write a review or upload a file before submitting.";
    }
});


reviewsList.innerHTML = "";
        reviewsSnapshot.forEach((doc) => {
          const reviewData = doc.data();
          const reviewItem = document.createElement("li");
      
          let reviewContent = `<p>${reviewData.review}</p>`;
      
          if (reviewData.fileUrl) {
              console.log("Fetched file URL:", reviewData.fileUrl);
      
              if (reviewData.fileUrl.endsWith(".mp4") || reviewData.fileUrl.endsWith(".webm")) {
                  reviewContent += `
                      <video controls style="max-width: 100%; margin-top: 10px;">
                          <source src="${reviewData.fileUrl}" type="video/mp4">
                          Your browser does not support the video tag.
                      </video>`;
              } else {
                  reviewContent += `
                      <img src="${reviewData.fileUrl}" alt="Uploaded File" style="max-width: 100%; margin-top: 10px;">`;
              }
          }
      
          reviewItem.innerHTML = reviewContent;
          reviewsList.appendChild(reviewItem);
      });
      
        
  
}



fetchSliderImages();

document.getElementById("convert-button").addEventListener("click", convertCurrency);

const categories = Object.keys(locationCurrencyMap);

const noResultsMessage = document.getElementById("no-results-message");

function filterGridItems(query) {
  const images = document.querySelectorAll(".frame");
  let found = false;

  if (query === "") {
    images.forEach((image) => {
      image.style.display = "block";
    });
    noResultsMessage.style.display = "none";
  } else {
    const lowerCaseQuery = query.toLowerCase();
    images.forEach((image, index) => {
      const category = categories[index].toLowerCase();
      if (category.includes(lowerCaseQuery)) {
        image.style.display = "block";
        found = true;
      } else {
        image.style.display = "none";
      }
    });

    noResultsMessage.style.display = found ? "none" : "block";
  }
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  filterGridItems(query);
});

searchInput.addEventListener("keyup", (event) => {
  const query = searchInput.value.trim();
  filterGridItems(query);
});

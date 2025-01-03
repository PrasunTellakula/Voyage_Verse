const places = [
    'Paris',
    'New York',
    'Tokyo',
    'Sydney',
    'Dubai',
    'London',
    'Rome',
    'Athens',
    'Istanbul',
    'Machu Picchu',
    'Colosseum',
    'Eiffel Tower',
    'Great Wall of China',
    'Taj Mahal',
    'Christ the Redeemer Statue',
    'Grand Canyon',
    'Yellowstone National Park',
    'Mount Everest',
    'Mount Fuji',
    'Santorini',
    'Kyoto',
    'Machu Picchu',
    'Acropolis of Athens',
    'Sagrada Familia',
    'Sydney Opera House',
    'Niagara Falls',
    'Mount Kilimanjaro',
    'Victoria Falls',
    'Angkor Wat',
    'Niagara Falls',
    'Stonehenge',
    'Stonehenge',
    'Great Barrier Reef',
    'Bora Bora',
    'Galapagos Islands',
    'Hawaii',
    'Berlin Wall',
    'Sao Paulo',
    'Banff National Park',
    'Cappadocia',
    'Neuschwanstein Castle',
    'Lake Baikal',
    'Palawan',
    'Everglades National Park',
    'Maui',
    'Madagascar',
    'Mount Rushmore',
    'Sequoia National Park',
    'Alhambra',
    'Zion National Park',
    'Mount Rushmore',
    'Kruger National Park'
  ];
  
  
  const pexelsApiKey = 'vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM';  // Replace with your Pexels API Key
  const randomizerElement = document.getElementById('randomizer');
  const spinButton = document.getElementById('spinButton');
  

  function getRandomPlace() {
    const randomIndex = Math.floor(Math.random() * places.length);
    return places[randomIndex];
  }
  

  async function getImageFromPexels(query) {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: pexelsApiKey
        }
      });
      const data = await response.json();
      return data.photos[0].src.original;
    } catch (error) {
      console.error('Error fetching image from Pexels:', error);
      return 'https://via.placeholder.com/300';
    }
  }
  

  async function spinRandomizer() {
    const randomPlace = getRandomPlace();
    const imageUrl = await getImageFromPexels(randomPlace);
  

    randomizerElement.style.transform = 'rotate(3600deg)';
    

    setTimeout(() => {
      randomizerElement.innerHTML = `
        <img id="placeImage" src="${imageUrl}" alt="${randomPlace}" style="cursor: pointer; max-width: 100%; height: auto;"/>
        <p id="placeName" style="cursor: pointer; color: #007BFF;">${randomPlace}</p>
      `;
      randomizerElement.style.transform = 'rotate(0deg)';
      

      const placeNameElement = document.getElementById('placeName');
      const placeImageElement = document.getElementById('placeImage');
      
      placeNameElement.addEventListener('click', function() {
        const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(randomPlace)}`;
        window.open(wikipediaUrl, '_blank');
      });
  

      placeImageElement.addEventListener('click', function() {
        const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(randomPlace)}`;
        window.open(wikipediaUrl, '_blank');
      });
  
    }, 3000);
  }
  

  spinButton.addEventListener('click', function() {
    randomizerElement.innerHTML = 'Spinning...';
    spinRandomizer();
  });
  

  spinRandomizer();
  
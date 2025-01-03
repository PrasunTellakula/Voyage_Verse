let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');


let countItem = items.length;
let itemActive = 0;
// event next click
next.onclick = function(){
    itemActive = itemActive + 1;
    if(itemActive >= countItem){
        itemActive = 0;
    }
    showSlider();
}
//event prev click
prev.onclick = function(){
    itemActive = itemActive - 1;
    if(itemActive < 0){
        itemActive = countItem - 1;
    }
    showSlider();
}
// auto run slider
let refreshInterval = setInterval(() => {
    next.click();
}, 5000)
function showSlider(){

    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    itemActiveOld.classList.remove('active');
    thumbnailActiveOld.classList.remove('active');


    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');
    setPositionThumbnail();


    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        next.click();
    }, 5000)
}
function setPositionThumbnail () {
    let thumbnailActive = document.querySelector('.thumbnail .item.active');
    let rect = thumbnailActive.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
        thumbnailActive.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }
}

// click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    })
})
























const apiKey = 'vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM'; // Replace with your Pexels API Key

const categories = [
    'Islands', 'Beaches', 'Deserts', 'Hills', 'Forests',
    'Religious Places', 'Waterfalls', 'Lakes', 'Caves', 
    'Wildlife Sanctuaries', 'Historical Monuments'
];

async function fetchSliderImages() {
    const sliderItems = document.querySelectorAll('.slider .list .item');
    const thumbnails = document.querySelectorAll('.thumbnail .item');
    
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const apiUrl = `https://api.pexels.com/v1/search?query=${category}&page=1&per_page=1`; // Fetch 1 image per category

        try {

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch images for category: ${category}`);
            }

            const data = await response.json();


            if (data.photos && data.photos.length > 0) {
                const image = data.photos[0];
                if (sliderItems[i]) {
                    sliderItems[i].querySelector('img').src = image.src.original;
                    sliderItems[i].querySelector('h2').textContent = `${category}`;
                    sliderItems[i].querySelector('p').textContent = image.alt || 'No description available';
                }

                if (thumbnails[i]) {
                    thumbnails[i].querySelector('img').src = image.src.tiny;
                    thumbnails[i].querySelector('.content').textContent = `${category}`;
                }
            } else {
                console.log(`No images found for category: ${category}`);
            }
        } catch (error) {
            console.error(`Error fetching images for ${category}:`, error);
        }
    }
}


fetchSliderImages();









// Map categories to corresponding pages (URLs)
const categoryPages = {
    'Islands': 'islands.html',
    'Beaches': 'beaches.html',
    'Deserts': 'deserts.html',
    'Hills': 'hills.html',
    'Forests': 'forests.html',
    'Religious Places': 'religious-places.html',
    'Waterfalls': 'waterfalls.html',
    'Lakes': 'lakes.html',
    'Caves': 'caves.html',
    'Wildlife Sanctuaries': 'wildlife-sanctuaries.html',
    'Historical Monuments': 'historical-monuments.html'
};


thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('dblclick', () => {
        const category = categories[index];
        const page = categoryPages[category];
        if (page) {
            window.location.href = page;
        }
    });
});

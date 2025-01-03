function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
     sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
     sidebar.style.display = 'none'
}
//video slider navigation
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".video-slide");
const contents = document.querySelectorAll(".content");

var sliderNav = function(manual){
    btns.forEach((btn) => {
        btn.classList.remove("active");
    });

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    contents.forEach((content) => {
        content.classList.remove("active");
    });

    btns[manual].classList.add("active");
    slides[manual].classList.add("active");
    contents[manual].classList.add("active");
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    })
});

const apiKey = 'vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM';
const videoElement = document.querySelectorAll(".video-slide");

const themes = ['island', 'camping', 'road trip', 'adventure', 'nature'];

async function fetchVideos() {
    try {
        for (let i = 0; i < themes.length; i++) {
            const response = await fetch(`https://api.pexels.com/videos/search?query=${themes[i]}&per_page=1`, {
                headers: {
                    Authorization: apiKey
                }
            });
            const data = await response.json();
            if (data.videos && data.videos.length > 0) {
                videoElement[i].src = data.videos[0].video_files[0].link;
            }
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

fetchVideos();

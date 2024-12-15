const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const resultImage = document.querySelector(".resultImage");
const modal = document.querySelector(".modal");
const modalImg = modal.querySelector("img");
const closeBtn = modal.querySelector(".close-btn");

const showMoreBtn = document.querySelector(".show-more");
const accessKey = "9v0nSDV1h31kPT0N0JKlFz2HsHVlVG69G4qKAVMDYs0"; // Make sure this is correct
let page = 1;

// Function to fetch data from Unsplash API
const fetchData = async () => {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchInput.value}&client_id=${accessKey}`;
    
    try {
        const response = await fetch(url);
        
        // Check for successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if any errors are returned in the response
        if (data.errors) {
            console.error("API error:", data.errors);
            alert("There was an error fetching the data.");
            return { results: [] }; // Return an empty array if there's an error
        }

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching images.");
        return { results: [] }; // Return an empty array on error
    }
};

// Function to render images in the gallery
const renderData = (data = []) => {
    data.results.forEach(imageData => {
        const img = document.createElement('img');
        img.src = imageData.urls.small;
        img.alt = imageData.alt_description || 'Unsplash Image';

        const imgLink = document.createElement("a");
        imgLink.href = imageData.links.html;

        img.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(imageData.urls.full);
        });

        imgLink.appendChild(img);
        resultImage.appendChild(imgLink);
    });
};

// Function to handle Show More button click
const handleShowMoreImage = async () => {
    ++page;
    const responseData = await fetchData();
    renderData(responseData);
};

// Search Form Submit Event Listener
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    page = 1;

    const data = await fetchData();
    resultImage.innerHTML = ""; // Clear previous results
    renderData(data); // Render new results

    showMoreBtn.classList.remove('hidden'); // Show "Show More" button
    console.log("data", data);
});

// Show More Button Click Event Listener
showMoreBtn.addEventListener("click", async () => {
    handleShowMoreImage();
});

// Function to open the modal with full image
const openModal = (imgSrc) => {
    if (imgSrc) {
        modalImg.src = imgSrc;
        modal.style.display = "flex";
    } else {
        console.error("Image source is not available.");
    }
};

// Close Modal Event Listener
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Scroll Event Listener for infinite scroll
window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        handleShowMoreImage();
    }
});
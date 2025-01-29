// YouTube API key - Replace with your actual API key
const API_KEY = 'AIzaSyDVTGwCrI-cmQKPzg94lVKLwMzIEGrp3I0'; // Replace this with your actual API key

// Get DOM elements
const fetchButton = document.getElementById('fetchButton');
const youtubeUrlInput = document.getElementById('youtubeUrl');
const videoInfoDiv = document.getElementById('videoInfo');
const thumbnailImg = document.getElementById('thumbnail');
const videoTitleElement = document.getElementById('videoTitle');
const videoDescriptionElement = document.getElementById('videoDescription');
const movieNameInput = document.getElementById('movieName');

// Add click event listener to the fetch button
fetchButton.addEventListener('click', fetchVideoDetails);

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        return urlObj.searchParams.get('v');
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

// Main function to fetch video details
async function fetchVideoDetails() {
    // Get the YouTube URL from input
    const youtubeUrl = youtubeUrlInput.value.trim();
    
    if (!youtubeUrl) {
        alert('Please enter a YouTube URL');
        return;
    }

    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
        alert('Invalid YouTube URL');
        return;
    }

    try {
        // Show loading state
        fetchButton.textContent = 'Loading...';
        fetchButton.disabled = true;

        // Fetch video details from YouTube API
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch video data');
        }

        const data = await response.json();

        if (data.items.length === 0) {
            throw new Error('No video found');
        }

        // Get video details from response
        const videoDetails = data.items[0].snippet;

        // Update UI with video details
        thumbnailImg.src = videoDetails.thumbnails.high.url;
        videoTitleElement.textContent = videoDetails.title;
        videoDescriptionElement.textContent = videoDetails.description;
        
        // Auto-fill the movie name if it's empty
        if (!movieNameInput.value) {
            movieNameInput.value = videoDetails.title;
        }

        // Show the video info section
        videoInfoDiv.style.display = 'block';

    } catch (error) {
        console.error('Error fetching video data:', error);
        alert('Error fetching video data. Please try again.');
    } finally {
        // Reset button state
        fetchButton.textContent = 'Fetch Movie Info';
        fetchButton.disabled = false;
    }
}

// Optional: Add input validation for YouTube URL
youtubeUrlInput.addEventListener('input', function() {
    const url = this.value.trim();
    const isValidUrl = url.includes('youtube.com/watch?v=') || url.includes('youtu.be/');
    fetchButton.disabled = !isValidUrl;
});
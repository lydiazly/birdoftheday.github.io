// Function to fetch and parse JSON
async function fetchJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error;
    }
}

// Get the default date from config.json
async function getDefaultDate() {
    try {
        const config = await fetchJSON('config.json');
        return config.defaultDate;
    } catch (error) {
        // If there's an error fetching config.json, use a fallback default date
        console.error('Error reading default date from config:', error);
        return '2024-02-13'; // Fallback default date
    }
}

// Function to check if a directory exists
async function directoryExists(path) {
    try {
        const response = await fetch(path);
        return response.ok;
    } catch (error) {
        return false;
    }
}


// Get the current date
var currentDate = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles'
});

// Function to parse URL query parameters
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function formatDateToUS(dateString) {
    const parts = dateString.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    // Create a Date object from the date string
    const date = new Date(dateString);
    // Get the month name from the Date object
    const monthName = date.toLocaleString('en-US', {
        month: 'long'
    });
    // Format the date in US format with month name
    const formattedDate = monthName + ' ' + day + ', ' + year;

    return formattedDate;
}

// Function to fetch JSON data
function fetchJSONData(jsonPath, formattedDate, requestedDate) {
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            handleJSONData(data, formattedDate, requestedDate);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to handle JSON data
function handleJSONData(data, formattedDate, requestedDate) {
    const carouselInner = document.getElementById('carousel-inner');

    // Iterate over the JSON data and create carousel items
    data.forEach((item, index) => {
        var carouselItem = document.getElementById('first-slide');
        var imageCredit = document.getElementById('first-image-credit');
        if (index === 0) {
            // Get the current date in US format (MM/DD/YYYY)
            var currentDateUSFormat = requestedDate ? formatDateToUS(requestedDate) : new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            // Create a span element to hold the current date
            var currentDateSpan = document.createElement('span');
            currentDateSpan.textContent = currentDateUSFormat;
            currentDateSpan.style.display = 'block'; // Display on a new line
            currentDateSpan.style.fontSize = '16px'; // Smaller font size

            // Find the <h2> element with the class "text-uppercase"
            var heading = document.querySelector('.text-uppercase');

            // Append the current date span to the <h2> element
            heading.appendChild(currentDateSpan);
        } else {
            carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');

            var carouselCaption = document.createElement('div');
            carouselCaption.classList.add('carousel-caption', 'd-md-block');

            var title = document.createElement('h2');
            title.classList.add('text-white');
            title.textContent = item.title;

            var caption = document.createElement('p');
            caption.innerHTML = item.caption;

            imageCredit = document.createElement('p');
            imageCredit.classList.add('text-right', 'text-italic', 'mb-0');
            imageCredit.style.fontSize = '14px';
            imageCredit.style.position = 'absolute';
            imageCredit.style.bottom = '0px';
            imageCredit.style.right = '4px';

            carouselCaption.appendChild(title);
            carouselCaption.appendChild(caption);
        }

        carouselItem.style.backgroundImage = `url('posts/${formattedDate}/slider${item.id}.jpg')`;
        imageCredit.textContent = "Image credit: " + item.imageCredit;

        if (index > 0) {
            carouselCaption.appendChild(imageCredit);
            carouselItem.appendChild(carouselCaption);
            carouselInner.appendChild(carouselItem);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Format the date in the required format (YYYY-MM-DD)
    // var formattedDate = currentDate.toISOString().split('T')[0];
    var timeParts = currentDate.split('/');
    var formattedDate = timeParts[2] + '-' + ('0' + timeParts[0]).slice(-2) + '-' + ('0' + timeParts[1]).slice(-2);
    const CurrentFormattedDate = formattedDate;
    
    // Construct the path to the JSON file
    var jsonPath = 'posts/' + formattedDate + '/data.json';

    // Get the value of the 'date' parameter from the URL
    var requestedDate = getParameterByName('date');

    // Check if a date was provided in the URL
    if (requestedDate) {
        // Update the formattedDate variable with the parsed date
        formattedDate = requestedDate;
        // Update the jsonPath variable with the new path based on the parsed date
        jsonPath = 'posts/' + formattedDate + '/data.json';
    }

    // Check if the directory exists
    directoryExists(jsonPath)
        .then(exists => {
            if (exists) {
                // Directory exists, fetch JSON data using current date
                fetchJSONData(jsonPath, formattedDate, requestedDate);
            } else {
                // Directory doesn't exist, use the default date and fetch JSON data
                if (!requestedDate) {
                    getDefaultDate()
                        .then(defaultDate => {
                            formattedDate = defaultDate;
                            jsonPath = 'posts/' + formattedDate + '/data.json';
                            console.log('Use the default date', defaultDate);
                            fetchJSONData(jsonPath, formattedDate, requestedDate);
                        })
                        .catch(error => console.error('Error getting default date:', error));
                } else {
                    requestedDate = "";
                    formattedDate = CurrentFormattedDate;
                    jsonPath = 'posts/' + formattedDate + '/data.json';
                    console.log('Use the current date', formattedDate);
                    fetchJSONData(jsonPath, formattedDate, requestedDate);
                }
            }
        })
        .catch(error => console.error('Error checking directory:', error));
});

function isValidDateFormat(dateString) {
    // Regular expression to match the 'YYYY-MM-DD' format
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

function checkDate() {
    var inputDate = document.getElementById("pick-date").value;

    // Construct the path to check if the directory exists
    var folderPath = 'posts/' + inputDate;

    if (isValidDateFormat(folderPath.split('/')[1])) {
        window.location.href = "index.html?date=" + inputDate;
    } else {
        console.log('Invalid date format');
    }
}
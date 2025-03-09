document.addEventListener('DOMContentLoaded', () => {
    const stardewValleyLink = document.getElementById('stardew-valley-link');

    stardewValleyLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'guides/stardew-valley.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5001/api/guides') // Make sure the port matches your backend server
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Display data on the frontend
        })
        .catch(error => console.error('Error fetching guides:', error));
});


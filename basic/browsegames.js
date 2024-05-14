const userSubscription = 'Basic';
// Make an asynchronous request to gamelist.json
fetch('gamelist.json')
.then(response => response.json()) // Parse JSON response
.then(data => {
    // Loop through each game object in the JSON data
    data.forEach(game => {
        // Construct the HTML content for each game card
        let htmlContent = `
            <div class="card">
                <a href="${game['game-files-loc']}" class="unstyle">
                    <img class="card-img" src="${game['game-image-url']}" />
                    <h3 class="card-h3">${game['game-title']}</h3>
                    <p class="card-p">`;

        // Check if subscription is required
        const hasAccess = game['requires-subscription'] ? game['requires-subscription'].includes(userSubscription) : true;

        // Game system
        htmlContent += `${game['game-system']}`;

        // Check if the game requires an emulator
        if (game['emulator']) {
            htmlContent += ` - Emulator`;
        }

        htmlContent += `</p>
                </a>
            </div>`;

        // Append the game card to the corresponding container
        if (game['popular']) {
            document.getElementById('popular-games').innerHTML += htmlContent;
        } else if (game['emulator']) {
            document.getElementById('emulator-games').innerHTML += htmlContent;
        } else {
            // Add all games to the "All Games" section
            document.getElementById('all-games').innerHTML += htmlContent;
            // Check if the game is new and add it to the "New Games" section
            if (isNewGame(game['added'])) {
                document.getElementById('new-games').innerHTML += htmlContent;
            }
        }
    });
})
.catch(error => console.error('Error fetching data:', error));

// Function to check if a game is new (added within the past 7 days)
function isNewGame(addedDate) {
    if (!addedDate) return false; // Handle cases where added date is not available
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const addedDateParts = addedDate.split('/');
    const addedDateObj = new Date(`${addedDateParts[2]}-${addedDateParts[0]}-${addedDateParts[1]}`);
    return addedDateObj > sevenDaysAgo;
}
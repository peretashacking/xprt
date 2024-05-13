// Simulating user's subscription level
const userSubscription = 'Basic'; // Replace this with actual user subscription level
    
// Make an asynchronous request to gamelist.json
fetch('/gamelist.json') // Updated path to gamelist.json
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        console.log(data); // Log the data to the console for debugging
        // Loop through each game object in the JSON data
        data.forEach(game => {
            // Check if the game title exists
            if (game['game-title']) {
                // Check if the user's subscription level allows access to the game
                const hasAccess = game['requires-subscription'] ? game['requires-subscription'].includes(userSubscription) : true;

                // Construct the HTML content for each game card
                let htmlContent = `
                    <div class="card">
                        <a href="${game['game-files-loc']}" class="unstyle">
                            <img class="card-img" src="${game['game-image-url']}" />
                            <h3 class="card-h3">${game['game-title']}</h3>
                            <p class="card-p">`;

                // Check if the game is included in the subscription
                if (hasAccess) {
                    htmlContent += `Included with Subscription<br>`;
                } else {
                    htmlContent += `<i class="fa fa-lock" style="font-size:16px;color:white;"></i> Not Included with Subscription<br>`;
                }

                // Game system
                htmlContent += `${game['game-system']}`;

                // Check if the game requires an emulator
                if (game['emulator']) {
                    htmlContent += ` - Emulator`;
                }

                htmlContent += `</p>
                        </a>
                    </div>`;

                // Update the HTML content of game-list div with the constructed HTML
                document.getElementById('game-list').innerHTML += htmlContent;
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
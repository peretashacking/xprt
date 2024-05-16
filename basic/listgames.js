const userSubscription = 'Basic'; // Replace this with actual user subscription level

// Define your JSON data
const jsonData = [
    {
        "SITE SETTINGS": "SKIBIDITOILETISSOFUCKINGHOT",
        "hide-inelgible-games": false
    },
    {
        "game-image-url": "assets/mc-banner.png",
        "game-title": "Minecraft",
        "requires-subscription": ["Basic", "Ultimate", "Unblock"],
        "game-system": "",
        "game-callout": "Minecraft",
        "game-files-loc": "play/minecraft.html",
        "added": "05/13/2024",
        "emulator": false,
        "game-folder": 1,
        "popular": true
    },
    {
        "game-image-url": "assets/skibidi.jpg",
        "game-title": "v1.0.3",
        "requires-subscription": ["Ultimate", "Unblock"],
        "game-system": "",
        "game-callout": "upgrade",
        "game-files-loc": "upgrade.html",
        "added": "05/14/2024",
        "emulator": false,
        "game-folder": 1,
        "popular": true
    }
];

// Process the JSON data
jsonData.forEach(game => {
    // Ensure the object represents a game entry
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

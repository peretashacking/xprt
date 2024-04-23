let zipContent; // Store the loaded ZIP content globally

function injectZipContent() {
    // Step 1: Download the .zip file
    fetch('https://cdn.peretas.tech/xprtsigma.zip')
        .then(response => response.blob())
        .then(zipBlob => {
            // Step 2: Unzip the content
            JSZip.loadAsync(zipBlob)
                .then(zip => {
                    zipContent = zip; // Store the loaded ZIP content globally
                    // Display the index.html initially
                    displayPage('index.html');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error downloading the zip file:', error);
        });
}

function displayPage(pageName) {
    if (!zipContent) {
        console.error('ZIP content not loaded yet.');
        return;
    }

    // Step 3: Extract the HTML content of the specified file
    zipContent.file(pageName).async('string')
        .then(htmlContent => {
            // Step 4: Open an about:blank window
            const aboutBlankWindow = window.open('about:blank');
            aboutBlankWindow.document.open();
            aboutBlankWindow.document.write(htmlContent);
            aboutBlankWindow.document.close();

            let currentPath = '';

aboutBlankWindow.document.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'a') {
        event.preventDefault(); // Prevent default navigation
        const href = event.target.getAttribute('href');
        if (href) {
            // Update current path
            if (href.includes('/')) {
                currentPath = href.substring(0, href.lastIndexOf('/')) + '/';
            }

            // Extract file name from href
            const fileName = currentPath + href.split('/').pop();
            // Check if the file exists in the zip
            if (zipContent.file(fileName)) {
                // Load the file content from the zip
                zipContent.file(fileName).async('string')
                    .then(fileContent => {
                        // Open a new about:blank window and inject the file content
                        const newWindow = window.open('about:blank');
                        newWindow.document.open();
                        newWindow.document.write(fileContent);
                        newWindow.document.close();
                    })
                    .catch(error => {
                        console.error('Error reading file from ZIP:', error);
                    });
            } else {
                console.error(`File '${fileName}' not found in ZIP.`);
            }
        }
    }
})})}
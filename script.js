let zipContent; // Store the loaded ZIP content globally

function injectZipContent() {
    // Step 1: Download the .zip file
    fetch('https://cdn.peretas.tech/okok.zip')
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
    // Step 1: Get the content of the page from the ZIP file
    const pageContent = zipContent.file(pageName);
    if (pageContent) {
        pageContent.async('text')
        .then(htmlContent => {
            // Step 2: Display the content in the about:blank window
            const newWindow = window.open();
            if (newWindow) {
                const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
                const fragment = newWindow.document.createDocumentFragment();
                fragment.appendChild(doc.documentElement.cloneNode(true));
                newWindow.document.open();
                newWindow.document.appendChild(fragment);
                newWindow.document.close();

                // Step 3: Inject inline CSS
                const cssLinks = newWindow.document.querySelectorAll('link[rel="stylesheet"]');
                cssLinks.forEach(cssLink => {
                    const href = cssLink.getAttribute('href');
                    if (href) {
                        fetch(href)
                            .then(response => response.text())
                            .then(cssContent => {
                                const style = newWindow.document.createElement('style');
                                style.textContent = cssContent;
                                newWindow.document.head.appendChild(style);
                            })
                            .catch(error => {
                                console.error('Error loading CSS:', error);
                            });
                    }
                });

                // Step 4: Inject inline JavaScript
                const scriptTags = newWindow.document.querySelectorAll('script[src]');
                scriptTags.forEach(scriptTag => {
                    const src = scriptTag.getAttribute('src');
                    if (src) {
                        fetch(src)
                            .then(response => response.text())
                            .then(jsContent => {
                                const script = newWindow.document.createElement('script');
                                script.textContent = jsContent;
                                newWindow.document.body.appendChild(script);
                            })
                            .catch(error => {
                                console.error('Error loading JavaScript:', error);
                            });
                    }
                });

                // Step 5: Add event listeners to handle navigation within the window
                const links = newWindow.document.querySelectorAll('a');
                links.forEach(link => {
                    link.addEventListener('click', event => {
                        event.preventDefault(); // Prevent default link behavior
                        const nextPage = link.getAttribute('href');
                        displayPage(nextPage);
                    });
                });
            } else {
                throw new Error('Unable to open a new window.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error(`${pageName} not found in the zip file.`);
    }
}


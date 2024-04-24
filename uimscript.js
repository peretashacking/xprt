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
    // Step 1: Download the .zip file
    fetch('https://cdn.peretas.tech/xprtsigma.zip')
        .then(response => response.blob())
        .then(zipBlob => {
            // Step 2: Unzip the content
            JSZip.loadAsync(zipBlob)
                .then(zip => {
                    // Step 3: Check if the file exists in the ZIP
                    const pageFile = zip.file(pageName);
                    if (pageFile) {
                        // Step 4: Extract the HTML content of the specified file
                        pageFile.async('string')
                            .then(htmlContent => {
                                // Step 5: Open an about:blank window
                                const aboutBlankWindow = window.open('about:blank');
                                if (!aboutBlankWindow) {
                                    console.error('Failed to open about:blank window.');
                                    return;
                                }

                                // Step 6: Inject the HTML content into the about:blank window
                                aboutBlankWindow.document.open();
                                aboutBlankWindow.document.write(htmlContent);
                                aboutBlankWindow.document.close();

                                // Step 7: Intercept <a> link clicks in the about:blank window
                                aboutBlankWindow.document.addEventListener('click', event => {
                                    if (event.target.tagName.toLowerCase() === 'a') {
                                        event.preventDefault(); // Prevent default navigation
                                        const href = event.target.getAttribute('href');
                                        if (href) {
                                            // Step 8: Download the ZIP file for the linked page
                                            fetch('https://cdn.peretas.tech/xprtsigma.zip')
                                                .then(response => response.blob())
                                                .then(zipBlob => {
                                                    // Step 9: Unzip the content
                                                    JSZip.loadAsync(zipBlob)
                                                        .then(zip => {
                                                            // Step 10: Check if the file exists in the ZIP
                                                            const linkedFile = zip.file(href);
                                                            if (linkedFile) {
                                                                // Step 11: Extract the HTML content of the linked file
                                                                linkedFile.async('string')
                                                                    .then(linkedHtmlContent => {
                                                                        // Step 12: Open a new about:blank window
                                                                        const newWindow = window.open('about:blank');
                                                                        if (!newWindow) {
                                                                            console.error('Failed to open about:blank window.');
                                                                            return;
                                                                        }

                                                                        // Step 13: Inject the HTML content into the new about:blank window
                                                                        newWindow.document.open();
                                                                        newWindow.document.write(linkedHtmlContent);
                                                                        newWindow.document.close();
                                                                    })
                                                                    .catch(error => {
                                                                        console.error('Error reading linked HTML file from ZIP:', error);
                                                                    });
                                                            } else {
                                                                console.error(`File '${href}' not found in ZIP.`);
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error('Error unzipping ZIP for linked page:', error);
                                                        });
                                                })
                                                .catch(error => {
                                                    console.error('Error downloading ZIP for linked page:', error);
                                                });
                                        }
                                    }
                                });

                                // Step 14: Inject CSS and JavaScript files from the ZIP into the about:blank window
                                const cssFiles = [];
                                const jsFiles = [];
                                zip.forEach((relativePath, file) => {
                                    if (file.dir) return; // Ignore directories
                                    if (relativePath.endsWith('.css')) {
                                        cssFiles.push(file.async('string'));
                                    } else if (relativePath.endsWith('.js')) {
                                        jsFiles.push(file.async('string'));
                                    }
                                });

                                Promise.all(cssFiles.concat(jsFiles))
                                    .then(filesContent => {
                                        const styleContent = filesContent.filter(content => content.endsWith('.css')).join('\n');
                                        const scriptContent = filesContent.filter(content => content.endsWith('.js')).join('\n');

                                        const head = aboutBlankWindow.document.head;
                                        if (styleContent) {
                                            const style = aboutBlankWindow.document.createElement('style');
                                            style.textContent = styleContent;
                                            head.appendChild(style);
                                        }
                                        if (scriptContent) {
                                            const script = aboutBlankWindow.document.createElement('script');
                                            script.textContent = scriptContent;
                                            head.appendChild(script);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error reading CSS or JavaScript files from ZIP:', error);
                                    });
                            })
                            .catch(error => {
                                console.error('Error reading HTML file from ZIP:', error);
                            });
                    } else {
                        console.error(`File '${pageName}' not found in ZIP.`);
                    }
                })
                .catch(error => {
                    console.error('Error unzipping ZIP:', error);
                });
        })
        .catch(error => {
            console.error('Error downloading the zip file:', error);
        });
}

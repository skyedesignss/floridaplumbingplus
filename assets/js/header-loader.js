fetch('components/header.html')
    .then(response => {
        console.log('Header Status:', response.status);
        return response.text();
    })
    .then(data => {
        console.log('Header Loaded');
        document.getElementById('header-container').innerHTML = data;

        document.dispatchEvent(
            new CustomEvent('headerLoaded')
        );
    })
    .catch(error => {
        console.error('HEADER ERROR:', error);
    });
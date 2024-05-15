document.addEventListener('DOMContentLoaded', function() {
    // Check if cookies are set
    if (!getCookie('username') || !getCookie('password')) {
        document.getElementById('overlay').style.display = 'flex';
    }

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        fetch('http://127.0.0.1:5500/auth.json')
            .then(response => response.json())
            .then(users => {
                var validUser = users.find(user => user.username === username && user.password === password);

                if (validUser) {
                    addCookie(username, password);
                    document.getElementById('overlay').style.display = 'none';
                    // Optionally, reload the page or navigate to a different page
                } else {
                    alert('Invalid credentials');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('closeButton').addEventListener('click', function() {
        window.location.href = 'auth.html';
    });
});

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function addCookie(username, password) {
    var date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // Cookie expires in 7 days
    var expires = "expires=" + date.toUTCString();
    document.cookie = "username=" + username + ";" + expires + ";path=/";
    document.cookie = "password=" + password + ";" + expires + ";path=/";
}

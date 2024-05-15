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
                window.location.href = 'basic/index.html';
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => console.error('Error:', error));
});

function addCookie(username, password) {
    var date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // Cookie expires in 7 days
    var expires = "expires=" + date.toUTCString();
    document.cookie = "username=" + username + ";" + expires + ";path=/";
    document.cookie = "password=" + password + ";" + expires + ";path=/";
}

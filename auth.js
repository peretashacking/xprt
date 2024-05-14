document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('auth.json')
        .then(response => response.json())
        .then(users => {
            var validUser = users.find(user => user.username === username && user.password === password);

            if (validUser) {
                window.location.href = 'basic/index.html';
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => console.error('Error:', error));
});
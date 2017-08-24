console.log('login');

var myProtocol = location.protocol;
var myPort     = location.port;
var myBaseURL  = location.hostname;
var whereAmI   = myProtocol + myPort + '//' + myBaseURL;

var login_submit = document.getElementById('login_submit');
login_submit.onclick = function() {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if(request.readyState == XMLHttpRequest.DONE) {
      if(request.status == 200) {
        console.log('User logged in');
        alert('Logged in successfully');
      } else if(request.status == 403) {
        alert('Invaid credentials');
      } else if(request.status == 500) {
        alert('Something brokedown behind the scenes.');
      }
    }
  };

  var login_username = document.getElementById('login_username').value;
  var login_password = document.getElementById('login_password').value;
  // THIS LINE EXPOSES THE RAW PASSWORD console.log(login_username + '  ' + login_password);
  request.open('POST', whereAmI + '/login', true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send(JSON.stringify({username: login_username, password: login_password}));
};


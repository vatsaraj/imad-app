var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/aloha.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'aloha.png'));
});

app.get('/ui/pittedpaper.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pittedpaper.png'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'favicon.ico'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/frog_right.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'frog_right.png'));
});

app.get('/ui/frog_left.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'frog_left.png'));
});

app.get('/ui/face1.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'face1.png'));
});

app.get('/ui/face2.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'face2.png'));
});

app.get('/ui/snowman.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'snowman.png'));
});

var counter = 0;
app.get('/counter', function(req, res) {
  counter = counter+1;
  res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) {
  var name = req.query.name

  names.push(name);

  res.send(JSON.stringify(names));
});

var articles = {
  article1: {
    title:   'Article One | Vatsaraj',
    heading: 'Article 1',
    content: `
      <p>
        This is a test page to see how multiple lines of text are rendered in a browser
        running on a desktop/laptop and a mobile device like a smart phone or a tablet.
      </p>

      <div class="cosmo text-color">
        <p>
          Listed below are the names of a few countries.
        </p>
        <hr>
        <p>
          Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy
        </p>
        <hr>
        <p>
          Macau, Macedonia, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique
        </p>
        <hr>
        <p>
          Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, San Marino, Sao Tome and Principe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Sint Maarten, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Swaziland, Sweden, Switzerland, Syria
        </p>
        <hr>
        <p>
          Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana
        </p>
        <hr>
        <p>
          East Timor, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Ethiopia
        </p>
        <hr>
      </div>
      `
  },
  article2: {
    title:   'Article Two | Vatsaraj',
    heading: 'Article 2',
    content: `
      <p>
        This page exists to test URL based redirection.
      </p>

      <div class="cosmo text-color">
        <p>
          A few CentOS Linux systems administration notes for you to chew on.
        </p>
        <hr>
        <p>
          Here's one way to prevent users from invoking 'su -' and at the same time
          enabling them to use sudo.
        </p>
        <p>
          Edit /etc/pam.d/su . Near the top of the file, right after
          the line 'auth sufficient pam_rootok.so' , add this line
        </p>
        <p class="sysadmin-text">
            &nbsp;&nbsp;&nbsp;&nbsp; auth        requisite   pam_deny.so
        </p>
        <p>
          Edit the /etc/sudoers file (typically using visudo).
          After this line
        </p>
        <p class="sysadmin-text">
          &nbsp;&nbsp;&nbsp;&nbsp; root    ALL=(ALL)   ALL
        </p>
        <p>
          Add entries for either individual users or for a group <br>
          eg.
        </p>
        <p class="sysadmin-text">
          &nbsp;&nbsp;&nbsp;&nbsp; me      ALL=(ALL)   ALL           <br>
          &nbsp;&nbsp;&nbsp;&nbsp; gabbar  ALL=(ALL) NOPASSWD:  ALL  <br>
          &nbsp;&nbsp;&nbsp;&nbsp; %cansudo  ALL=(ALL)   ALL         <br>
        </p>
          (if the above does not apply for all users, then)          <br>
        <p class="sysadmin-text">
          &nbsp;&nbsp;&nbsp;&nbsp; ALL ALL=(ALL) ALL
        </p>
        <p>
          To enable logging, add the following lines, if they don't exist already.
        </p>
        <p class="sysadmin-text">
          &nbsp;&nbsp;&nbsp;&nbsp; Defaults iolog_dir=/var/log/sudo/sudo-io/%{user}  <br>
          &nbsp;&nbsp;&nbsp;&nbsp; ...                                               <br>
          &nbsp;&nbsp;&nbsp;&nbsp; ...                                               <br><br>
          &nbsp;&nbsp;&nbsp;&nbsp; %cansudo      ALL=(ALL) LOG_INPUT: LOG_OUTPUT:   ALL
        </p>
        <p>
          Save and exit visudo.
        </p>
        <hr>
      </div>
    `
  },
  article3: {
    title:   'Article Three | Vatsaraj',
    heading: 'Article 3',
    content: 'Aha.. gotcha... There\'s no such article as Article3. (heh heh heh...)'
  }
};  // End 'articles'

function createHtmlTemplate(data) {
  var title   = data.title;
  var heading = data.heading;
  var content = data.content;

  var htmlTemplate = `
    <html>
      <head>
        <title>
          ${title}
        </title>
        <meta content='width=device-width, initial-scale=1' name='viewport'/>
        <link href="ui/style.css" rel="stylesheet">
      </head>
      <body>
        <div>
          <a href="/">HOME</a>
        </div>
        <div>
          <h3>${heading}</h3>
        </div>

        ${content}

      </body>
    </html>`;

  return htmlTemplate;
}
  

app.get('/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  res.send(createHtmlTemplate(articles[articleName]));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

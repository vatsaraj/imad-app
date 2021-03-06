var express    = require('express');
var morgan     = require('morgan');
var path       = require('path');
var Pool       = require('pg').Pool;
var crypto     = require('crypto');
var bodyParser = require('body-parser'); // This tells the EXPRESS framework that
                                         // if there is JSON data received, it will
                                         // be placed inside 'req.body'.
var session    = require('express-session'); // Use the EXPRESS SESSION framework to
                                             // manage user sessions.

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
  secret: 'top-secret-encryption-string', // This random string will be used to encrypt cookies.
  cookie: { maxAge: 1000 * 60 * 60 }, // cookie lifetime in milliseconds.
  resave: true,
  saveUninitialized: true
}));

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

app.get('/login.html', function(req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.get('/ui/login.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.js'));
});

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

var counter = 0;
app.get('/counter', function(req, res) {
  counter = counter+1;
  res.send(counter.toString());
});

var config = {
  user:     process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  password: process.env.DB_PASSWORD
};

function makeHashBrowns(password) {

  var algo   = 'pbkdf2';    // Name of the encryption method used to generate a hash.
  var salt   = '76aee9a464f1dd0381925a7c4cd8d080eb16601f16220aab87a12dafd57aa1c89cf62a0d6284f4d856d88b90aa82b7117ec14dd7431a621b137d163661266dd1';  // The salt to be added to the password hasing process.
  var iters  = 10000;      // How many times the hashing function is to be run - more the merrier.
  var keylen = 512;       // Derived key length.
  var digest = 'sha512';  // Name of the digest algorithm to be used to generate the hash.

  var hashed = crypto.pbkdf2Sync(password, salt, iters, keylen, digest);

  return [algo, iters, salt, hashed.toString('hex')].join('$');

}

app.get('/hash/:input', function(req, res) {
  var hashedString = makeHashBrowns(req.params.input);
  res.send(hashedString);
});

function printThreadPage(content) {
  var output = '';
  var bonda = '';

  for(var ixx in content) {
    bonda = content[ixx].topic;
    output += '<b><a href=\"' + bonda + '\">' + bonda + '</a><hr>';
  }

  var nineYards = {
    title   : 'FORUM',
    heading : 'CONVERSATIONS',
    content : output
  };

  return createHtmlTemplate(nineYards);
}

var pool = new Pool(config);

app.get('/check-login', function(req, res) {
  if(req.session && req.session.auth && req.session.auth.userId) {
    res.send('You are logged in as ' + req.session.auth.userId.toString());
  } else {
    res.send('You are NOT logged in.');
  }
});

app.get('/logout', function(req, res) {
  delete req.session.auth;
  res.send('You are logged out.');
});


app.get('/chat', function(req, res) {
  pool.query('select * from threadz order by threadid', function(err, result) {
    if(err) {
      res.status(500).send(err.toString());
    } else {
      if(result.rows.length === 0) {
        res.status(404).send('Chat forum not found.');
      } else {
        res.send(printThreadPage(result.rows));
      }
    }
  });
});

function printChatter(title, heading, content) {
  var ooh = '';

  for(var line in content) {
    ooh += '<div><h5><b>' + content[line].date.toLocaleString() + '</b></h5></div>' + '<b><i>' + content[line].user + '</i>: </b>' + content[line].text + '<hr>';
  }

  var nineYards = {
    title   : title,
    heading : '<a href=\"/chat\">Chat</a> forum<hr>',
    content : ooh
  };

  return createHtmlTemplate(nineYards);
}

app.get('/:chatName', function(req, res) { 
  // chatName contains the name of the 'topic' in the table 'threadz'.
  // Identify the threadid from the 'topic'.
  // Access all the chats from the table 'chatz' connected with that threadid.

  var htmlLeafPage  = req.params.chatName;

  // Identify the thread id which is an unique id for each chat thread.
  pool.query('select threadid from threadz where topic = \'' + htmlLeafPage + '\'', function(err, result) {
    if(err) {
      res.status(500).send(err.toString());
    } else {
      if(result.rows.length === 0) {
        var nineYards = {
          title   : htmlLeafPage,
          heading : '<a href=\"/chat\">Chat</a> forum<hr>',
          content : '<h2>No such conversation found.</h2>'
        };
        res.status(404).send(createHtmlTemplate(nineYards));
      } else {

        // Locate all the conversations that are associated with this thread id.
        var whatsMyThread = result.rows[0].threadid;
        var queryString = 'select \"date\",\"user\",\"text" from chatz where \"threadid\" = ' + whatsMyThread + ' order by chatid';
        pool.query(queryString, function(err, result) {
        if(err) {
          res.status(500).send(err.toString());
        } else {
          if(result.rows.length === 0) {
            var nineYards = {
              title   : htmlLeafPage,
              heading : '<a href=\"/chat\">Chat</a> forum<hr>',
              content : '<h3>Looks like you\'ve stumbled into an empty chat area.<br>Care to be the first one to add your thoughts?</h3>'
            };
            res.status(200).send(createHtmlTemplate(nineYards));
          } else {
            res.status(200).send(printChatter(htmlLeafPage, '', result.rows));
          }
        }
      });
      }
    }
  }); // pool.query('select threadid...
});

app.post('/create-user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var hashed  = makeHashBrowns(password);

  pool.query('insert into "user" (username, password) values($1, $2)', [username, hashed], function(err, result) {
    if(err) {
      res.status(500).send(err.toString());
    } else {
      res.send('User ' + username + ' successfully created');
    }
  });
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  pool.query('select * from "user" where username = $1',[username], function(err, result) {
    if(err) {
      res.status(500).send(err.toString());
    } else {
      if(result.rows.length === 0) {
        res.status(403).send('username/password incorrect');
      } else {
        // Match the passwords.
        var dbString    = result.rows[0].password;
        var veryifyPass = makeHashBrowns(password);

        if(veryifyPass === dbString) {
          // Set the session.
          req.session.auth = {userId: result.rows[0].id};

          // User credentials are good.
          res.status(200).send('credentials accepted');
        } else {
          // Invalid credentials.
          res.status(403).send('credentials incorrect');
        }
      }
    }
  });
});



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});


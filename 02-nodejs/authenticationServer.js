const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

const isUsernameTaken = (username) => {
  return users.some(user => user.username === username);
};

const findUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

app.post('/signup', (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  
  if (isUsernameTaken(username)) {
    res.status(400).send('Username already exists');
  } else {
    const id = users.length + 1;
    const newUser = {
      id,
      username,
      password,
      firstName,
      lastName
    };
    users.push(newUser);
    res.status(201).send('User created');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username, password);

  if (user) {
    const token = generateAuthToken();

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      token
    });

  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/data', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const user = findUser(username, password);

  if (user) {
    const userData = users.map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName
    }));

    res.status(200).json({
      users: userData
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


function generateAuthToken() {
  return 'vyasa-auth-token';
}

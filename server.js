const express = require('express');
const path = require('path');
let isLogged = false;

const app = express();

app.use(express.static(path.join(__dirname, '/public'))); //ASK: where should this be?

app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

/* Specific endpoints */
app.use('/user', (req, res, next) => {
  if(isLogged) next();
  else res.show('forbidden.html');
});
//ASK: why photo doesnt show in /user/panel and ../settings

app.get('/', (req, res) => {
  res.show('home.html');
});

app.get('/home', (req, res) => {
  res.show('home.html');
});

app.get('/about', (req, res) => {
  res.show('about.html');
});

app.use('/user/panel', (req, res) => {
  res.show('forbidden.html');
});

app.use('/user/settings', (req, res) => {
  res.show('forbidden.html');
});

app.use((req, res) => {
  //or res.status(404).send('404 not found...');
  res.status(404).show('404.html');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

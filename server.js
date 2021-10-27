const express = require('express');
const path = require('path');
let isLogged = false;

const app = express();

app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

app.use(express.static(path.join(__dirname, '/public')));


/* Specific endpoints */
app.use('/user', (req, res, next) => {
  if(isLogged) next();
  else res.show('forbidden.html');
});
//ASK MENTOR why photo doesnt show in /user/panel and ../settings

app.get('/', (req, res) => {
  res.show('index.html');
});

app.get('/about', (req, res) => {
  res.show('about.html');
});

app.get('/contact', (req, res) => {
  res.show('contact.html');
});

app.get('/info', (req, res) => {
  res.show('info.html');
});

app.get('/history', (req, res) => {
  res.show('history.html');
});

app.use((req, res) => {
  // res.status(404).send('404 not found...');
  res.status(404).show('404.html');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

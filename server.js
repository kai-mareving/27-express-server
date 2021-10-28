const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const app = express();
app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));

/* Specific endpoints */
let isLogged = false;

app.use('/user*', (req, res, next) => {
  if(isLogged) next();
  else res.render('forbidden', { layout: false });
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

app.get(['/', '/home'], (req, res) => {
  res.render('home', { layout: false });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: false });
});

app.use((req, res) => {
  //or res.status(404).send('404 not found...');
  res.status(404).render('404', { layout: false });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

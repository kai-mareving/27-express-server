const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer  = require('multer');
let isLogged = false;

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/data/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage: fileStorageEngine });

const app = express();
app.engine('.hbs', hbs());
//or app.engine('.hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false })); //ASK: is this still needed?
//// app.use(express.json());

/* Specific endpoints */
app.use('/user*', (req, res, next) => {
  if(isLogged) next();
  else res.render('forbidden');
});


app.get(['/', '/home'], (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.get('/contact', (req, res) => {
  res.render('contact', { layout: 'dark' });
});

app.post('/contact/send-message', upload.single('file'), (req, res) => {
  const { author, sender, title, message } = req.body;

  if (author && sender && title && message && req.file) {
    res.render('contact', { layout: 'dark', isSent: true, file: req.file.originalname });
  } else {
    res.render('contact', { layout: 'dark', isError: true });
  }
});

app.use((req, res) => {
  //or res.status(404).send('404 not found...');
  res.status(404).render('404');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

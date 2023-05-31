const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();

const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

// let abc = {abc: "abc"}; abc.abc
// ({abc: "abc"}).abc
// ({abc: "abc"})["abc"]
// let abc = {'abc': "abc"}; abc.abc
// ({'abc': "abc"}).abc
// ({'abc': "abc"})["abc"]

// Object.defineProperty( abc , 'xxx', {
//   value: "xxx",
//   enumerable: false
// });

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      // METHOD 1 express convert the array to an object adding app.settings, a _locals property, and a cache property, which are iterable!... (indexes are mapped to keys)
      // res.render('beers', beersFromApi); // then {{#each this}} in views
      // console.log("-- app.settings")
      // console.log(app.settings)
      // console.log("-- app._locals")
      // console.log(app._locals) // returns undefined
      // console.log("-- app.cache")
      // console.log(app.cache) // returns {}
      // METHOD 2
      res.render('beers', { beers: beersFromApi }); // then {{#each beers}} in views
    })
    .catch(error => console.log(error));
});

app.get('/beers/:id', (req, res) => {
  punkAPI
    .getBeer(req.params.id.split('-')[1])
    .then(beerFromApi => {
      res.render('beer', beerFromApi[0]);
    })
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(beerRandomFromApi => {
      res.render('random-beer', beerRandomFromApi[0]);
    })
    .catch(error => console.log(error));
});

const port = 3002
app.listen(port, () => console.log(`🏃‍ on port ${port}: http://localhost:${port}/ or http://127.0.0.1:${port}`));

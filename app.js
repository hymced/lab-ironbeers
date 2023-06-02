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
      // [
      //   {
      //     id: 1,
      //     name: 'xx',
      //     tagline: 'xx',
      //     description: 'xx',
      //     ...
      //   },
      //   ...
      // ]
      // METHOD 1 express convert the array to an object adding app.settings, a _locals property, and a cache property, which are iterable!... (array indexes are mapped to keys)
      // {
      //   '0': {
      //     id: 1,
      //     name: 'xx',
      //     tagline: 'xx',
      //     description: 'xx',
      //     ...
      //   },
      //   '1': {
      //     id: 2,
      //     name: 'xx',
      //     tagline: 'xx',
      //     description: 'xx',
      //     ...
      //   },
      //   ...,
      //   settings: {
      //     'x-powered-by': true,
      //     etag: 'weak',
      //     'etag fn': [Function: generateETag],
      //     env: 'development',
      //     'query parser': 'extended',
      //     'query parser fn': [Function: parseExtendedQueryString],
      //     'subdomain offset': 2,
      //     'trust proxy': false,
      //     'trust proxy fn': [Function: trustNone],
      //     view: [Function: View],
      //     views: 'C:\\Users\\Ced\\IRONHACK\\ironhack-labs\\lab-ironbeers\\views',
      //     'jsonp callback name': 'callback',
      //     'view engine': 'hbs'
      //   },
      //   _locals: [Object: null prototype] {},
      //   cache: false
      // }
      //
      // res.render('beers', beersFromApi); // then {{#each this}} in views
      // console.log("-- app.settings")
      // console.log(app.settings)
      // console.log("-- app._locals")
      // console.log(app._locals) // returns undefined
      // console.log("-- app.cache")
      // console.log(app.cache) // returns {}
      // METHOD 2
      res.render('beers', { beers: beersFromApi }); // then {{#each beers}} in views NOT {{#each this}} which will also have the extra properties!
    })
    .catch(error => console.log(error));
});

// app.get('/beers/:id', (req, res) => {
//   punkAPI
//     .getBeer(req.params.id.split('-')[1])
//     .then(beerFromApi => {
//       res.render('beer', beerFromApi[0]);
//     })
//     .catch(error => console.log(error));
// });
app.get('/beers/beer-:beerId', (req, res) => {
  punkAPI
    .getBeer(req.params.beerId)
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

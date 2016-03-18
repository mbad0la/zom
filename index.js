#!/usr/bin/env node

const fetch = require('node-fetch');

const key = '17c5c4c6e845e73f4296fa83b502b87c';

const keyword = process.argv.splice(2).join(' ') || 'Big Yellow Door';

const extractRestaurants = e => new Promise((resolve, reject) => resolve(e.restaurants.map(e => e.restaurant)));

const printRestaurants = r => r.map(e => console.log(e)); 

const stars = rating => "⭐️ ".repeat(parseInt(rating));

const makeHumanReadable = restaurants => new Promise((resolve, reject) => {
  resolve(restaurants.map(e => (
    `${e.name} (${e.user_rating && (stars(e.user_rating.aggregate_rating) + " " + (e.user_rating.aggregate_rating) + " " + e.user_rating.rating_text)})
    🕸  ${e.url}
    🗺A ${e.location.address}
    🍕  ${e.cuisines}
    💸  ${e.currency} ${e.average_cost_for_two} for 2
    `)));
});

fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=delhi&q=${keyword}`, {
  method: 'get',
  headers: { 'user-key': key, 'Accept': 'application/json', },
})
.then(e => e.json())
.then(extractRestaurants)
.then(makeHumanReadable)
.then(printRestaurants)
.catch(e => console.log(e));

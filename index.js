#!/usr/bin/env node

const fetch = require('node-fetch');

const key = '17c5c4c6e845e73f4296fa83b502b87c';

const args = (process.argv.splice(2).join(' ') || 'Big Yellow Door@Delhi').split('@');

if (args.length == 1) {
  args.splice(1, 0, 'Delhi');
} else if (args.length == 2) {
  if (args[0] === '' || args[1] === '') {
    console.log('Usage: zom <keyword>[@<location>]');
    return;
  }
} else {
  console.log('Usage: zom <keyword>[@<location>]');
  return;
}

const { location, keyword } = { location: args[1], keyword: args[0] };

const extractLocationData = e => new Promise((resolve, reject) => {
  let locationData = e.location_suggestions[0] || { entity_id: 1, entity_type: 'city' }

  resolve(locationData);
});

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

fetch(`https://developers.zomato.com/api/v2.1/locations?query=${location}`, {
  method: 'get',
  headers: { 'user-key': key, 'Accept': 'application/json', },
})
.then(e => e.json())
.then(extractLocationData)
.then(({ entity_id, entity_type }) => fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=${entity_id}&entity_type=${entity_type}&q=${keyword}`, {
  method: 'get',
  headers: { 'user-key': key, 'Accept': 'application/json', },
}))
.then(e => e.json())
.then(extractRestaurants)
.then(makeHumanReadable)
.then(printRestaurants)
.catch(e => console.log(e));

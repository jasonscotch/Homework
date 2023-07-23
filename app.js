// PART ONE

// Number 1
let url = "http://numbersapi.com/";
let num1 = 42;

axios.get(url + num1 + "?json")
    .then(res => {
        console.log(res.data)
    })
    .catch(err => console.log("rejected...", err))

// Number 2
let nums = [5,7,9,42];

axios.get(url + nums + "?json")
    .then(res => {
        console.log(res.data)
    })
    .catch(err => console.log("rejected...", err))

// Number 3
let fourFacts = [];

for (let i = 1; i < 5; i++) {
    fourFacts.push(
        axios.get(url + num1 + "?json")
    );
}

Promise.all(fourFacts)
.then(factArr => {
    for (const res of factArr) {
        $("#part_2").append(`<p>${res.data.text}</p>`);
        }
    })
    .catch(err => console.log(err))  


    
// PART TWO 

// Number 1
let url2 = "https://deckofcardsapi.com/api/deck"

axios.get(url2 + "/new/draw/?count=1")
    .then(res => {
        let suit = res.data.cards[0].suit;
        let value = res.data.cards[0].value;
        console.log(`${value} of ${suit}`)
    });

// Number 2
axios.get(url2 + "/new/draw/?count=2")
    .then(res => {
        let suit = res.data.cards[0].suit;
        let value = res.data.cards[0].value;
        console.log(`${value} of ${suit}`)
    });


// Number 3
let deckId = null;
let $btn = $('button');
let $cards = $('#cards'); 

axios.get(url2 + "/new/shuffle")
    .then(res => {
        // console.log(res)
        deckId = res.data.deck_id;
        $btn.show()
    });

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

$btn.on('click', function() {
    $.getJSON(`${url2}/${deckId}/draw/`).then(data => {
        let cardSrc = data.cards[0].image;
        
        let randomRotation = `rotate(${getRandom(-10, 10)}deg)`;
        let randomOffsetX = `${getRandom(-10, 10)}px`;
        let randomOffsetY = `${getRandom(-10, 10)}px`;
        
        $cards.append(
            $('<img>', {
                src: cardSrc,
                style: `transform: ${randomRotation} translate(${randomOffsetX}, ${randomOffsetY});`
            })
        );
        
        if (data.remaining === 0) $btn.off('click');
    });
});


// FURTHER STUDY
// Number 1
let url3 = "https://pokeapi.co/api/v2/"

axios.get(url3 + "pokemon?limit=1000&offset=0")
    .then(res => {
        console.log(res.data.results)
    });


// Number 2
function getRandom(min, max) {
    return Math.ceil(Math.random() * (max - min)) + min;
}

axios.get(url3 + "pokemon?limit=1000&offset=0")
    .then(res => {
        let total = res.data.results.length;
        let pokemonUrls = [];
        for (let i = 0; i < 3; i++) {
            let randId = getRandom(1,total);
            let url = res.data.results.splice(randId, 1)[0].url;
            pokemonUrls.push(url);
        }
        return Promise.all(pokemonUrls.map(url => $.getJSON(url)));
    })
    .then(pokemon => {
      pokemon.forEach(res => console.log(res));
    });

// Number 3
axios.get(url3 + "pokemon?limit=1000&offset=0")
    .then(res => {
        let total = res.data.results.length;
        let pokemonUrls = [];
        for (let i = 0; i < 3; i++) {
            let randId = getRandom(1,total);
            let url = res.data.results.splice(randId, 1)[0].url;
            pokemonUrls.push(url);
        }
        return Promise.all(pokemonUrls.map(url => $.getJSON(url)));
    })
    .then(data => {
        names = data.map(d => d.name);
        return Promise.all(data.map(d => $.getJSON(d.species.url)))
      })
      .then(data => {
        let descs = data.map(d => {
          let descriptionObj = d.flavor_text_entries.find(
            entry => entry.language.name === "en"
          );
          return descriptionObj ? descriptionObj.flavor_text : "No description available, sorry!"; 
        });
        descs.forEach((desc, i) => {
          console.log(`${names[i]}: ${desc}`);
        });
      });
  
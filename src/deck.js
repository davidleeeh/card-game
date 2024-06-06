const { Suits, Ranks } = require("./gameConfigs");

function createDeck(deckCount = 1) {
    var cards = [];
    for (let i = 0; i < deckCount; i++) {
        for (let suit of Object.values(Suits)) {
            for (let rank of Object.values(Ranks)) {
                cards.push({ rank, suit });
            }
        }
    }

    function shuffle() {
        let right = cards.length;
        while (right > 0) {
            const left = Math.floor(Math.random() * right);
            right--;
            [cards[left], cards[right]] = [cards[right], cards[left]];
        }
    }

    function draw() {
        return cards.pop();
    }

    function getCount() {
        return cards.length;
    }

    return {
        draw,
        shuffle,
        getCount
    };
}

module.exports = { createDeck };

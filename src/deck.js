const { Suits, Ranks } = require("./config")

class Deck {
    constructor(deckCount = 1) {
        this.cards = [];
        for (let i = 0; i < deckCount; i++) {
            for (let suit of Object.values(Suits)) {
                for (let rank of Object.values(Ranks)) {
                    this.cards.push({ rank, suit });
                    //this.cards.push({ rank: Ranks.SEVEN, suit: Suits.HEART })
                }
            }
        }
    }

    shuffle() {
        let right = this.cards.length;
        while (right > 0) {
            const left = Math.floor(Math.random() * right);
            right--;
            [this.cards[left], this.cards[right]] = [this.cards[right], this.cards[left]];
        }
    }

    draw() {
        return this.cards.pop();
    }

    getCount() {
        return this.cards.length;
    }
}

module.exports = Deck

/* eslint-disable no-undef */
const { Suits, Ranks } = require("./config");
const Deck = require("./deck");

function createGame() {
    var players = [];
    var deck = new Deck();
    var isOver = false;
    var currentRound = new Map();
    var rounds = [];

    deck.shuffle();

    function addPlayer(playerName) {
        if (players.includes(playerName)) {
            throw new Error(`name has already been added.`);
        }

        players.push(playerName);
    }

    function validatePlayerAction(playerName) {
        if (players.includes(playerName) === false) {
            throw new Error(`${playerName} does not exist`);
        }

        if (currentRound.has(playerName)) {
            throw Error(`${playerName} has already drawn a card`);
        }
    }

    function checkGameStatus() {
        if (currentRound.size === players.length) {
            rounds.push(currentRound);
            currentRound = new Map();

            if (deck.cards.length < players.length) {
                isOver = true;
            }
        }
    }

    function draw(playerName) {
        if (isOver) {
            return;
        }

        validatePlayerAction(playerName);

        const card = deck.draw();
        currentRound.set(playerName, card);

        print();
        checkGameStatus();
    }

    function skip(playerName) {
        if (isOver) {
            return;
        }

        validatePlayerAction(playerName);

        currentRound.set(playerName, null);

        print();

        checkGameStatus();
    }

    function compareHands(hand1, hand2) {
        const card1 = hand1.card;
        const card2 = hand2.card;

        if (card1 === null && card2 === null) {
            return 0;
        } else if (card1 === null && card2 !== null) {
            return 1;
        } else if (card1 !== null && card2 === null) {
            return -1;
        }

        const { rank: rank1, suit: suit1 } = card1;
        const { rank: rank2, suit: suit2 } = card2;

        if (rank1.val < rank2.val) {
            return 1;
        } else if (rank1.val > rank2.val) {
            return -1;
        } else if (suit1.val < suit2.val) {
            return 1;
        } else if (suit1.val > suit2.val) {
            return -1;
        } else {
            return 0;
        }
    }

    function compareResults(result1, result2) {
        return result2.score - result1.score;
    }

    function getGameResult() {
        const scores = new Map();

        players.forEach((p) => {
            scores.set(p, 0);
        });

        rounds.forEach((round) => {
            console.log(round);
            const hands = Array.from(round.entries())
                .map(([player, card]) => {
                    return { player, card };
                })
                .sort(compareHands);
            console.log("Sorted hands: ", hands);

            const winners = [];
            if (hands[0].card !== null) {
                winners.push(hands[0].player);

                for (let i = 1; i < hands.length; i++) {
                    if (
                        hands[i].card !== null &&
                        hands[i].card.rank == hands[0].card.rank &&
                        hands[i].card.suit == hands[0].card.suit
                    ) {
                        winners.push(hands[i].player);
                    }
                }

                for (let name of winners) {
                    scores.set(name, scores.get(name) + 1);
                }
            }

            console.log(`Winners: ${winners}`);
            console.log("Scores: ", scores);
        });

        const results = Array.from(scores.entries())
            .map(([player, score]) => {
                return { player, score };
            })
            .sort(compareResults);
        return results;
    }

    function print() {
        console.log(
            `==== Round ${rounds.length + 1}: ${deck.getCount()} cards left ====`
        );
        for (let [player, card] of Array.from(currentRound.entries())) {
            const cardDisplay = card === null ? "skipped" : cardStr(card);
            console.log(`${player}: ${cardDisplay}`);
        }
        console.log("");
    }

    function cardStr(card) {
        const { suit, rank } = card;
        return `${suit.label}-${rank.label}`;
    }

    function isGameOver() {
        return isOver;
    }

    return {
        addPlayer,
        draw,
        skip,
        print,
        isGameOver,
        getGameResult
    };
}

module.exports = { createGame };

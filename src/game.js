/* eslint-disable no-undef */
const { createDeck } = require("./deck");

function createGame(deckCount = 1) {
    // Maps player name to the state of the corresponding player state.
    // Each player state is an object like the one below:
    // {
    //    player: "Player1",
    //    history: [],
    //    score: 0
    // }
    //
    // The history atrribute is an array containing the card drawn by the user in each round.
    var playerStates = new Map();

    var deck = createDeck(deckCount);
    var isOver = false;
    var currentRound = 0;
    var callsInCurrentRound = 0;

    deck.shuffle();

    return {
        addPlayer,
        draw,
        skip,
        getHandsInRound,
        getWinnersInRound,
        isGameOver,
        getCurrentRound,
        getPlayerScores,
        getCardCount
    };

    function addPlayer(playerName) {
        if (playerStates.has(playerName)) {
            throw new Error(`name has already been added.`);
        }

        playerStates.set(playerName, {
            player: playerName,
            history: [],
            score: 0
        });
    }

    function validatePlayerAction(playerName) {
        if (playerStates.has(playerName) === false) {
            throw new Error(`${playerName} does not exist`);
        }

        if (currentRound < playerStates.get(playerName).history.length) {
            throw Error(`${playerName} has already drawn a card`);
        }
    }

    function updateGameStates() {
        if (callsInCurrentRound === playerStates.size) {
            const winners = getWinnersInRound(currentRound);

            for (let name of winners) {
                const prevState = playerStates.get(name);
                playerStates.set(name, {
                    ...prevState,
                    score: prevState.score + 1
                });
            }

            currentRound += 1;
            callsInCurrentRound = 0;

            if (deck.getCount() < playerStates.size) {
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
        playerStates.get(playerName).history.push(card);
        callsInCurrentRound += 1;

        updateGameStates();

        return card;
    }

    function skip(playerName) {
        if (isOver) {
            return;
        }

        validatePlayerAction(playerName);

        playerStates.get(playerName).history.push(null);
        callsInCurrentRound += 1;

        updateGameStates();
    }

    function compareCards(card1, card2) {
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

    function getHandsInRound(round) {
        const entries = Array.from(playerStates.values());
        return entries
            .filter((entry) => {
                return entry.history.length > round;
            })
            .map((entry) => {
                const { player, history } = entry;
                return {
                    player,
                    card: history[round]
                };
            });
    }

    function getWinnersInRound(round) {
        // Simply return empty array if current round is not finished yet
        if (round === currentRound && callsInCurrentRound < playerStates.size) {
            return [];
        }

        const allHands = getHandsInRound(round);

        const nonEmptyHands = allHands
            .filter((hand) => hand.card !== null)
            .sort((hand1, hand2) => {
                return compareCards(hand1.card, hand2.card);
            });

        if (nonEmptyHands.length > 0) {
            const bestHand = nonEmptyHands[0];

            return nonEmptyHands
                .filter((hand) => {
                    return compareCards(hand.card, bestHand.card) === 0;
                })
                .map((hand) => {
                    return hand.player;
                });
        } else {
            return [];
        }
    }

    function getPlayerScores() {
        return Array.from(playerStates.values()).map(({ player, score }) => {
            return { player, score };
        });
    }

    function getCardCount() {
        return deck.getCount();
    }

    function getCurrentRound() {
        return currentRound;
    }

    function isGameOver() {
        return isOver;
    }
}

module.exports = { createGame };

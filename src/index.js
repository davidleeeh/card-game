/* eslint-disable no-undef */
const { program } = require("commander");
const inquirer = require("inquirer");
const { createGame } = require("./game");

const DEFAULT_PLAYER_COUNT = 4;
const DEFAULT_DECK_COUNT = 1;
async function startGame({ playerCount, deckCount }) {
    playerCount = playerCount || DEFAULT_PLAYER_COUNT;
    deckCount = deckCount || DEFAULT_DECK_COUNT;

    console.log("===========================================");
    console.log(`Players: ${playerCount}`);
    console.log(`Decks: ${deckCount}`);
    console.log("===========================================");

    const game = createGame(deckCount);
    const players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(`player${i + 1}`);
    }

    for (let p of players) {
        game.addPlayer(p);
    }

    while (!game.isGameOver()) {
        const currentRound = game.getCurrentRound();

        console.log(
            `\n****** Round ${currentRound + 1} (${game.getCardCount()} cards remainning)`
        );
        for (let player of players) {
            const action = await promptForPlayerChoice(player);
            let card = null;

            if (action === "draw") {
                card = game.draw(player);
            } else {
                game.skip(player);
            }

            if (card) {
                const cardContent =
                    card === null
                        ? "skipped"
                        : `${card.rank.label}-${card.suit.label}`;

                console.log(`${cardContent}`);
            } else {
                console.log(`skipped`);
            }
        }

        const winners = game.getWinnersInRound(currentRound);
        const scores = game.getPlayerScores();
        console.log("\nWinners: ", winners);
        console.log("Scores: ", scores);

        if (game.isGameOver() === true) {
            break;
        }
    }

    const leaderboard = game.getPlayerScores().sort((a, b) => {
        return b.score - a.score;
    });

    console.log("\n\n===========================================");
    console.log("Game Result");
    console.log(leaderboard);
    console.log("===========================================");
}

async function promptForPlayerChoice(player) {
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "q1",
            message: `${player}'s turn. Draw a card or skip?`,
            choices: [
                { name: "Draw", value: "draw" },
                { name: "Skip", value: "skip" }
            ]
        }
    ]);

    return answer["q1"];
}

(function run() {
    program
        .name("card-game")
        .description("Some descriptions here")
        .option("--player-count <count>", "number of players")
        .option("--deck-count <count>", "number of decks to be used");

    program.parse(process.argv);
    const options = program.opts();

    startGame(options);
})();

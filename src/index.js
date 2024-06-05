const { createGame } = require("./game");

const game = createGame();
const players = [
    "player1",
    "player2",
    "player3",
    "player4",
]

for (let p of players) {
    game.addPlayer(p);
}

game.print();
while (true) {
    for (let p of players) {
        const skip = Math.floor(Math.random() * 10) % 4 === 0;
        //const skip = false;
        if (skip) {
            game.skip(p);
        } else {
            game.draw(p);
        }
    }

    if (game.isGameOver() === true) {
        break
    }
}

const results = game.getGameResult();
console.log(results);

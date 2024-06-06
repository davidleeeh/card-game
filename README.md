# Simpla Card Game

## Prerequisites

- Node (v18.15.0 used for development) 

- NPM - (v9.5.0 used for development)

## Usage

`npm run start -- [--player-count=<count>] [--deck-count=<count>]`

Options:

-   `player-count` - number of players to play the game. Default is 4.

-   `deck-count` - number of decks of cards to be used. Default is 1.

For example,

```
npm run start -- --player-count=5 --deck-count=2
```

## Assumptions

1. If all players skip, no one will score the round.

2. If there's a tie for the best cards drawn in a round, then all players with the best card will
   a point. For example,

```
player 1 - 10 Spade
player 2 - 6 Heart
player 3 - 10 Spade
player 4 - 9 Diamond
```


Then both player 1 and player 3 will score a point since they both drew the best card. This is
a possible scenario when more than one decks of cards are being used.

3. The game will be terminated if there's not enough cards remianing in the deck in the next round.

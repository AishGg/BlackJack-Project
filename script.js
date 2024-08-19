let deck, playerHand, dealerHand;

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    deck = [];

    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ rank, suit });
        });
    });

    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startNewGame() {
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    document.getElementById('result').textContent = '';
    updateHands();
    enableButtons();
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['Jack', 'Queen', 'King'].includes(card.rank)) {
            value += 10;
        } else if (card.rank === 'Ace') {
            aces += 1;
            value += 11;
        } else {
            value += parseInt(card.rank);
        }
    });

    while (value > 21 && aces) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

function updateHands() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    playerHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.textContent = `${card.rank} of ${card.suit}`;
        playerCardsDiv.appendChild(cardDiv);
    });

    dealerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        if (index === 0 && !document.getElementById('result').textContent) {
            cardDiv.textContent = 'Hidden';
        } else {
            cardDiv.textContent = `${card.rank} of ${card.suit}`;
        }
        dealerCardsDiv.appendChild(cardDiv);
    });

    document.getElementById('player-total').textContent = `Total value: ${calculateHandValue(playerHand)}`;
    if (document.getElementById('result').textContent) {
        document.getElementById('dealer-total').textContent = `Total value: ${calculateHandValue(dealerHand)}`;
    } else {
        document.getElementById('dealer-total').textContent = '';
    }
}

function hit() {
    playerHand.push(deck.pop());
    updateHands();

    if (calculateHandValue(playerHand) > 21) {
        document.getElementById('result').textContent = 'Player busts! Dealer wins.';
        disableButtons();
    }
}

function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }

    updateHands();

    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);

    if (dealerValue > 21) {
        document.getElementById('result').textContent = 'Dealer busts! Player wins.';
    } else if (dealerValue > playerValue) {
        document.getElementById('result').textContent = 'Dealer wins.';
    } else if (dealerValue < playerValue) {
        document.getElementById('result').textContent = 'Player wins.';
    } else {
        document.getElementById('result').textContent = 'It\'s a tie!';
    }

    disableButtons();
}

function enableButtons() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
}

function disableButtons() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
}

document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('new-game-button').addEventListener('click', startNewGame);

startNewGame();

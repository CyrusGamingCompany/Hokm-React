// let round = 0;
// let turn = 0; //0 mean south player, 1 mean east player, 2 mean north player, 3 mean west player
// let pitchSuit = ''; //Only Spades, Hearts, Diamonds, Clubs
// let playerHands = [[], [], [], []]; //0 mean south player, 1 mean east player, 2 mean north player, 3 mean west player
// let hakemHasDeclaredHokm = false;
// var hakem = undefined;
// var trumpSuit = undefined;

// var humanPlayedCardId = undefined;
// var team1_points = 0;
// var team2_points = 0;
// var fullGameHistory = [];
// var playedHands = [];
// var team1_totalPoints = 0;
// var team2_totalPoints = 0;
// const MAX_GAME_POINTS = 7;
// const PLAYERS_COUNT = 4;

// startBtn.addEventListener('click', startGame);

// async function startGame() {
//   clearScreen();
//   let shuffledDeck = getShuffledDeck();
//   hakem = await initHakemAsync(shuffledDeck);
//   while (team1_totalPoints < 7 && team2_totalPoints < 7) {
//     await playNextGame();
//   }

//   const jsonString = JSON.stringify(fullGameHistory);
//   // Save the JSON string to local storage
//   localStorage.setItem(`fullGameHistory_${getDate()}`, jsonString);
// }

// async function playNextGame() {
//   pitchSuit = '';
//   playerHands = [[], [], [], []];
//   humanPlayedCardId = undefined;
//   team1_points = 0;
//   team2_points = 0;
//   playedHands = [];
//   await sleep(1500);
//   clearScreen();

//   shuffledDeck = getShuffledDeck();
//   if (shuffledDeck.length < 52) {
//     throw new Error(`Error, shuffledDeck.length: ${shuffledDeck.length}`);
//   }

//   await dealCardsBetweenPlayersAsync(shuffledDeck, hakem, 5);

//   trumpSuit = await getHokmAsync();
//   await addHokmImageAsync(hakem, trumpSuit);

//   await dealCardsBetweenPlayersAsync(shuffledDeck, hakem, 4);
//   await dealCardsBetweenPlayersAsync(shuffledDeck, hakem, 4);

//   addClickEventToHumanPlayerCards();

//   if (hakem === playerNames[0]) {
//     alert('You Are Hakem, you should start');
//   } else {
//     alert('You Are not Hakem, other player should start');
//   }

//   const history = new gameHistory();
//   history.trumpSuit = trumpSuit;

//   while (!gameIsFinished()) {
//     pitchSuit = '';
//     let thisRoundInfo = new RoundInfo();
//     thisRoundInfo.roundNumber = round;
//     thisRoundInfo.starterPlayerIndex = turn;
//     humanPlayedCardId = undefined;
//     clearPitchCard();
//     for (let i = 0; i < playerNames.length; i++) {
//       //play round
//       addEffectToName(turn);
//       let playedCardId = await playHandAsync();

//       thisRoundInfo.playedCards[turn] = playedCardId;
//       await sleep(1);
//       removeEffectFromName(turn);
//       turn = (turn + 1) % PLAYERS_COUNT;
//     }
//     let winnerIndex = calculateHandWinner(thisRoundInfo, trumpSuit);
//     thisRoundInfo.winningPlayerIndex = winnerIndex;
//     if (winnerIndex === 0 || winnerIndex === 2) {
//       team1_points++;
//       document.getElementById(
//         'our-team',
//       ).innerHTML = `Our_Team: ${team1_points}`;
//     } else {
//       team2_points++;
//       document.getElementById(
//         'com-team',
//       ).innerHTML = `Computer_Team: ${team2_points}`;
//     }

//     thisRoundInfo.notPlayedCards = playerHands.map(hand => hand.slice());
//     history.add(thisRoundInfo);
//     await sleep(1);
//     turn = winnerIndex;
//     round++;
//   }

//   let winnerTeamIndex = team1_points > team2_points ? 1 : 2;
//   if (winnerTeamIndex == 1) {
//     team1_totalPoints++;
//     document.getElementById(
//       'ourTeam-totalPoints',
//     ).innerHTML = `Our Total Points: ${team1_totalPoints}`;

//     alert('Our Team Won');
//   } else if (winnerTeamIndex == 2) {
//     team2_totalPoints++;
//     document.getElementById(
//       'comTeam-totalPoints',
//     ).innerHTML = `COM Total Points: ${team2_totalPoints}`;
//     alert('Computer Team Won');
//   } else {
//     return Error("Error can't be a tie game");
//   }

//   if (
//     team1_totalPoints > MAX_GAME_POINTS ||
//     team2_totalPoints > MAX_GAME_POINTS
//   ) {
//     alert('Game is finished');

//     if (team1_totalPoints > team2_totalPoints) {
//       alert('Our Team Won Big 7');
//     } else if (team1_totalPoints < team2_totalPoints) {
//       alert('Computer Team Won Big 7');
//     } else {
//       throw new Error("Error can't be a tie game");
//     }
//   }

//   const newHakemIndex = findNextHakem(
//     playerNames.indexOf(hakem),
//     winnerTeamIndex,
//   );
//   hakem = playerNames[newHakemIndex];
//   turn = newHakemIndex;
//   alert(`Hakem is ${hakem}`);

//   fullGameHistory.push(history);
// }

// function getDate() {
//   const currentDate = new Date();

//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');

//   const formattedDate = `${year}-${month}-${day}`;

//   console.log(formattedDate);
//   return formattedDate;
// }

// function findNextHakem(hakemIndex, winnerTeamIndex) {
//   const hakemTeamIndex = getPlayerTeamIndexFromPlayerName(hakem);
//   if (hakemTeamIndex == winnerTeamIndex) return hakemIndex;

//   return (hakemIndex + 1) % 4;
// }

// function getPlayerTeamIndexFromPlayerName(playerName) {
//   if (playerName === playerNames[0] || playerName === playerNames[2]) {
//     return 1;
//   } else if (playerName === playerNames[1] || playerName === playerNames[3]) {
//     return 2;
//   } else {
//     return Error('Error player name is not valid');
//   }
// }
// function calculateHandWinner(roundInfo, trumpSuit) {
//   const playedCards = roundInfo.playedCards;

//   // Get starter card suit
//   const starterCardId = playedCards[roundInfo.starterPlayerIndex];
//   const starterSuit = getSuitFromCardId(starterCardId);

//   let playedCardObjects = playedCards.map((cardId, index) => {
//     return {
//       cardId: cardId,
//       suit: getSuitFromCardId(cardId),
//       value: getCardValue(cardId),
//       playerIndex: index,
//     };
//   });

//   let maxValue = 0;
//   let maxIndex = 0;
//   if (playedCardObjects.some(c => c.suit === trumpSuit)) {
//     playedCardObjects.forEach(element => {
//       if (element.suit === trumpSuit) {
//         if (element.value > maxValue) {
//           maxValue = element.value;
//           maxIndex = element.playerIndex;
//         }
//       }
//     });
//   } else {
//     playedCardObjects.forEach(element => {
//       if (element.suit === starterSuit) {
//         if (element.value > maxValue) {
//           maxValue = element.value;
//           maxIndex = element.playerIndex;
//         }
//       }
//     });
//   }

//   return maxIndex;
// }

// function gameIsFinished() {
//   if (team1_points === 7 || team2_points === 7) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function updateHandAndPitch(cardId) {
//   const hand = playerHands[0];
//   const handIndex = hand.indexOf(cardId);

//   if (handIndex !== -1) {
//     hand.splice(handIndex, 1);
//     hitCardToPitch(cardId, turn);
//     humanPlayedCardId = cardId; // Assuming this is also part of the game state
//   } else {
//     throw new Error(`Error cardId: ${cardId} is not in hand: hand: ${hand}`);
//   }
// }

// function handleCardClick(event) {
//   const hand = playerHands[0];
//   if (turn === 0 && hand.length !== 0) {
//     const src = event.target.src;
//     const cardId = getCardIdFromSrc(src);
//     const selectedCardSuit = getSuitFromCardId(cardId);

//     if (pitchSuit !== '') {
//       if (pitchSuit === selectedCardSuit) {
//         updateHandAndPitch(cardId);
//         return;
//       } else if (hand.some(card => getSuitFromCardId(card) === pitchSuit)) {
//         alert('Please select a card of the same suit as the pitch');
//         return;
//       }
//       updateHandAndPitch(cardId);
//     } else {
//       pitchSuit = selectedCardSuit;
//       updateHandAndPitch(cardId);
//       return;
//     }
//   } else {
//     alert('Please wait for your turn');
//   }
// }

// function addEffectToName(playerIndex) {
//   const playerName = playerNames[playerIndex];
//   const playerNameElement = document.getElementById(`${playerName}PlayerName`);
//   playerNameElement.classList.add('neon');
// }

// function removeEffectFromName(playerIndex) {
//   const playerName = playerNames[playerIndex];
//   const playerNameElement = document.getElementById(`${playerName}PlayerName`);
//   playerNameElement.classList.remove('neon');
// }

// async function playHandAsync() {
//   switch (turn) {
//     case 0: {
//       while (humanPlayedCardId === undefined) {
//         await sleep(250);
//       }
//       return humanPlayedCardId;
//     }

//     case 1:
//     case 2:
//     case 3: {
//       console.warn(
//         `before popHand: playerHands[${turn}]: ${playerHands[turn].join(
//           ' | ',
//         )}`,
//       );
//       cardId = popCardFromCOMHand(playerHands[turn]);
//       console.warn(`COM played card: ${cardId}`);
//       console.warn(
//         `after popHand: playerHands[${turn}]: ${playerHands[turn].join(' | ')}`,
//       );

//       hitCardToPitch(cardId, turn);
//       return cardId;
//     }
//     default:
//       throw new Error(`Not a valid turn, turn: ${turn}`);
//   }
// }

// function clearScreen() {
//   render([[], [], [], []]);
// }

// function chooseHokmForPlayer() {
//   return new Promise((resolve, reject) => {
//     const images = document.querySelectorAll('.card.player');
//     const chooseHokmHandler = e => {
//       try {
//         chooseHokm(e);
//         resolve(); // Resolve the promise when the user makes a selection.
//       } catch (error) {
//         reject(error); // Reject the promise if an error occurs.
//       } finally {
//         // Clean up by removing event listeners.
//         images.forEach(image => {
//           image.removeEventListener('click', chooseHokmHandler);
//         });
//       }
//     };

//     images.forEach(image => {
//       image.addEventListener('click', chooseHokmHandler);
//     });

//     alert('You Are Hakem, you have to choose a suit as Hokm');
//   });
// }

// async function initiateHokmSelection() {
//   try {
//     await chooseHokmForPlayer();
//     // Continue with the game flow after the hokm has been chosen.
//   } catch (error) {
//     console.error('An error occurred during hokm selection:', error);
//     // Handle the error appropriately, possibly by notifying the user.
//   }
// }

// async function getHokmAsync() {
//   hakemHasDeclaredHokm = false;
//   return new Promise(async (resolve, reject) => {
//     if (hakem === playerNames[0]) {
//       await initiateHokmSelection();
//     } else {
//       trumpSuit = calculateTrumpSuit(playerHands[playerNames.indexOf(hakem)]);
//       hakemHasDeclaredHokm = true;
//     }

//     resolve(trumpSuit);
//   });
// }

// function chooseHokm(e) {
//   let cardId = getCardIdFromSrc(e.target.src);
//   trumpSuit = getSuitFromCardId(cardId);
//   hakemHasDeclaredHokm = true;
// }
// function countSuits(cards) {
//   return cards.reduce((acc, card) => {
//     const suit = getSuitFromCardId(card);
//     acc[suit] = (acc[suit] || 0) + 1;
//     return acc;
//   }, {});
// }

// function sortSuitsByOccurrence(suitsCount) {
//   return Object.entries(suitsCount).sort((a, b) => b[1] - a[1]);
// }

// function calculateSuitValue(cards, suit) {
//   return cards
//     .filter(card => getSuitFromCardId(card) === suit)
//     .reduce((sum, card) => sum + getCardValue(card), 0);
// }

// function calculateTrumpSuit(cards) {
//   if (!Array.isArray(cards) || cards.length === 0) {
//     throw new Error('Invalid cards array provided.');
//   }

//   const suitsCount = countSuits(cards);
//   const sortedSuits = sortSuitsByOccurrence(suitsCount);

//   let maxSum = 0;
//   let maxSumSuit = '';

//   for (const [suit] of sortedSuits) {
//     const sum = calculateSuitValue(cards, suit);
//     if (sum > maxSum) {
//       maxSum = sum;
//       maxSumSuit = suit;
//     }
//   }

//   return maxSumSuit;
// }

// async function initHakemAsync(shuffledDeck, dealingSpeed = 1) {
//   let index = 0;
//   const playersCount = playerNames.length;

//   while (shuffledDeck.length > 0) {
//     turn = index % playersCount;
//     await sleep(dealingSpeed);
//     let cardId = shuffledDeck.splice(0, 1)[0];
//     let cardElement = getFrontOfCardImgElement(cardId);
//     updateCardElementClasses(cardElement, turn); // Refactored code duplication
//     let playerHand = getPlayerHandElementId(playerNames[turn]);
//     dealCardEl(playerHand, cardElement);

//     if (getCardValue(cardId) === 14) {
//       //turn player is hakem
//       hakem = playerNames[turn];
//       animationForAce(cardElement);
//       addHakemImage(playerHand);
//       return playerNames[turn]; // Resolves with the hakem's name
//     }

//     index++;
//   }

//   // No Ace card found, resolve with a default value or handle accordingly
//   return null; // or a suitable default value or error handling
// }

// function updateCardElementClasses(cardElement, turn) {
//   if (turn !== 0) {
//     // if not human-player
//     cardElement.classList.remove('player');
//     cardElement.classList.add('otherPlayers');
//   } else {
//     // if human-player
//     cardElement.classList.remove('otherPlayers');
//     cardElement.classList.add('player');
//   }
// }

// function animationForAce(aceCardElement) {
//   aceCardElement.style.transform = 'scale(1.2)';
//   aceCardElement.style.border = '1px solid black';
//   aceHitSound.play();
// }

// function render(playerHands) {
//   tableDiv.innerHTML = getTableDivInnerHtmlText(playerHands);
//   clearPitchCard();

//   if (hakem !== undefined) {
//     addHakemImage(`player-hand ${hakem}`);
//   }
// }

// function createPlayerHandHtmlTag(classname, playername, cardArr, playerIndex) {
//   let cardsHtml = cardArr
//     .map(element =>
//       classname === 'player-hand south'
//         ? getFrontOfCardImgHtml(element)
//         : getBackOfCardImgHtml(element),
//     )
//     .join('');
//   return `
//     <div class="${classname}" id="${classname}">
//       <h3 class="playernameLabel" id="${playerNames[playerIndex]}PlayerName">${playername}</h3>
//       ${cardsHtml}
//     </div>
//   `;
// }

// function createPitchCardHtmlTag(position) {
//   return `
//     <img
//       src="${getCardImgUrl('Back')}"
//       id="pitch-card-img-${position}"
//       class="pitch-card ${position}"
//     />
//   `;
// }

// function createPlayerHandHtmlTag(className, playerName, cardArr, playerIndex) {
//   let cardsHtml = cardArr
//     .map(element =>
//       className === 'player-hand south'
//         ? getFrontOfCardImgHtml(element)
//         : getBackOfCardImgHtml(element),
//     )
//     .join('');
//   return `
//     <div class="${className}" id="${className}">
//       <h3 class="playernameLabel" id="${playerNames[playerIndex]}PlayerName">${playerName}</h3>
//       ${cardsHtml}
//     </div>
//   `;
// }

// function getTableDivInnerHtmlText(playerHands) {
//   let mePlayerHtmlTag = createPlayerHandHtmlTag(
//     'player-hand south',
//     'Hassan',
//     playerHands[0],
//     0,
//   );
//   let teammateHtmlTag = createPlayerHandHtmlTag(
//     'player-hand north',
//     'Sherik',
//     playerHands[2],
//     2,
//   );
//   let opponent1HtmlTag = createPlayerHandHtmlTag(
//     'player-hand east',
//     'Oponent 1',
//     playerHands[1],
//     1,
//   );
//   let opponent2HtmlTag = createPlayerHandHtmlTag(
//     'player-hand west',
//     'Oponent 2',
//     playerHands[3],
//     3,
//   );

//   let pitchCardHtmlTag = `
//     <div class="pitch-card" id="pitch-card">
//       ${createPitchCardHtmlTag('south')}
//       ${createPitchCardHtmlTag('west')}
//       ${createPitchCardHtmlTag('north')}
//       ${createPitchCardHtmlTag('east')}
//     </div>
//   `;

//   let tableDivInnerHTML = `
//     ${pitchCardHtmlTag}
//     ${mePlayerHtmlTag}
//     ${teammateHtmlTag}
//     ${opponent1HtmlTag}
//     ${opponent2HtmlTag}
//     <h2 id="comTeam-totalPoints">COM Total Points: ${team2_totalPoints}</h2>
//     <h2 id="ourTeam-totalPoints">Our Total Points: ${team1_totalPoints}</h2>
//     <h2 id="com-team">COM_Team: 0</h2>
//     <h2 id="our-team">Our_Team: 0</h2>
//   `;
//   return tableDivInnerHTML;
// }

// function getSuitFromCardId(cardId) {
//   if (cardId.includes('Spades')) {
//     return 'Spades';
//   }
//   if (cardId.includes('Hearts')) {
//     return 'Hearts';
//   }
//   if (cardId.includes('Diamonds')) {
//     return 'Diamonds';
//   }
//   if (cardId.includes('Clubs')) {
//     return 'Clubs';
//   }
//   throw new Error(`Invalid cardId: ${cardId}, can't get suit`);
// }

// function filterCardsBySuit(hand, suit) {
//   return hand.filter(card => getSuitFromCardId(card) === suit);
// }

// function popCardFromCOMHand(hand) {
//   if (!hand || !Array.isArray(hand) || hand.length === 0) {
//     throw new Error('Invalid hand parameter');
//   }

//   let cardId = null;
//   if (pitchSuit === '') {
//     cardId = getRandomCardId(hand);
//     pitchSuit = getSuitFromCardId(cardId);
//   }

//   let followSuitCards = filterCardsBySuit(hand, pitchSuit);
//   if (followSuitCards.length === 0) {
//     let trumpCards = filterCardsBySuit(hand, trumpSuit);
//     if (trumpCards.length !== 0) {
//       cardId = getRandomCardId(trumpCards);
//     } else {
//       cardId = getRandomCardId(hand);
//     }
//   } else {
//     cardId = getRandomCardId(followSuitCards);
//   }

//   // throw error if card is not found or not valid
//   if (!cardId) {
//     throw new Error(
//       `Invalid card or index, found: ${{card: cardId}}, hand: ${hand}`,
//     );
//   }
//   const poppedCardIndex = hand.indexOf(cardId);
//   hand.splice(poppedCardIndex, 1);
//   return cardId;
// }

// function getRandomCardId(cards) {
//   const index = Math.floor(Math.random() * cards.length);
//   if (
//     index < 0 ||
//     index > cards.length ||
//     isNaN(index) ||
//     cards[index] === undefined ||
//     cards.length === 0 ||
//     Array.isArray(cards) === false
//   ) {
//     throw new Error(`Invalid index: ${index} or cards: ${cards}`);
//   }
//   return cards[index];
// }

// function hitCardToPitch(cardId, playerTurn) {
//   let pitchCardElementId = `pitch-card-img-${playerNames[playerTurn]}`;
//   if (isNullOrEmpty(playerNames[playerTurn])) {
//     throw new Error('Invalid pitchCardElement, Where to hit???');
//   }
//   let pitchSideEl = document.getElementById(pitchCardElementId);
//   let playerHandElId = `player-hand ${playerNames[playerTurn]}`;
//   let playerHandEl = document.getElementById(playerHandElId);
//   console.warn(
//     `playerHandEl before hitCard:=====\n ${toHtmlString(playerHandEl)}`,
//   );
//   const selectedCardElement = document.getElementById(cardId);
//   if (!selectedCardElement) {
//     throw new Error(
//       `Card not found in hand, cardId: ${cardId}, playerTurn: ${playerTurn}`,
//     );
//   }
//   selectedCardElement.remove();

//   appendCardToPitch(pitchSideEl, cardId);
//   console.warn(
//     `playerHandEl before hitCard:=====\n ${toHtmlString(playerHandEl)}`,
//   );

//   printPitchCard(`pitchCard after hit:${pitchCardElementId}`);
// }

// function hideImage(pitchImageElement) {
//   pitchImageElement.src = '';
//   pitchImageElement.style.display = 'none';
//   pitchImageElement.alt = '';
// }

// function clearPitchCard() {
//   const southPitchCard = document.getElementById('pitch-card-img-south');
//   hideImage(southPitchCard);
//   const northPitchCard = document.getElementById('pitch-card-img-north');
//   hideImage(northPitchCard);
//   const eastPitchCard = document.getElementById('pitch-card-img-east');
//   hideImage(eastPitchCard);
//   const westPitchCard = document.getElementById('pitch-card-img-west');
//   hideImage(westPitchCard);
// }

// function appendCardToPitch(pitchSide, cardId) {
//   pitchSide.src = getCardImgUrl(cardId);
//   //pitchSide.style.display = displayBeforeChange;
//   pitchSide.removeAttribute('style');
//   pitchSide.alt = cardId;
// }

// function addHakemImage(playerHand) {
//   // Select the <div> element by its id
//   var playerHandDiv = document.getElementById(playerHand);

//   // Check if the <div> element is found
//   if (playerHandDiv) {
//     // Find the <h3> element inside the <div>
//     var h3Element = playerHandDiv.querySelector('h3');

//     // Check if the <h3> element is found
//     if (h3Element) {
//       // Create a new <img> element
//       var newImgElement = document.createElement('img');

//       // Set the src attribute for the new <img> element
//       newImgElement.src = 'images/VintagePlayingCards/Hakem.png';
//       newImgElement.setAttribute('class', 'hakem-Icon');
//       newImgElement.setAttribute('id', 'hakem-Icon');

//       // Append the new <img> element inside the <h3> element
//       h3Element.appendChild(newImgElement);
//     } else {
//       console.error(
//         'The <h3> element was not found inside the specified <div>.',
//       );
//     }
//   } else {
//     console.error('The specified <div> element was not found in the document.');
//   }
// }

// async function addHokmImageAsync(hakem, trumpSuit) {
//   if (
//     !trumpSuit ||
//     trumpSuit === '' ||
//     trumpSuit === null ||
//     trumpSuit === undefined ||
//     hakem === '' ||
//     hakem === null ||
//     hakem === undefined
//   ) {
//     throw new Error(
//       `Can not update hokm image, trumpSuit: ${trumpSuit}, hakem: ${hakem}`,
//     );
//   }

//   const playerHandElId = `player-hand ${hakem}`;
//   var playerHandEl = document.getElementById(playerHandElId);
//   // Check if the <div> element is found
//   if (playerHandEl) {
//     // Find the <h3> element inside the <div>
//     var placeEl = playerHandEl.querySelector('h3');

//     // Check if the <h3> element is found
//     if (placeEl) {
//       // Create a new <img> element
//       var newImgElement = document.createElement('img');

//       // Set the src attribute for the new <img> element
//       newImgElement.src = `images/VintagePlayingCards/${trumpSuit}.png`;
//       newImgElement.setAttribute('class', 'hokm-Icon');
//       newImgElement.setAttribute('id', 'hokm-Icon');
//       await sleep(1);
//       // Append the new <img> element inside the <h3> element
//       placeEl.appendChild(newImgElement);
//     } else {
//       console.error(
//         'The <h3> element was not found inside the specified <div>.',
//       );
//     }
//   } else {
//     console.error('The specified <div> element was not found in the document.');
//   }
// }

// async function dealCardsBetweenPlayersAsync(
//   cardDeck,
//   playerToStartDeal = hakem,
//   eachPlayerCardsCount = 5,
//   speed = 1,
// ) {
//   const startIndex = playerNames.indexOf(playerToStartDeal);
//   const playersCount = playerNames.length;
//   for (let pIndex = 0; pIndex < playersCount; pIndex++) {
//     const playerIndex = (startIndex + pIndex) % playersCount;
//     const playerHand = getPlayerHandElementId(playerNames[playerIndex]);

//     for (let count = 0; count < eachPlayerCardsCount; count++) {
//       const cardId = cardDeck.pop();
//       let cardElement = getBackOfCardImgElement(cardId);
//       if (playerIndex % playersCount === 0) {
//         cardElement = getFrontOfCardImgElement(cardId);
//       }
//       playerHands[playerIndex].push(cardId); //push card to array
//       dealCardEl(playerHand, cardElement);
//       await sleep(speed);
//     }
//   }
// }

// function dealCardEl(playerHand, cardElement) {
//   let playerHandEl = document.getElementById(playerHand);
//   playerHandEl.appendChild(cardElement);
//   touchCardsSound.play();
// }

// function getFrontOfCardImgElement(cardId) {
//   return getCardImageElement(getFrontOfCardImgHtml(cardId));
// }

// function getBackOfCardImgElement(cardId) {
//   return getCardImageElement(getBackOfCardImgHtml(cardId));
// }

// function getCardImageElement(imageHTML) {
//   let tempContainer = document.createElement('div');
//   tempContainer.innerHTML = imageHTML;
//   return tempContainer.firstChild;
// }

// function getPlayerHandElementId(playerName) {
//   return `player-hand ${playerName}`;
// }

// function getShuffledDeck() {
//   shuffleCardsSound.play();
//   return getShuffledDeckWithFisherYatesAlgorithm();
//   let deck = [...cards]; //for keep cards immutable
//   let shuffledDeck = [];

//   for (let i = 0; i < 52; i++) {
//     let randomCard = Math.floor(getRandomNumber() * deck.length);
//     randomCard = deck.splice(randomCard, 1);
//     shuffledDeck.push(randomCard);
//   }

//   return shuffledDeck;
// }

// function getShuffledDeckWithFisherYatesAlgorithm() {
//   // Create a new array of cards
//   const deck = [...cards];

//   // Fisher-Yates shuffle
//   for (let i = deck.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [deck[i], deck[j]] = [deck[j], deck[i]];
//   }

//   return deck;
// }

// function getRandomNumber() {
//   let seed = Date.now(); // Use the current timestamp as the seed
//   let random = Math.sin(seed) * 10000; // Generate a random number using the seed
//   return random - Math.floor(random); // Normalize the number between 0 and 1
// }

// function getFrontOfCardImgHtml(cardId, cardsTheme = 'VintagePlayingCards') {
//   let frontCardImageUrl = getCardImgUrl(cardId, cardsTheme);
//   return `<img src="${frontCardImageUrl}" alt="${cardId}" id ="${cardId}" class="card player">`;
// }

// function getCardImgUrl(cardId, cardsTheme = 'VintagePlayingCards') {
//   return `images/${cardsTheme}/${cardId}.png`;
// }

// function getBackOfCardImgHtml(cardId, cardsTheme = 'VintagePlayingCards') {
//   return `<img src="${getCardImgUrl(
//     'Back',
//     cardsTheme,
//   )}" alt="back" id ="${cardId}" class="card otherPlayers">`;
// }

// function getDealtPlayerHands(cardDeck) {
//   //needs to be better
//   let players = [[], [], [], []];
//   let inputCardDeck = [...cardDeck];
//   for (let i = 0; i < 52; i++) {
//     let card = inputCardDeck.splice(0, 1)[0];
//     players[i % 4].push(card);
//   }

//   return players;
// }

// function getCardIdFromSrc(src) {
//   if (
//     src === undefined ||
//     src === null ||
//     src === '' ||
//     src.length < 1 ||
//     src.indexOf('images') === -1
//   ) {
//     throw new Error(`Invalid src: ${src}`);
//   }

//   const urlParts = src.split('/');
//   const fileName = urlParts[urlParts.length - 1];

//   const cardId = fileName.split('.')[0];

//   //throw exception if not valid
//   if (cardId === undefined || cardId === null || cardId === '') {
//     throw new Error(`Invalid cardId: ${cardId}`);
//   }
//   return cardId;
// }

// function addClickEventToHumanPlayerCards() {
//   const images = document.querySelectorAll('.card.player');
//   images.forEach(image => {
//     image.addEventListener('click', handleCardClick);
//   });
// }

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// function isNullOrEmpty(str) {
//   return str === null || str.trim() === '';
// }

// function countOccurrences(arr) {
//   var counts = {};

//   for (var i = 0; i < arr.length; i++) {
//     var element = arr[i];
//     counts[element] = (counts[element] || 0) + 1;
//   }

//   return counts;
// }
// ش;
// function arrayToTableText(arr, columns = 4, padding = 12) {
//   const rows = Math.ceil(arr.length / columns);
//   let text = '';

//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < columns; j++) {
//       const index = i * columns + j;
//       if (index < arr.length) {
//         text += arr[index].toString().padEnd(padding, ' ');
//       }
//     }
//     text += '\n';
//   }

//   return text;
// }

// function printPitchCard(message) {
//   return;
//   console.error(`===========================================\n${message}`);
//   let pitchEl = document.getElementById('pitch-card');
//   console.warn(toHtmlString(pitchEl));
// }

// function toHtmlString(htmlElement) {
//   let htmlString = htmlElement.outerHTML;
//   return htmlString.replace(/></g, '>\n<');
// }

import {
  Button,
  StyleSheet,
  View,
  Alert,
  Touchable,
  TouchableOpacity,
  Text,
} from 'react-native';

import PitchCardsContainerView from './components/uiComponents/PitchCardsContainerView';
import ScoreBoardView from './components/uiComponents/ScoreBoardView';

import HandCardsView from './components/uiComponents/HandCardsView';
import React, {Component, useEffect} from 'react';
import {CardModel, Suit} from './components/dataModels/CardModel';
import Props from './Props';
import {HokmGameData} from './components/dataModels/HokmGameData';
import {GamePhase} from './components/dataModels/GamePhase';
import CardView from './components/uiComponents/CardView';
import {shuffleDeck} from './components/logic/CardsData';
import {logger} from 'react-native-logs';
import {loggerConfig} from './components/logic/Constants';
import {HokmRoundData} from './components/dataModels/HokmRoundData';
import {HokmTrickData} from './components/dataModels/HokmTrickData';

const PLAYERS_COUNT = 4;
const log = logger.createLogger(loggerConfig);
const PLAYERS_DIRECTION_LIST = ['south,west,north,east'];
const HUMAN_PLAYER_INDEX = 0;
const ROUND_WIN_SCORE = 7;

export default class Hokm extends Component<Props, HokmGameData> {
  lastRoundIndex(): number {
    return this.state.rounds.length > 0 ? this.state.rounds.length - 1 : -1;
  }

  stateToString(): string {
    return `
      Game Phase: ${this.state.gamePhase}
      Last Round Index: ${this.lastRoundIndex()}
      Rounds Count: ${this.state.rounds.length}
      Team 1 Round Points: ${this.state.team1_roundPoints}
      Team 2 Round Points: ${this.state.team2_roundPoints}
    `;
  }

  initialGameData(): HokmGameData {
    const gameData = new HokmGameData();
    const firstRound = HokmRoundData.newRound(0, -1, []);
    gameData.rounds = [firstRound];
    return gameData;
  }

  lastRound(): HokmRoundData {
    const index = this.lastRoundIndex();
    if (index === -1) {
      throw new Error('No rounds available in the game.');
    }
    return this.state.rounds[index];
  }

  constructor(props: Props) {
    super(props);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.state = this.initialGameData();
  }

  render() {
    const gamePhase = this.state.gamePhase;
    log.state(`[${gamePhase}]`);

    log.value(` currentRound:[${toJson(this.lastRound())}]`);
    switch (gamePhase) {
      case GamePhase.NotStarted:
        return this.renderGameNotStarted();

      case GamePhase.Initial:
        return this.renderInitial();

      case GamePhase.InitHakem:
        return this.renderInitHakem();

      case GamePhase.DealFirstHandToHokm:
        return this.renderDealFirstHandToHokm();

      case GamePhase.WaitForHakemToChooseHokm:
        return this.renderWaitForHakemToChooseHokm();

      case GamePhase.DealRemainHandsToPlayers:
        return this.renderDealRemainHandsToPlayers();

      case GamePhase.TrickPlaying:
      case GamePhase.TrickOverAndCalculateWinner:
      case GamePhase.CheckRoundIsOver:
      case GamePhase.CheckRoundIsOver:
        return this.renderTrickPlaying();
    }
  }

  renderDealRemainHandsToPlayers(): React.JSX.Element {
    log.gInfo('renderDealRemainHandsToPlayers');
    return this.renderInitHakem();
  }

  renderTrickPlaying(): React.JSX.Element {
    log.method('renderTrickPlaying');
    return (
      <View style={styles.container}>
        {this.renderScoreBoard()}
        {this.renderPitch()}
        {this.renderPlayerCards(0)}
        {this.renderPlayerCards(1)}
        {this.renderPlayerCards(2)}
        {this.renderPlayerCards(3)}
      </View>
    );
  }

  renderWaitForHakemToChooseHokm(): React.JSX.Element {
    log.gInfo('renderWaitForHakemToChooseHokm');
    return this.renderInitHakem();
  }

  renderDealFirstHandToHokm(): React.JSX.Element {
    return this.renderInitHakem();
  }

  renderInitHakem(): React.JSX.Element {
    return (
      <View style={styles.container}>
        {this.renderScoreBoard()}
        {this.renderPlayerCards(0)}
        {this.renderPlayerCards(1)}
        {this.renderPlayerCards(2)}
        {this.renderPlayerCards(3)}
      </View>
    );
  }

  getPlayerCardsInHand(playerIndex: number): CardModel[] {
    const currentRound = this.lastRound();
    currentRound.player1Hand;
    switch (playerIndex) {
      case 0:
        return currentRound.player1Hand;
      case 1:
        return currentRound.player2Hand;
      case 2:
        return currentRound.player3Hand;
      case 3:
        return currentRound.player4Hand;
    }
    throw new Error('Unknown player index');
  }

  getHandStyle(playerIndex: number): any {
    if (this.state.gamePhase === GamePhase.InitHakem) {
      switch (playerIndex) {
        case 0:
          return styles.southPlayer_InitHakem;
        case 1:
          return styles.westPlayer_InitHakem;
        case 2:
          return styles.northPlayer_InitHakem;
        case 3:
          return styles.eastPlayer_InitHakem;
      }
    } else if (
      //playing
      this.state.gamePhase === GamePhase.TrickPlaying ||
      this.state.gamePhase === GamePhase.CheckRoundIsOver ||
      this.state.gamePhase === GamePhase.TrickOverAndCalculateWinner
    ) {
      switch (playerIndex) {
        case 0:
          return styles.southPlayer_Playing;
        case 1:
          return styles.westPlayer_Playing;
        case 2:
          return styles.northPlayer_Playing;
        case 3:
          return styles.eastPlayer_Playing;
      }
    } else {
      switch (playerIndex) {
        case 0:
          return styles.southPlayer;
        case 1:
          return styles.westPlayer;
        case 2:
          return styles.northPlayer;
        case 3:
          return styles.eastPlayer;
      }
    }
  }

  renderPlayerCards(playerIndex: number): React.JSX.Element {
    const currentRound = this.lastRound();

    const currentTrick = currentRound.currentTrick();
    const inPlayingPhase = this.state.gamePhase !== GamePhase.InitHakem;
    const playerHand = this.getPlayerCardsInHand(playerIndex);
    const style = this.getHandStyle(playerIndex);
    const isHumanPlayer = playerIndex === HUMAN_PLAYER_INDEX;
    const isHakem = currentRound.hakemIndex === playerIndex;

    const isPlayerTurnToPlay =
      // this.state.gamePhase !== GamePhase.InitHakem &&
      // this.state.gamePhase !== GamePhase.WaitForHakemToChooseHokm &&
      // this.state.gamePhase !== GamePhase.DealRemainHandsToPlayers &&
      currentTrick !== undefined && currentTrick.turn === playerIndex;

    const showFront = isHumanPlayer || !inPlayingPhase;

    log.cards(
      `cards in hand for player:[${playerIndex}]: ${cardsToString(playerHand)}`,
    );

    const func =
      isHumanPlayer && inPlayingPhase ? this.handleCardClick : undefined;

    return (
      <View key={PLAYERS_DIRECTION_LIST[playerIndex]} style={style}>
        <Text>{playerIndex}</Text>
        <HandCardsView
          isTurn={isPlayerTurnToPlay}
          isHumanPlayer={isHumanPlayer}
          cards={playerHand}
          isHakem={isHakem}
          showFront={showFront}
          onClickFunc={func}
          shouldRotate={inPlayingPhase}></HandCardsView>
      </View>
    );
  }

  handleCardClick = (clickedCard: CardModel): void => {
    log.method('*** handleCardClick()-Start');
    log.state(`[${this.state.gamePhase}]`);

    const currentRound = this.lastRound();
    const currentTrick = currentRound.currentTrick();
    const turn = currentTrick.turn;
    log.state(`[${currentTrick.turn}]`);
    switch (this.state.gamePhase) {
      case GamePhase.WaitForHakemToChooseHokm: {
        log.state(`before change state.round: ${toJson(this.state.rounds)}`);
        const hokmSuit = clickedCard.Suit;
        currentTrick.clickedCard = clickedCard;
        currentTrick.turn = HUMAN_PLAYER_INDEX;

        currentRound.hokmSuit = hokmSuit;
        log.state(`after change state.round: ${toJson([currentRound])}`);
        this.setState(
          {
            rounds: [currentRound],
            gamePhase: GamePhase.DealRemainHandsToPlayers,
          },
          () => this.dealRemainHandsToPlayers(),
        );

        log.gInfo(`hokmSuit chosen: ${hokmSuit}`);

        return;
      }

      case GamePhase.TrickPlaying: {
        log.gInfo('clicked in a acceptable state');
        //check the turn is for the player or not
        if (turn !== HUMAN_PLAYER_INDEX) {
          log.info(`not player's turn`);
          return;
        } else {
          log.cards(
            `card chosen by user for playing: ${clickedCard.toLogString()}`,
          );

          //if the human is the starter player, if yes then clickedCard should update,
          if (currentTrick.starterPlayerIndex === HUMAN_PLAYER_INDEX) {
            log.debug(
              `human is the starter player, so update clickedCard, before change state.round: ${toJson(
                this.state.rounds,
              )}`,
            );
            currentTrick.clickedCard = clickedCard;
            currentTrick.leadSuit = clickedCard.Suit;
            currentTrick.turn = (turn + 1) % PLAYERS_COUNT; //nextTurn

            const currentRounds = this.state.rounds;
            currentRounds[this.lastRoundIndex()] = currentRound;
            log.debug(`after change state.round: ${toJson(currentRounds)}`);
            this.setState({
              rounds: currentRounds,
              gamePhase: GamePhase.TrickPlaying,
            });
          } else {
            const leadSuit = currentTrick.leadSuit;
            log.debug(`human is not the starter player, should follow the lead suit ${leadSuit},
             before change state.round: ${toJson(this.state.rounds)}`);

            if (leadSuit === clickedCard.Suit) {
              currentTrick.clickedCard = clickedCard;
              currentTrick.turn = (turn + 1) % PLAYERS_COUNT; //nextTurn

              const currentRounds = this.state.rounds;
              currentRounds[this.lastRoundIndex()] = currentRound;
              log.debug(`after change state.round: ${toJson(currentRounds)}`);
              this.setState({
                rounds: currentRounds,
                gamePhase: GamePhase.TrickPlaying,
              });
            } else {
              log.error(
                `not the lead suit, please choose a card from ${leadSuit}`,
              );
            }
          }
          return;
        }
      }
    }
  };

  renderPitch(): React.JSX.Element {
    const currentRound = this.lastRound();
    const currentTrick = currentRound.currentTrick();
    const currentPlayedCards = currentTrick ? currentTrick.pitchCards : [];

    return (
      <PitchCardsContainerView
        southCard={currentPlayedCards[0]}
        westCard={currentPlayedCards[1]}
        northCard={currentPlayedCards[2]}
        eastCard={currentPlayedCards[3]}></PitchCardsContainerView>
    );
  }

  getCurrentTeamsStatistics() {
    const team1 = {
      name: this.state.gameSettings.Team1Name,
      trickScore: this.lastRound().team1_trickPoints,
    };

    const team2 = {
      name: this.state.gameSettings.Team2Name,
      trickScore: this.lastRound().team2_trickPoints,
    };

    return {team1, team2};
  }
  renderScoreBoard() {
    const {team1, team2} = this.getCurrentTeamsStatistics();

    return (
      <ScoreBoardView
        style={styles.scoreBoard}
        team1={team1}
        team2={team2}></ScoreBoardView>
    );
  }

  renderInitial(): React.JSX.Element {
    const {team1, team2} = this.getCurrentTeamsStatistics();
    return (
      <View style={styles.container}>
        <ScoreBoardView
          style={styles.scoreBoard}
          team1={team1}
          team2={team2}></ScoreBoardView>
      </View>
    );
  }

  async onStartButtonPress() {
    //can check if game is still on play or not
    log.method('*** onStartButtonPress()-Start');
    const cardDeck = shuffleDeck();
    log.cards(`cardDeck shuffled: ${cardsToString(cardDeck)}`);

    await sleep(10);

    log.gInfo(`current round: ${toJson(this.lastRound())}`);
    // should not update round number yet, because round -1 means we are still

    this.setState(
      prevState => {
        const lastRound = this.lastRound();
        lastRound.cardDeck = cardDeck;
        log.info(`new round should be: ${lastRound.toString()}`);
        return {
          gamePhase: GamePhase.InitHakem,
          rounds: [...prevState.rounds, lastRound],
        };
      },
      async () => {
        await this.initHakemAsync();
      },
    );

    log.method('*** onStartButtonPress()-End');
  }

  async initHakemAsync(dealingSpeed = 7) {
    let index = 0;
    const currentRound = this.lastRound();

    log.method('*** initHakemAsync()-Start');
    log.cards(`cardDeck length:[${currentRound.cardDeck.length}]`);
    let turn = 0;
    let hakem = -1;
    const cardDeck = currentRound.cardDeck;
    while (cardDeck.length > 0) {
      turn = index % PLAYERS_COUNT;

      await sleep(dealingSpeed);
      let card = cardDeck.splice(0, 1)[0];
      this.singleDealToPlayer(card, turn);
      if (card.Rank === 'A') {
        log.value(`hakem is chosen, ---[HAKEM: ${turn}]---`);
        hakem = turn;
        break;
      }
      index++;
    }

    const FIRST_ROUND_NUMBER = 1;
    const round = HokmRoundData.newRound(
      FIRST_ROUND_NUMBER,
      hakem,
      shuffleDeck(),
    );

    log.debug(
      `create new round that indicates the game is now on with: 
      roundNumber:[${FIRST_ROUND_NUMBER}],
      cardDeck length:[${round.cardDeck.length}](*Shuffled),
      hakemIndex:[${hakem}]`,
    );

    this.setState(
      prev => ({
        rounds: [...prev.rounds, round],
        gamePhase: GamePhase.WaitForHakemToChooseHokm,
      }),
      async () => {
        await this.dealFirstHand();
      },
    );
    log.method('*** initHakemAsync()-End');
  }

  async dealFirstHand() {
    //Before hokm, dealt and wait to hokm declared!
    log.method('*** dealFirstHand()-Start');

    const currentRound = this.lastRound();
    const cardDeck = currentRound.cardDeck;
    const rounds = this.state.rounds;

    for (let index = 0; index < PLAYERS_COUNT; index++) {
      const playerIndex = (currentRound.hakemIndex + index) % PLAYERS_COUNT;
      const hand = cardDeck.splice(0, 5);
      this.batchDealToPlayer(hand, playerIndex);
      await sleep(0.7);
    }

    currentRound.cardDeck = cardDeck;
    rounds[this.lastRoundIndex()] = currentRound;

    this.setState(
      {
        gamePhase: GamePhase.WaitForHakemToChooseHokm,
        rounds: rounds,
      },
      async () => {
        await this.declareHokmAsync();
      },
    );

    log.method('*** dealingHakemToHokmAsync()-End');
  }

  async declareHokmAsync() {
    log.method('*** DeclareHokmAsync()-Start');

    const currentRound = this.lastRound();
    const hakemIndex = currentRound.hakemIndex;
    const rounds = this.state.rounds;

    let newHokmSuit = undefined;
    switch (hakemIndex) {
      case 0:
        await new Promise<void>(resolve => {
          const checkHokmSuit = () => {
            if (hakemIndex !== undefined) {
              resolve();
            } else {
              log.gInfo(`hokmSuit is not chosen yet, wait for it`);
              setTimeout(checkHokmSuit, 1000);
            }
          };

          checkHokmSuit();
        });
        return;

      case 1:
      case 2:
      case 3:
        const cards = this.getPlayerCardsInHand(hakemIndex);
        newHokmSuit = this.calculateHokmForAgent(cards);
        currentRound.hokmSuit = newHokmSuit;
        rounds[this.lastRoundIndex()] = currentRound;
        break;
    }

    this.setState(
      {
        gamePhase: GamePhase.DealRemainHandsToPlayers,
        rounds: rounds,
      },
      async () => await this.dealRemainHandsToPlayers(),
    );
  }

  calculateHokmForAgent(cards: CardModel[]): Suit {
    log.method('*** calculateHokmForAgent()-Start');

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Invalid cards array provided.');
    }

    let x = {
      Hearts: 0,
      Clubs: 0,
      Spades: 0,
      Diamonds: 0,
    };
    for (const card of cards) {
      if (card.Suit === Suit.Hearts) {
        x['Hearts'] += 1;
      } else if (card.Suit === Suit.Clubs) {
        x['Clubs'] += 1;
      } else if (card.Suit === Suit.Spades) {
        x['Spades'] += 1;
      } else if (card.Suit === Suit.Diamonds) {
        x['Diamonds'] += 1;
      }
    }

    const sortedSuits = Object.entries(x).sort((a, b) => b[1] - a[1]);
    const maxSuitValue = sortedSuits[0][1];
    if (maxSuitValue === 0) {
      return Suit.Hearts;
    }
    if (maxSuitValue === 1) {
      return Suit.Clubs;
    }
    if (maxSuitValue === 2) {
      return Suit.Spades;
    }
    if (maxSuitValue === 3) {
      return Suit.Diamonds;
    }
    return Suit.Hearts;
  }

  async dealRemainHandsToPlayers() {
    const currentRound = this.lastRound();
    const hokmSuit = currentRound.hokmSuit;
    log.cards(`hokm is chosen: [ HOKM: ${hokmSuit} ${hokmSuit} ${hokmSuit}] `);
    log.method('*** dealRemainHandsToPlayers()-Start');
    const cardDeck = currentRound.cardDeck;

    // THIS FUNCTION IS CALLED AFTER HAKEM CHOSEN THE HOKM AND
    // DEAL REMAINING HANDS TO PLAYERS(2*4 CARDS PER EACH PLAYER)
    const REMAINING_HANDS_COUNT = 2;
    for (let i = 0; i < REMAINING_HANDS_COUNT; i++) {
      for (let index = 0; index < PLAYERS_COUNT; index++) {
        const playerIndex = (currentRound.hakemIndex + index) % PLAYERS_COUNT;
        const hand = cardDeck.splice(0, 4);
        this.batchDealToPlayer(hand, playerIndex);
        await sleep(0.7);
      }
    }

    currentRound.cardDeck = cardDeck;
    const rounds = this.state.rounds;
    const newTrick_ = HokmTrickData.newTrick(
      currentRound.lastTrickIndex() + 1,
      currentRound.hakemIndex,
    );
    currentRound.tricks.push(newTrick_);

    rounds[this.lastRoundIndex()] = currentRound;

    this.setState(
      {
        gamePhase: GamePhase.TrickPlaying,
        rounds: rounds,
      },

      async () => {
        log.method('*** start calling playTrick()');
        await this.playTrick();
      },
    );

    log.method('*** dealRemainHandsToPlayers()-End');
  }

  async waitForHumanPlayerToSelectCardAsync(
    round: HokmRoundData,
  ): Promise<HokmRoundData> {
    log.method(`waitForHumanPlayerToSelectCardAsync - **START**`);
    const currentTrick = round.currentTrick();
    await new Promise<void>(resolve => {
      const checkPlayedOrNot = () => {
        if (currentTrick.clickedCard !== undefined) {
          resolve();
        } else {
          log.gInfo(`player has not chosen the card yet, wait for it`);
          setTimeout(checkPlayedOrNot, 1000);
        }
      };
      log.method(`waitForHumanPlayerToSelectCardAsync - **END**`);
      checkPlayedOrNot();
    });

    return round;
  }

  async humanPlayTrick(
    round: HokmRoundData,
    playerIndex: number,
  ): Promise<HokmRoundData> {
    let updatedRound = await this.waitForHumanPlayerToSelectCardAsync(round);
    const selectedCard = updatedRound.currentTrick().clickedCard!;
    updatedRound = this.pushCardFromHandToPitch(
      round,
      selectedCard,
      playerIndex,
    );

    updatedRound = this.updateLeadSuitIfNeed(
      playerIndex,
      selectedCard.Suit,
      updatedRound,
    );

    return updatedRound;
  }

  private pushCardFromHandToPitch(
    round: HokmRoundData,
    card: CardModel,
    playerIndex: number,
  ): HokmRoundData {
    log.method('*** PushCardFromHandToPitch()-  **Start**');

    const currentTrick = round.currentTrick();
    const currentPitchCards = currentTrick.pitchCards;

    log.cards(
      `pushing card:[${card.toLogString()}] from hand player:[${playerIndex}] to pitch: [${cardsToString(
        currentPitchCards,
      )} `,
    );

    currentPitchCards[playerIndex] = card;

    log.debug(`remove from player hand`);
    let playerHand: CardModel[] = [];
    switch (playerIndex) {
      case 0:
        playerHand = round.player1Hand;
        break;
      case 1:
        playerHand = round.player2Hand;
        break;
      case 2:
        playerHand = round.player3Hand;
        break;
      case 3:
        playerHand = round.player4Hand;
        break;
    }

    playerHand.splice(playerHand.indexOf(card), 1);
    log.method('*** PushCardFromHandToPitch()-  **END**');

    return round;
  }

  private updateLeadSuitIfNeed(
    playerIndex: number,
    suit: Suit,
    round: HokmRoundData,
  ): HokmRoundData {
    log.method('*** UpdateLeadSuitIfNeed()-  **Start**');
    const currentTrick = round.currentTrick();
    if (playerIndex === currentTrick.starterPlayerIndex) {
      log.info(
        'Human player is the first in the trick, and update the lead suit',
      );

      currentTrick.leadSuit = suit;
    }

    return round;
  }

  async playTrick() {
    log.method('*** playTrick()-Start');
    log.gInfo('artificial delay for 1 seconds');
    await sleep(10);
    let currentRound = this.lastRound();
    const trickIsOver = this.checkTrickIsOver(currentRound);

    if (trickIsOver) {
      this.goToCalculateTrickWinnerPhase();
      return;
    }

    const playerIndex = currentRound.currentTrick().turn;
    log.state(`trick is not over yet, Player turn to play:[${playerIndex}]`);

    if (playerIndex === HUMAN_PLAYER_INDEX) {
      currentRound = await this.humanPlayTrick(currentRound, playerIndex);
      this.updateStateAndPlayNextTrick(currentRound, playerIndex);
    } else {
      const bestCard = this.findBestPossibleCardToPlay(playerIndex);
      log.method(
        `find best possible card to play() finished by [${bestCard.toLogString()}]`,
      );

      currentRound = this.pushCardFromHandToPitch(
        currentRound,
        bestCard,
        playerIndex,
      );

      currentRound = this.updateLeadSuitIfNeed(
        playerIndex,
        bestCard.Suit,
        currentRound,
      );

      this.updateStateAndPlayNextTrick(currentRound, playerIndex);
    }

    log.method('*** playTrick()-End');
  }

  private checkTrickIsOver(round: HokmRoundData): boolean {
    const currentTrick = round.currentTrick();
    const currentPitchCards = currentTrick.pitchCards;

    log.cards(`current pitch card: [ ${cardsToString(currentPitchCards)} ]`);
    const numberOfNotPlayedCards = currentPitchCards.filter(
      x => x === null,
    ).length;
    log.gInfo(`currentPitchCards.length: ${currentPitchCards.length}`);

    const trickIsOver =
      currentPitchCards.length === 4 && numberOfNotPlayedCards === 0;
    return trickIsOver;
  }

  private updateStateAndPlayNextTrick(
    currentRound: HokmRoundData,
    playerIndex: number,
  ) {
    const currentTrick = currentRound.currentTrick();
    currentTrick.turn = (playerIndex + 1) % PLAYERS_COUNT;
    const rounds = this.state.rounds;
    rounds[this.lastRoundIndex()] = currentRound;

    this.setState(
      {
        rounds: rounds,
        gamePhase: GamePhase.TrickPlaying,
      },
      async () => await this.playTrick(),
    );
  }

  goToCalculateTrickWinnerPhase(): void {
    log.method(
      'Every one in the trick played, so, we go for calculate the winner',
    );

    this.setState(
      {gamePhase: GamePhase.TrickOverAndCalculateWinner},
      async () => {
        await this.calculateTrickWinner();
      },
    );
    return;
  }

  async calculateTrickWinner() {
    log.method('*** calculateWinner()-Start');
    const currentRound = this.lastRound();
    const currentTrick = currentRound.currentTrick();
    const pitchCards = currentTrick.pitchCards;
    const hokmSuit = currentRound.hokmSuit;

    log.cards(
      `start calculate the winner of the hands[${cardsToString(pitchCards)}]`,
    );

    const winnerIndex = this.getTrickWinnerIndex(
      pitchCards,
      currentTrick,
      hokmSuit!,
    );

    log.gInfo(
      `winner for the trick:[${currentTrick.trickNumber}] is playerIndex:[${winnerIndex}] of round ${currentRound.roundNumber}`,
    );
    currentTrick.winnerPlayerIndex = winnerIndex;
    currentTrick.isOver = true;

    if (winnerIndex === HUMAN_PLAYER_INDEX || winnerIndex === 2) {
      currentRound.team1_trickPoints++;
    } else {
      currentRound.team2_trickPoints++;
    }

    const rounds = this.state.rounds;
    rounds[this.lastRoundIndex()] = currentRound;
    this.setState(
      {
        rounds: rounds,
        gamePhase: GamePhase.CheckRoundIsOver,
      },
      async () => await this.checkRoundIsOver(),
    );

    log.method('*** calculateWinner()-End');
  }

  getNewHakemIndex(round: HokmRoundData): number {
    if (!round.isOver) {
      throw new Error(
        `round is not over yet roundIndex:[${round.roundNumber}]`,
      );
    }

    const lastHakemIndex = round.hakemIndex;
    if (round.winnerTeamIndex === 1) {
      if (lastHakemIndex === 0 || lastHakemIndex === 2) {
        log.info(
          `team 1 was the winner so they will stay hakem, HakemIndex:[${lastHakemIndex}]`,
        );
        return lastHakemIndex;
      } else {
        log.info(
          `team 1 was the winner, and they are new hakem, HakemIndex:[${lastHakemIndex}]`,
        );
        return (lastHakemIndex + 1) % PLAYERS_COUNT;
      }
    } else {
      if (lastHakemIndex === 1 || lastHakemIndex === 3) {
        log.info(
          `team 2 was the winner so they will stay hakem, HakemIndex:[${lastHakemIndex}]`,
        );
        return lastHakemIndex;
      } else {
        log.info(
          `team 2 was the winner, and they are new hakem, HakemIndex:[${lastHakemIndex}]`,
        );
        return (lastHakemIndex + 1) % PLAYERS_COUNT;
      }
    }
  }

  checkRoundIsOver(): void | PromiseLike<void> {
    const currentRound = this.lastRound();
    const team1Win = currentRound.team1_trickPoints === ROUND_WIN_SCORE;
    const team2Win = currentRound.team2_trickPoints === ROUND_WIN_SCORE;
    if (team1Win || team2Win) {
      currentRound.isOver = true;
      currentRound.winnerTeamIndex = team1Win ? 1 : 2;
      const rounds = this.state.rounds;
      rounds[this.lastRoundIndex()] = currentRound;

      if (team1Win) {
        this.setState(
          {
            rounds: rounds,
            team1_roundPoints: this.state.team1_roundPoints + 1,
            gamePhase: GamePhase.FindNextHakem,
          },
          async () => await this.goToNextRound(),
        );
      } else {
        this.setState(
          {
            rounds: rounds,
            team2_roundPoints: this.state.team2_roundPoints + 1,
            gamePhase: GamePhase.FindNextHakem,
          },
          async () => await this.goToNextRound(),
        );
      }
    } else {
      const lastTrick = currentRound.currentTrick();
      const starterPlayerIndex = lastTrick.winnerPlayerIndex;
      log.debug(`round is not over yet`);
      const newTrick = HokmTrickData.newTrick(
        currentRound.lastTrickIndex() + 1,
        starterPlayerIndex,
      );

      log.info(`last trick index: [${currentRound.lastTrickIndex()}]`);
      log.info(`last winner index: [${starterPlayerIndex}]`);
      log.info(`new trick is:[${newTrick.toString()}]`);
      currentRound.tricks.push(newTrick);
      const rounds = this.state.rounds;

      rounds[this.lastRoundIndex()] = currentRound;
      this.setState(
        {
          rounds: rounds,
          gamePhase: GamePhase.TrickPlaying,
        },
        async () => await this.playTrick(),
      );
    }
  }

  goToNextRound(): void | PromiseLike<void> {
    const newHakemIndex = this.getNewHakemIndex(this.lastRound());
    log.gInfo(`new hakem is playerIndex:[${newHakemIndex}]`);
    const rounds = this.state.rounds;

    const newRound = HokmRoundData.newRound(
      this.lastRoundIndex() + 1,
      newHakemIndex,
      shuffleDeck(),
    );

    rounds.push(newRound);
    this.setState(
      {
        rounds: rounds,
        gamePhase: GamePhase.DealFirstHandToHokm,
      },
      async () => await this.dealFirstHand(),
    );
  }

  getTrickWinnerIndex(
    pitchCards: (CardModel | null)[],
    trick: HokmTrickData,
    hokmSuit: Suit,
  ): number {
    const leadSuit = trick.leadSuit;
    const playedHokmCards = pitchCards.filter(
      card => card !== null && card.Suit === hokmSuit,
    ) as CardModel[];
    if (playedHokmCards.length > 0) {
      if (playedHokmCards.length === 1) {
        log.state(`Winner card is ${playedHokmCards[0].toLogString()}`);
        return pitchCards.indexOf(playedHokmCards[0]);
      }

      //find the max in played cards
      const maxCard = playedHokmCards.sort(
        (a, b) => b.GetRankValue() - a.GetRankValue(),
      )[0];
      log.state(`Winner card is ${maxCard.toLogString()}`);
      return pitchCards.indexOf(maxCard);
    } else {
      const winnerCard = pitchCards
        .filter(card => card !== null && card.Suit === leadSuit)
        .sort((a, b) => b!.GetRankValue() - a!.GetRankValue())[0];
      //find the max in suit cards
      log.state(`Winner card is ${winnerCard!.toLogString()}`);
      return pitchCards.indexOf(winnerCard);
    }
  }

  findBestPossibleCardToPlay(playerIndex: number): CardModel {
    log.method('*** findBestPossibleCardToPlay()-Start');
    const cardsInHand = this.getPlayerCardsInHand(playerIndex);
    const currentRound = this.lastRound();
    const currentTrick = currentRound.currentTrick();
    const pitchCards = currentTrick.pitchCards;

    log.debug(`staterPlayerIndex:[${currentTrick.starterPlayerIndex}]`);
    const isTrickStarterPlayer =
      currentTrick.starterPlayerIndex === playerIndex;

    if (isTrickStarterPlayer) {
      log.debug(
        `First player in trick so, select from all hand, try to find ace`,
      );
      const aceIndex = cardsInHand.findIndex(card => card.Rank === 'A');

      if (aceIndex !== -1) {
        log.debug(
          `found ace at index ${aceIndex}, [${cardsInHand[
            aceIndex
          ].toLogString()}] will play this for the current trick`,
        );
        return cardsInHand[aceIndex];
      } else {
        log.debug(`no ace found, so select the first high rank card`);
        //find the max card
        const firstHighRankCard = cardsInHand.sort(
          (a, b) => b.GetRankValue() - a.GetRankValue(),
        )[0];
        log.cards(
          `first high rank card is [${firstHighRankCard.toLogString()}]`,
        );
        return firstHighRankCard;
      }
    } else {
      log.debug(
        'not the first player in trick, so have to follow the suit or BORESH YA RAD',
      );
      const leadSuit = currentTrick.leadSuit;

      if (leadSuit === undefined) {
        log.error('lead suit is undefined');
      }

      log.state(`lead suit is: ${leadSuit}`);
      const cardsByLeadSuit = cardsInHand.filter(c => c.Suit === leadSuit);
      log.debug(`cards by lead suit count: [${cardsByLeadSuit.length}]`);
      if (cardsByLeadSuit.length === 0) {
        log.gInfo(
          `player ${playerIndex} has no card with lead suit:${leadSuit}, => BORESH YA RAD`,
        );
        const hokmCards = cardsInHand.filter(
          c => c.Suit === currentRound.hokmSuit,
        );
        if (hokmCards.length === 0) {
          log.gInfo(
            `player ${playerIndex} has no card with hokm suit ${currentRound.hokmSuit}, => RAD`,
          );
          const minCard = cardsInHand.reduce((prev, current) => {
            if (prev.GetRankValue() < current.GetRankValue()) {
              return prev;
            } else {
              return current;
            }
          });
          log.cards('picked for RAD', minCard.toLogString());
          return minCard;
        } else {
          log.gInfo(
            `player ${playerIndex} has hokm suit ${currentRound.hokmSuit}, => BORESH`,
          );
          log.method(`Find the minimum hokm card to BORESH`);

          const minHokmCardInHand = hokmCards.reduce((prev, current) => {
            if (prev.GetRankValue() < current.GetRankValue()) {
              return prev;
            } else {
              return current;
            }
          });
          log.cards('picked for BORESH', minHokmCardInHand.toLogString());
          return minHokmCardInHand;
        }
      } else {
        log.gInfo(
          `Player has lead suit ${leadSuit}, checking current player:[${currentTrick.turn}] has which turn in trick`,
        );
        const turnInTrick = pitchCards.filter(x => x !== null).length + 1;
        switch (
          turnInTrick //if is the second player in trick
        ) {
          case 2:
            log.debug('is the second player in trick');
            const playedCard = pitchCards.filter(
              c => c !== null && c.Suit === leadSuit,
            ) as CardModel[];

            const playCardValue = playedCard[0].GetRankValue();
            //if I have the lead card that is higher than only card in pitchCard
            const ledCardsGreaterThanPlayedCard = cardsByLeadSuit.filter(
              c => c.GetRankValue() >= playCardValue,
            );
            if (ledCardsGreaterThanPlayedCard.length === 0) {
              // No card higher than pitch
              //get the minimum of lead cards
              const zirCard = cardsByLeadSuit.reduce((prev, current) => {
                if (prev.GetRankValue() < current.GetRankValue()) {
                  return prev;
                } else {
                  return current;
                }
              });
              log.cards('picked for 2nd', zirCard.toLogString());
              return zirCard;
            } else {
              // has card higher than starter player
              //get the max of lead cards
              const maxCard = ledCardsGreaterThanPlayedCard.reduce(
                (prev, current) => {
                  if (prev.GetRankValue() > current.GetRankValue()) {
                    return prev;
                  } else {
                    return current;
                  }
                },
              );
              log.cards('picked for 2nd', maxCard.toLogString());
              return maxCard;
            }
          case 3:
            log.debug('is the third player in trick');
            //find random card and return for now
            const randomCard =
              cardsByLeadSuit[
                Math.floor(Math.random() * cardsByLeadSuit.length)
              ];
            log.cards('picked for 3rd', randomCard.toLogString());
            return randomCard;
          case 4:
            log.debug('is the fourth player in trick');
            //find random card and return for now
            const randomCard2 =
              cardsByLeadSuit[
                Math.floor(Math.random() * cardsByLeadSuit.length)
              ];
            log.cards('picked for 4th', randomCard2.toLogString());
            return randomCard2;
        }
      }
    }

    throw new Error("Can't find the best card to play");
  }

  getTheMaximumCardBySuit(card: CardModel[], suit: Suit): number {
    //return the index card in hand
    //filter cards by suit
    const cards = card.filter(c => c.Suit === suit);
    if (cards.length === 0) {
      return -1;
    } else {
      const maxCard = cards.reduce((prev, current) => {
        if (prev.GetRankValue() > current.GetRankValue()) {
          return prev;
        } else {
          return current;
        }
      });
      return card.indexOf(maxCard);
    }
  }

  getTheMinimumCardBySuit(card: CardModel[], suit: Suit): number {
    //return the index card in hand
    //filter cards by suit
    const cards = card.filter(c => c.Suit === suit);
    if (cards.length === 0) {
      return -1;
    } else {
      const minCard = cards.reduce((prev, current) => {
        if (prev.GetRankValue() < current.GetRankValue()) {
          return prev;
        } else {
          return current;
        }
      });
      return card.indexOf(minCard);
    }
  }

  singleDealToPlayer(hand: CardModel, playerIndex: number) {
    this.batchDealToPlayer([hand], playerIndex);
  }

  batchDealToPlayer(hand: CardModel[], playerIndex: number) {
    log.method(`Start batch deal to player ${playerIndex}`);
    const currentRound = this.lastRound();
    const rounds = this.state.rounds;

    switch (playerIndex) {
      case 0: {
        log.debug('batch deal to player1');
        currentRound.player1Hand = [...currentRound.player1Hand, ...hand];

        break;
      }
      case 1: {
        log.debug('batch deal to player2');
        currentRound.player2Hand = [...currentRound.player2Hand, ...hand];

        break;
      }
      case 2: {
        log.debug('batch deal to player3');
        currentRound.player3Hand = [...currentRound.player3Hand, ...hand];

        break;
      }
      case 3: {
        log.debug('batch deal to player4');
        currentRound.player4Hand = [...currentRound.player4Hand, ...hand];

        break;
      }
      default:
        return Error('Invalid playerIndex');
    }

    rounds[this.lastRoundIndex()] = currentRound;

    this.setState({
      rounds: rounds,
    });

    log.method(`Finish batch deal to player:[${playerIndex}]`);
  }

  renderGameNotStarted(): React.JSX.Element {
    return (
      <View style={styles.container}>
        <Button
          title="Start Game"
          onPress={async () => await this.onStartButtonPress()}
        />
      </View>
    );
  }
}

function sleep(durationInSeconds: number) {
  return new Promise(resolve => setTimeout(resolve, durationInSeconds * 100));
}

function toJson(obj: any) {
  const x = obj as HokmRoundData;
  if (x === null || x === undefined) {
    return JSON.stringify(obj, null, 2);
  }

  return x.toString();
}

function cardsToString(cards: (CardModel | null)[]): string {
  const handsToString = cards
    .map(card => (card === null ? '' : card.toLogString()))
    .join(', ');
  return `(${cards.length}) [ ${handsToString} ]`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    flex: 1,
    position: 'relative',
  },

  scoreBoard: {
    position: 'absolute',
  },

  northPlayer: {
    top: '-21.2%',
    transform: [{rotate: '180deg'}],
  },

  westPlayer: {
    left: '-85%',
    top: '45.5%',
    transform: [{rotate: '90deg'}],
  },

  eastPlayer: {
    left: '85%',
    top: '45.5%',
    transform: [{rotate: '270deg'}],
  },

  southPlayer: {
    top: '98%',
  },

  southPlayer_Playing: {
    top: '68%',
  },

  northPlayer_Playing: {
    top: '-54%',
    transform: [{rotate: '180deg'}],
  },

  eastPlayer_Playing: {
    left: '82.5%',
    top: '9%',
    transform: [{rotate: '270deg'}],
  },

  westPlayer_Playing: {
    left: '-82.5%',
    top: '11.5%',
    transform: [{rotate: '90deg'}],
  },

  northPlayer_InitHakem: {
    top: '-7%',
    left: '7%',
    transform: [{rotate: '180deg'}],
  },

  westPlayer_InitHakem: {
    left: '2%',
    top: '52%',
    transform: [{rotate: '270deg'}],
  },

  eastPlayer_InitHakem: {
    left: '-2%',
    top: '41%',
    transform: [{rotate: '90deg'}],
  },

  southPlayer_InitHakem: {
    top: '98%',
    left: '-6%',
  },
});

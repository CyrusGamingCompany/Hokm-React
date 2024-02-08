export enum GamePhase {
  NotStarted = 'NotStarted',
  Initial = 'Initial',
  InitHakem = 'InitHakem',
  WaitForHakemToChooseHokm = 'WaitForHakemToChooseHokm',
  DealFirstHandToHokm = 'DealFirstHandToHokm',

  DealRemainHandsToPlayers = 'DealRemainHandsToPlayers',
  TrickPlaying = 'TrickPlaying',

  TrickOverAndCalculateWinner = 'TrickOverAndCalculateWinner',

  CheckRoundIsOver = 'CheckRoundIsOver',
  RoundIsOver = 'RoundIsOver',
  FindNextHakem = 'FindNextHakem',
}

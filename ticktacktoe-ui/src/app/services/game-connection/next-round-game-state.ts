import { Player } from './player';
import { RoundResult } from 'src/app/types/round-result';

export interface NextRoundGameState {
    players: Player[];
    currentPlayer: Player;
    board: string[],
    roundResult: RoundResult;
    round: number;
}
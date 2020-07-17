﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;

namespace ticktacktoe.Games
{
    public interface IGamesService
    {
        string Create();

        void Delete(string gameId);

        Game Get(string gameId);

        PlayerConnectionResult ConnectPlayer(string gameId, string playerId, string playerName);

        void DisconectPlayer(string gameId, string playerId);

        MoveProcessingResult ProcessMove(string gameId, string playerId, int fieldPosition);

        NextRoundVoteResult VoteForNextRound(string gameId, string playerId, bool vote);
    }
}

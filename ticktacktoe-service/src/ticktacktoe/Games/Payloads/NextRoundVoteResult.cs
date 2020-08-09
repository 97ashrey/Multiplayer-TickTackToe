using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Types;

namespace ticktacktoe.Games.Payloads
{
    public class NextRoundVoteResult
    {
        public VoteStatus VoteStatus { get; set; }
        public NextRoundGameState GameState { get; set; }
    }
}

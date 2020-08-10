using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Games.Payloads;

namespace ticktacktoe.Types
{
    public class NextRoundVotes
    {
        private int maxVoteCount;

        private Dictionary<string, bool> votes = new Dictionary<string, bool>();

        public NextRoundVotes(int maxVoteCount)
        {
            this.maxVoteCount = maxVoteCount;
        }

        public bool Vote(string key, bool vote)
        {
            return this.votes.TryAdd(key, vote);
        }

        public void Clear()
        {
            this.votes.Clear();
        }

        public VoteStatus VoteStatus 
        {
            get {
                VoteStatus status = VoteStatus.WaitingForVotes;

                if (this.votes.Count == this.maxVoteCount && this.votes.Values.All(value => value == true))
                {
                    status = VoteStatus.NextRound;
                }
                else if (this.votes.Values.Any(value => value == false))
                {
                    status = VoteStatus.GameOver;
                }

                return status;
            } 
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Types;

namespace ticktacktoe.Entities
{
    public class GameEntity : IEntity
    {
        public string Id { get; set; }

        public List<PlayerEntity> Players { get; set; }

        public PlayerEntity CurrentPlayer { get; set; }

        public string[] Board { get; set; }

        public RoundResult RoundResult { get; set; }

        public int Round { get; set; }

        public Score Score { get; set; }

        public NextRoundVotes NextRoundVotes;
    }
}

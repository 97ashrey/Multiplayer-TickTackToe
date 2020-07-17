using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;
using ticktacktoe.Helpers;

namespace ticktacktoe.Games
{
    public class Game
    {
        public string Id { get; set; }

        public List<Player> Players { get; set; }

        public Player CurrentPlayer { get; set; }

        public string[] Board { get; set; }

        public bool RoundOver { get; set; }

        public int Round { get; set; }

        public Score Score { get; set; }

        //public Player PlayerOne { get => Players[0]; }

        //public Player PlayerTwo { get => Players[1]; }
    }
}

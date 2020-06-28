using FluentAssertions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using ticktacktoe.Entities;

namespace ticktacktoe_tests.Entities
{
    class GameStateTests
    {
        [Test]
        public void ID_GetterAndSetter_ShouldGetAndSetIDField()
        {
            // Arrange
            Guid expectedValue = Guid.NewGuid();

            GameState gameStateUnderTest = new GameState();

            // Act
            gameStateUnderTest.ID = expectedValue;

            // Assert
            gameStateUnderTest.ID.Should().Be(expectedValue);
        }

        [Test]
        public void Players_GetterAndSetter_ShouldGetAndSetPlayersField()
        {
            // Arrange
            List<Player> expectedValue = new List<Player>() { new Player() };

            GameState gameStateUnderTest = new GameState();

            // Act
            gameStateUnderTest.Players = expectedValue;

            // Assert
            gameStateUnderTest.Players.Should().ContainInOrder(expectedValue);
        }

        [Test]
        public void CurrentPlayer_GetterAndSetter_ShouldGetAndSetCurrentPlayerField()
        {
            // Arrange
            Player expectedValue = new Player();

            GameState gameStateUnderTest = new GameState();

            // Act
            gameStateUnderTest.CurrentPlayer = expectedValue;

            // Assert
            gameStateUnderTest.CurrentPlayer.Should().Be(expectedValue);
        }

        [Test]
        public void Board_GetterAndSetter_ShouldGetAndSetBoardField()
        {
            // Arrange
            List<string> expectedValue = new List<string>() { "x", "o" };

            GameState gameStateUnderTest = new GameState();

            // Act
            gameStateUnderTest.Board = expectedValue;

            // Assert
            gameStateUnderTest.Board.Should().ContainInOrder(expectedValue);
        }
    }
}

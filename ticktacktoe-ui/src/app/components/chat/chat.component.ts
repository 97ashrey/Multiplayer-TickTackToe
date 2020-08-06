import { Component, OnInit, Input, ViewChild, OnChanges, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { GameConnection } from 'src/app/services/game-connection/game-connection';
import { PlayerModel } from 'src/app/models/player.model';
import { ChatMessageModel } from 'src/app/models/chat-message.mode';
import { Player } from 'src/app/services/game-connection/player';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('messages') messagesContainer;

  @Input() gameConncetion: GameConnection;
  @Input() connectedPlayers: Player[];
  @Input() currentPlayer: PlayerModel;

  public chatMessages: ChatMessageModel[] = [];

  public messageValue = "";

  constructor() { }

  ngOnInit(): void {
    this.gameConncetion.onMessage((playerId: string, message: string) => {
      this.onMessageHandler(playerId, message);
    });
  }

  public enterHandler(): void {
    console.log(this.messageValue);
    if (this.messageValue === null || this.messageValue === "") {
      return;
    }

    const chatMessage: ChatMessageModel = {
      playerName: this.currentPlayer.name,
      playerId: this.currentPlayer.id,
      message: this.messageValue
    }

    this.pushMessage(chatMessage);
    this.gameConncetion.sendMessage(chatMessage.message);
    this.messageValue = '';
  }

  private onMessageHandler(playerId: string, message: string) {
    this.connectedPlayers.forEach(player => {
      if (player.id === playerId) {

        const chatMessage: ChatMessageModel = {
          playerName: player.name,
          playerId: playerId,
          message
        }
    
        this.pushMessage(chatMessage);
      }
    });
  }

  private pushMessage(chatMessage: ChatMessageModel): void {
    this.chatMessages.push(chatMessage);
    const scrollToBottomTimeOut = setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        clearTimeout(scrollToBottomTimeOut);
    }, 0);
  }
}

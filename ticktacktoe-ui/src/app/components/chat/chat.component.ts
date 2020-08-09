import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { GameConnection } from 'src/app/services/game-connection/game-connection';
import { PlayerModel } from 'src/app/models/player.model';
import { ChatMessage } from 'src/app/services/game-connection/chat-message';
import { Player } from 'src/app/services/game-connection/player';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messages') messagesContainer;

  @Input() gameConncetion: GameConnection;
  @Input() currentPlayer: PlayerModel;

  public chatMessages: ChatMessage[] = [];

  public messageValue = "";

  private subscriptions = new Subscription;

  constructor(private alertSerivce: AlertService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.gameConncetion.onMessage()
        .subscribe(chatMessage => this.pushMessage(chatMessage)));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public enterHandler(): void {
    console.log(this.messageValue);
    if (this.messageValue === null || this.messageValue === "") {
      return;
    }

    const chatMessage: ChatMessage = {
      playerName: this.currentPlayer.name,
      playerId: this.currentPlayer.id,
      message: this.messageValue
    }

    this.pushMessage(chatMessage);
    this.gameConncetion.sendMessage(chatMessage.message)
      .catch(error => {
        this.alertSerivce.showAlert({
          type: 'danger',
          text: 'An error occured'
        });
        this.chatMessages = this.chatMessages.filter(message => message != chatMessage);
      });
    this.messageValue = '';
  }

  private pushMessage(chatMessage: ChatMessage): void {
    this.chatMessages.push(chatMessage);
    const scrollToBottomTimeOut = setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        clearTimeout(scrollToBottomTimeOut);
    }, 0);
  }
}

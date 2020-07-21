import { Component, OnInit, ViewChild } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  @ViewChild('link') linkInput;

  public gameLink: Observable<string>

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
  }

  newGameClickHandler() {
    this.gameLink = this.gamesService.newGame();
  }

  copyClickHandler() {
    this.linkInput.nativeElement.select();
    
    document.execCommand('copy');
  }

}

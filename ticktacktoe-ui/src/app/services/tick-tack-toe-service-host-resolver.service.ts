import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TickTackToeServiceHostResolverService {

  constructor() { }

  getHost() {
    return environment.tickTackToeServiceHost;
  }

  getPort() {
    return environment.tickTackToeServicePort;
  }

  getUrl() {
    return `${environment.tickTackToeServiceHost}:${environment.tickTackToeServicePort}`;
  }
}

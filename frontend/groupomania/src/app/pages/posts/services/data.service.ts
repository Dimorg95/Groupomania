import { Injectable, EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  eventEmitterNotifier: EventEmitter<null> = new EventEmitter();

  notifyAboutChange() {
    this.eventEmitterNotifier.emit();
  }
}

//Event de notification pour l'actualisation de la page Post-List

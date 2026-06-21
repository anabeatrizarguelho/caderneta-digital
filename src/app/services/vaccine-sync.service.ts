import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface VaccineUpdateEvent {
  index?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VaccineSyncService {
  private vaccineUpdatedSubject = new Subject<VaccineUpdateEvent>();
  
  // Observable que emite quando as vacinas são atualizadas
  vaccineUpdated$ = this.vaccineUpdatedSubject.asObservable();

  constructor() { }

  // Notifica que as vacinas foram atualizadas; pode incluir índice do filho
  notifyVaccineUpdated(event: VaccineUpdateEvent = {}): void {
    this.vaccineUpdatedSubject.next(event);
  }
}

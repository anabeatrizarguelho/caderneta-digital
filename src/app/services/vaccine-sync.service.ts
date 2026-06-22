import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface VaccineUpdateEvent {
  index?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VaccineSyncService {
  // Usa ReplaySubject(1) para reemitir o último evento a assinantes tardios
  private vaccineUpdatedSubject = new ReplaySubject<VaccineUpdateEvent>(1);

  // Observable que emite quando as vacinas são atualizadas
  vaccineUpdated$ = this.vaccineUpdatedSubject.asObservable();

  constructor() { }

  // Notifica que as vacinas foram atualizadas; pode incluir índice do filho
  notifyVaccineUpdated(event: VaccineUpdateEvent = {}): void {
    this.vaccineUpdatedSubject.next(event);
  }
}

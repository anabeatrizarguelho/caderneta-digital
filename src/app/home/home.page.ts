import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { logOut } from 'ionicons/icons';
import { VaccineSyncService, VaccineUpdateEvent } from '../services/vaccine-sync.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Campaign {
  title: string;
  description: string;
  period: string;
}

interface Child {
  nome: string;
  idade: number;
  status: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonBadge, RouterLink, IonHeader, IonIcon, IonTitle, IonToolbar, IonButtons ],
})
export class HomePage implements OnDestroy {

  user: any = { nome: 'Usuário' };
  filhos: Child[] = [];
  summary = { total: 0, pendentes: 0, atrasadas: 0 };
  logOutIcon = logOut;

  private destroy$ = new Subject<void>();
  
  campaigns: Campaign[] = [
    {
      title: 'Campanha de Influenza',
      description: 'Vacinação para crianças de 6 meses a 5 anos.',
      period: 'Até 30/06',
    },
    {
      title: 'Campanha de Tríplice Viral',
      description: 'Atualize a vacinação contra sarampo, caxumba e rubéola.',
      period: 'Até 15/07',
    },
  ];

  constructor(
    private vaccineSyncService: VaccineSyncService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {
    // Se inscreve nos eventos de atualização de vacinas
    this.vaccineSyncService.vaccineUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: VaccineUpdateEvent) => {
        if (event && typeof event.index === 'number') {
          // Atualiza apenas o filho afetado
          const filhos = JSON.parse(localStorage.getItem('filhos') || '[]');
          const updatedFilho = filhos[event.index];
          if (updatedFilho) {
            this.filhos[event.index] = {
              ...updatedFilho,
              status: this.getChildOverviewStatus(updatedFilho),
            };
            this.updateSummary();
            this.changeDetectorRef.detectChanges();
            return;
          }
        }
        this.recarregarDados();
      });
  }

  ionViewWillEnter() {
    const userData = localStorage.getItem('user');
    const filhosData = localStorage.getItem('filhos');

    const user = userData ? JSON.parse(userData) : null;
    const filhos = filhosData ? JSON.parse(filhosData) : [];

    this.user = user || { nome: 'Usuário' };
    this.filhos = filhos.map((filho: any) => ({
      ...filho,
      status: this.getChildOverviewStatus(filho),
    }));

    this.updateSummary();
  }

  private recarregarDados() {
    const userData = localStorage.getItem('user');
    const filhosData = localStorage.getItem('filhos');

    const user = userData ? JSON.parse(userData) : null;
    const filhos = filhosData ? JSON.parse(filhosData) : [];

    this.user = user || { nome: 'Usuário' };
    this.filhos = filhos.map((filho: any) => ({
      ...filho,
      status: this.getChildOverviewStatus(filho),
    }));

    this.updateSummary();
    
    // Força a detecção de mudanças
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSummary() {
    this.summary.total = this.filhos.length;
    const vaccineCounts = this.countPendingAndOverdueVaccines();
    this.summary.pendentes = vaccineCounts.pending;
    this.summary.atrasadas = vaccineCounts.overdue;
  }

  private countPendingAndOverdueVaccines() {
    return this.filhos.reduce(
      (acc, filho: any) => {
        const ageMonths = (filho.idade || 0) * 12;
        const schedule = this.buildVaccineSchedule(ageMonths, filho.vacinas_aplicadas || {});
        schedule.forEach((item) => {
          if (item.status === 'Pendente') {
            acc.pending += 1;
          }
          if (item.status === 'Atrasada') {
            acc.overdue += 1;
          }
        });
        return acc;
      },
      { pending: 0, overdue: 0 }
    );
  }

  private getChildOverviewStatus(filho: any) {
    const today = new Date();
    const ageMonths = (filho.idade || 0) * 12;
    const schedule = this.buildVaccineSchedule(ageMonths, filho.vacinas_aplicadas || {});
    const overdue = schedule.some((item) => item.status === 'Atrasada');
    if (overdue) {
      return 'Atrasado';
    }
    const pending = schedule.some((item) => item.status === 'Pendente');
    return pending ? 'Pendente' : 'Em dia';
  }

  private buildVaccineSchedule(ageMonths: number, vacinesAplicadas: any) {
    const schedule = [
      { nome: 'BCG', idadeMeses: 0 },
      { nome: 'Hepatite B (ao nascer)', idadeMeses: 0 },
      { nome: 'Pentavalente 1ª dose', idadeMeses: 2 },
      { nome: 'Poliomielite VIP 1ª dose', idadeMeses: 2 },
      { nome: 'Rotavírus 1ª dose', idadeMeses: 2 },
      { nome: 'Pneumocócica 10 - 1ª dose', idadeMeses: 2 },
      { nome: 'Meningocócica C - 1ª dose', idadeMeses: 3 },
      { nome: 'Pentavalente 2ª dose', idadeMeses: 4 },
      { nome: 'Poliomielite VIP 2ª dose', idadeMeses: 4 },
      { nome: 'Rotavírus 2ª dose', idadeMeses: 4 },
      { nome: 'Pneumocócica 10 - 2ª dose', idadeMeses: 4 },
      { nome: 'Meningocócica C - 2ª dose', idadeMeses: 5 },
      { nome: 'Pentavalente 3ª dose', idadeMeses: 6 },
      { nome: 'Poliomielite VIP 3ª dose', idadeMeses: 6 },
      { nome: 'Influenza (gripe) - anual', idadeMeses: 6 },
      { nome: 'Febre Amarela', idadeMeses: 9 },
      { nome: 'Tríplice Viral 1ª dose', idadeMeses: 12 },
      { nome: 'Pneumocócica 10 - reforço', idadeMeses: 12 },
      { nome: 'Meningocócica C - reforço', idadeMeses: 12 },
      { nome: 'DTP (tríplice bacteriana) - reforço', idadeMeses: 15 },
      { nome: 'Poliomielite (reforço)', idadeMeses: 15 },
      { nome: 'Hepatite A', idadeMeses: 15 },
      { nome: 'Tetra Viral (ou segunda dose de sarampo)', idadeMeses: 15 },
      { nome: 'DTP - 2º reforço', idadeMeses: 48 },
      { nome: 'Poliomielite - 2º reforço', idadeMeses: 48 },
      { nome: 'HPV (2 doses)', idadeMeses: 120 },
      { nome: 'Meningocócica ACWY', idadeMeses: 132 },
    ];

    return schedule.map((item) => {
      if (vacinesAplicadas[item.nome]) {
        return { ...item, status: 'Aplicada' };
      }
      
      const monthsSince = ageMonths - item.idadeMeses;
      let status = 'Aguardando';
      if (monthsSince >= 0 && monthsSince < 6) {
        status = 'Pendente';
      }
      if (monthsSince >= 6) {
        status = 'Atrasada';
      }
      return { ...item, status };
    });
  }

  getBadgeColor(status: string) {
    if (status === 'Atrasado') {
      return 'danger';
    }
    if (status === 'Pendente') {
      return 'warning';
    }
    return 'success';
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  formatChildAge(ageYears: number | null | undefined): string {
    const age = ageYears || 0;
    const totalMonths = Math.round(age * 12);
    if (totalMonths < 12) {
      return `${totalMonths} meses`;
    }
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (months === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} meses`;
  }
}

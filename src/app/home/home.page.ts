import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonBadge, IonButton, IonContent } from '@ionic/angular/standalone';

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
  imports: [CommonModule, IonContent, IonButton, IonBadge, RouterLink],
})
export class HomePage {

  user: any = { nome: 'Usuário' };
  filhos: Child[] = [];
  summary = { total: 0, pendentes: 0, atrasadas: 0 };
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

  private updateSummary() {
    this.summary.total = this.filhos.length;
    this.summary.pendentes = this.filhos.filter((filho) => filho.status === 'Pendente').length;
    this.summary.atrasadas = this.filhos.filter((filho) => filho.status === 'Atrasado').length;
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
      { nome: 'Pentavalente 1ª dose', idadeMeses: 2 },
      { nome: 'Rotavírus 1ª dose', idadeMeses: 2 },
      { nome: 'Pneumocócica 10 - 1ª dose', idadeMeses: 2 },
      { nome: 'Pentavalente 2ª dose', idadeMeses: 4 },
      { nome: 'Rotavírus 2ª dose', idadeMeses: 4 },
      { nome: 'Pneumocócica 10 - 2ª dose', idadeMeses: 4 },
      { nome: 'Meningocócica C - 1ª dose', idadeMeses: 3 },
      { nome: 'Meningocócica C - 2ª dose', idadeMeses: 5 },
      { nome: 'Tríplice Viral 1ª dose', idadeMeses: 12 },
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
}

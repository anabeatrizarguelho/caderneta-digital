import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { checkmark } from 'ionicons/icons';
import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar, AlertController } from '@ionic/angular/standalone';
import { VaccineSyncService } from '../services/vaccine-sync.service';

interface VaccineItem {
  nome: string;
  descricao: string;
  idadeMeses: number;
  status: string;
}

@Component({
  selector: 'app-child-detail',
  templateUrl: './child-detail.page.html',
  styleUrls: ['./child-detail.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonList, IonBadge ],
})
export class ChildDetailPage {
  child: any = null;
  schedule: VaccineItem[] = [];
  index = 0;
  checkmark = checkmark;

  private vaccineDatabase = [
    {
      nome: 'BCG',
      descricao: 'Proteção contra tuberculose grave.',
      idadeMeses: 0,
      maxAgeMonths: 59,
    },
    {
      nome: 'Hepatite B (ao nascer)',
      descricao: 'Proteção contra hepatite B desde o nascimento.',
      idadeMeses: 0,
      maxAgeMonths: 59,
    },
    {
      nome: 'Pentavalente 1ª dose',
      descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib.',
      idadeMeses: 2,
      maxAgeMonths: 59,
    },
    {
      nome: 'Poliomielite VIP 1ª dose',
      descricao: 'Proteção contra poliomielite inativada.',
      idadeMeses: 2,
      maxAgeMonths: 59,
    },
    {
      nome: 'Rotavírus 1ª dose',
      descricao: 'Proteção contra diarreia grave por rotavírus.',
      idadeMeses: 2,
      maxAgeMonths: 24,
    },
    {
      nome: 'Pneumocócica 10 - 1ª dose',
      descricao: 'Proteção contra pneumonia e meningite.',
      idadeMeses: 2,
      maxAgeMonths: 59,
    },
    {
      nome: 'Meningocócica C - 1ª dose',
      descricao: 'Proteção contra meningite C.',
      idadeMeses: 3,
      maxAgeMonths: 59,
    },
    {
      nome: 'Pentavalente 2ª dose',
      descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib.',
      idadeMeses: 4,
      maxAgeMonths: 59,
    },
    {
      nome: 'Poliomielite VIP 2ª dose',
      descricao: 'Proteção contra poliomielite inativada.',
      idadeMeses: 4,
      maxAgeMonths: 59,
    },
    {
      nome: 'Rotavírus 2ª dose',
      descricao: 'Proteção contra diarreia grave por rotavírus.',
      idadeMeses: 4,
      maxAgeMonths: 24,
    },
    {
      nome: 'Pneumocócica 10 - 2ª dose',
      descricao: 'Proteção contra pneumonia e meningite.',
      idadeMeses: 4,
      maxAgeMonths: 59,
    },
    {
      nome: 'Meningocócica C - 2ª dose',
      descricao: 'Proteção contra meningite C.',
      idadeMeses: 5,
      maxAgeMonths: 59,
    },
    {
      nome: 'Pentavalente 3ª dose',
      descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib.',
      idadeMeses: 6,
      maxAgeMonths: 59,
    },
    {
      nome: 'Poliomielite VIP 3ª dose',
      descricao: 'Proteção contra poliomielite inativada.',
      idadeMeses: 6,
      maxAgeMonths: 59,
    },
    {
      nome: 'Influenza (gripe) - anual',
      descricao: 'Vacinação anual contra gripe.',
      idadeMeses: 6,
      maxAgeMonths: 132,
    },
    {
      nome: 'Febre Amarela',
      descricao: 'Proteção contra febre amarela.',
      idadeMeses: 9,
      maxAgeMonths: 132,
    },
    {
      nome: 'Tríplice Viral 1ª dose',
      descricao: 'Proteção contra sarampo, caxumba e rubéola.',
      idadeMeses: 12,
      maxAgeMonths: 240,
    },
    {
      nome: 'Pneumocócica 10 - reforço',
      descricao: 'Reforço contra pneumonia e meningite.',
      idadeMeses: 12,
      maxAgeMonths: 240,
    },
    {
      nome: 'Meningocócica C - reforço',
      descricao: 'Reforço contra meningite C.',
      idadeMeses: 12,
      maxAgeMonths: 240,
    },
    {
      nome: 'DTP (tríplice bacteriana) - reforço',
      descricao: 'Reforço contra difteria, tétano e coqueluche.',
      idadeMeses: 15,
      maxAgeMonths: 240,
    },
    {
      nome: 'Poliomielite (reforço)',
      descricao: 'Reforço contra poliomielite.',
      idadeMeses: 15,
      maxAgeMonths: 240,
    },
    {
      nome: 'Hepatite A',
      descricao: 'Proteção contra hepatite A.',
      idadeMeses: 15,
      maxAgeMonths: 240,
    },
    {
      nome: 'Tetra Viral (ou segunda dose de sarampo)',
      descricao: 'Proteção contra sarampo, caxumba, rubéola e varicela.',
      idadeMeses: 15,
      maxAgeMonths: 240,
    },
    {
      nome: 'DTP - 2º reforço',
      descricao: 'Segundo reforço contra difteria, tétano e coqueluche.',
      idadeMeses: 48,
      maxAgeMonths: 240,
    },
    {
      nome: 'Poliomielite - 2º reforço',
      descricao: 'Segundo reforço contra poliomielite.',
      idadeMeses: 48,
      maxAgeMonths: 240,
    },
    {
      nome: 'HPV (2 doses)',
      descricao: 'Vacinação contra HPV.',
      idadeMeses: 120,
      maxAgeMonths: 240,
    },
    {
      nome: 'Meningocócica ACWY',
      descricao: 'Proteção contra meningite meningocócica ACWY.',
      idadeMeses: 132,
      maxAgeMonths: 240,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private alertCtrl: AlertController,
    private vaccineSyncService: VaccineSyncService
  ) {}

  ionViewWillEnter() {
    const index = Number(this.route.snapshot.paramMap.get('index'));
    const filhos = JSON.parse(localStorage.getItem('filhos') || '[]');

    if (!filhos || !filhos[index]) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.child = filhos[index];
    this.index = index;
    this.buildAndFilterSchedule();
  }

  private buildAndFilterSchedule() {
    const ageMonths = (this.child.idade || 0) * 12;
    const vacinesAplicadas = this.child.vacinas_aplicadas || {};

    this.schedule = this.vaccineDatabase
      .filter((item) => ageMonths <= item.maxAgeMonths + 12)
      .map((item) => {
        const isApplied = vacinesAplicadas[item.nome];
        let status = 'Aguardando';

        if (isApplied) {
          status = 'Aplicada';
        } else if (ageMonths >= item.idadeMeses) {
          const monthsOverdue = ageMonths - item.idadeMeses;
          status = monthsOverdue > 6 ? 'Atrasada' : 'Pendente';
        }

        return {
          nome: item.nome,
          descricao: item.descricao,
          idadeMeses: item.idadeMeses,
          status,
        };
      })
      .sort((a, b) => a.idadeMeses - b.idadeMeses);
  }

  getBadgeColor(status: string) {
    if (status === 'Atrasada') {
      return 'danger';
    }
    if (status === 'Pendente') {
      return 'warning';
    }
    if (status === 'Aplicada') {
      return 'success';
    }
    return 'medium';
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

  async marcarComoAplicada(vaccine: VaccineItem) {
    if (vaccine.status === 'Aplicada') {
      const alert = await this.alertCtrl.create({
        header: 'Remover aplicação?',
        message: `Deseja remover o registro de aplicação de ${vaccine.nome}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Remover',
            handler: () => {
              this.removerAplicacao(vaccine);
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar aplicação',
        message: `Confirmar que ${vaccine.nome} foi aplicada?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.salvarAplicacao(vaccine);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  private salvarAplicacao(vaccine: VaccineItem) {
    if (!this.child.vacinas_aplicadas) {
      this.child.vacinas_aplicadas = {};
    }
    this.child.vacinas_aplicadas[vaccine.nome] = new Date().toISOString();
    this.atualizarDados();
  }

  private removerAplicacao(vaccine: VaccineItem) {
    delete this.child.vacinas_aplicadas[vaccine.nome];
    this.atualizarDados();
  }

  private atualizarDados() {
    const filhos = JSON.parse(localStorage.getItem('filhos') || '[]');
    filhos[this.index] = this.child;
    localStorage.setItem('filhos', JSON.stringify(filhos));

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.filhos = filhos;
    localStorage.setItem('user', JSON.stringify(user));

    // Notifica que as vacinas foram atualizadas (inclui índice do filho)
    this.vaccineSyncService.notifyVaccineUpdated({ index: this.index });

    this.buildAndFilterSchedule();
  }
}

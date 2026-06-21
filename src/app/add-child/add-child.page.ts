import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-child',
  templateUrl: './add-child.page.html',
  styleUrls: ['./add-child.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonItem, IonLabel, IonInput, FormsModule],
})
export class AddChildPage {

  nome = '';
  idade: number | null = null;

  constructor(private router: Router) {}

  salvar() {
    if (!this.nome || !this.idade) return;

    const novoFilho = {
      nome: this.nome,
      idade: this.idade,
      status: this.getInitialStatus(this.idade),
    };

    const filhos = JSON.parse(localStorage.getItem('filhos') || '[]');
    filhos.push(novoFilho);
    localStorage.setItem('filhos', JSON.stringify(filhos));

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      user.filhos = filhos;
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.router.navigateByUrl('/home');
  }

  private getInitialStatus(idade: number) {
    if (idade >= 4) {
      return 'Atenção';
    }
    return 'Em dia';
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonItem, IonLabel, IonInput, IonButton, RouterLink]
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private router: Router, private alertCtrl: AlertController) {}

  async login() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      await this.showAlert('Nenhum cadastro encontrado. Crie uma conta primeiro.');
      return;
    }

    const user = JSON.parse(userData);

    if (user.email === this.email && user.password === this.password) {
      const filhos = user.filhos || [];
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('filhos', JSON.stringify(filhos));
      this.router.navigateByUrl('/home');
      return;
    }

    await this.showAlert('E-mail ou senha incorretos.');
  }

  private async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

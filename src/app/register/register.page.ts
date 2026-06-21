import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class RegisterPage {

  nome = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  register() {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({
      nome: this.nome,
      email: this.email,
      password: this.password,
      filhos: []
    }));
    localStorage.setItem('filhos', JSON.stringify([]));

    this.router.navigateByUrl('/home');
  }
}
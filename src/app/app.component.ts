import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { logOut } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon],
})
export class AppComponent implements OnInit {
  logOutIcon = logOut;

  constructor(private alertCtrl: AlertController, private router: Router) {}

  ngOnInit() {
    this.updateMenuUserName();
  }

  private updateMenuUserName() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const menuUserName = document.getElementById('menu-user-name');
    if (menuUserName && user.nome) {
      menuUserName.textContent = `Olá, ${user.nome}`;
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair da conta',
      message: 'Tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          role: 'destructive',
          handler: () => {
            localStorage.clear();
            this.router.navigateByUrl('/login');
          },
        },
      ],
    });

    await alert.present();
  }
}

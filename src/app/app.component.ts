import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  IonApp,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonTitle,
  IonMenu,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonTitle,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonContent,
    IonToolbar,
    IonHeader,
    IonApp,
    IonRouterOutlet,
    IonMenu,
  ],
})
export class AppComponent {
  constructor(private menuCtrl: MenuController) {}

  async navigate(link: string) {
    await this.menuCtrl.close();
    window.location.href = link;
  }
}

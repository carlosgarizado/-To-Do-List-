import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { RemoteConfigService } from './core/services/remote-config';

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
export class AppComponent implements OnInit{
  public showCategory = false;
  private rcService = inject(RemoteConfigService);
  constructor(private menuCtrl: MenuController) {}

  async ngOnInit() {
    this.showCategory = await this.rcService.isCategoryVisible();
  }

  async navigate(link: string) {
    await this.menuCtrl.close();
    window.location.href = link;
  }
}

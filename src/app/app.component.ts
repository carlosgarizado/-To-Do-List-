import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  constructor(private menuCtrl: MenuController, private router: Router,private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    this.showCategory = await this.rcService.isCategoryVisible();
  }

  async navigate(link: string) {
    const menu = await this.menuCtrl.get('custom-menu'); 
    if (menu) {
      await menu.close(); 
    }
    this.router.navigate([link]);
  }
}

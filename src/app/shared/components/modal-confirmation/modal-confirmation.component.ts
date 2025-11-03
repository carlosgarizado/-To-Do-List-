import { Component, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonFooter,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonFooter,
    IonText,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
})
export class ModalConfirmationComponent {
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss(false, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss(true, 'confirm');
  }
}

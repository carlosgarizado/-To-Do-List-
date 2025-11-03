import { Component, Input, OnInit } from '@angular/core';
import { IonToolbar, IonButtons, IonTitle, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonTitle, IonButtons, IonMenuButton, IonToolbar]
})
export class HeaderComponent  implements OnInit {
 @Input() title : string = '';
  constructor() { }

  ngOnInit() {}

}

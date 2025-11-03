import { Component, Input, OnInit } from '@angular/core';
import { ICategory } from 'src/app/models/category.model';
import { IonChip, IonIcon, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-category-chip',
  templateUrl: './category-chip.component.html',
  styleUrls: ['./category-chip.component.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonChip]
})
export class CategoryChipComponent  implements OnInit {
  @Input() category!: ICategory;
  constructor() { }

  ngOnInit() {}

}

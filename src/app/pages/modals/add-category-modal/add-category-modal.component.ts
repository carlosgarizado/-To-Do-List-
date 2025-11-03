import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalController} from '@ionic/angular';
import { StorageService } from 'src/app/core/services/storage-service ';
import { ICategory } from 'src/app/models/category.model';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonSelectOption,
  IonSelect,
  IonFooter,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CATEGORY_COLORS, CATEGORY_ICONS } from 'src/app/constants/category.constants';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    IonFooter,
    IonNote,
    IonInput,
    IonLabel,
    IonItem,
    IonContent,
    IonButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonSelectOption,
    IonSelect,
  ],
})
export class AddCategoryModalComponent implements OnInit {
  @Input() editMode = false;
  @Input() category?: ICategory;
  form!: FormGroup;
  public colors = CATEGORY_COLORS;
  public icons = CATEGORY_ICONS;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.category?.id || crypto.randomUUID()],
      name: [
        this.category?.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
      color: [this.category?.color || null],
      icon: [this.category?.icon || null],
    });
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const category: ICategory = this.form.value;

    try {
      if (this.editMode) {
        await this.storageService.updateCategory(category);
      } else {
        await this.storageService.addCategory(category);
      }

      this.modalCtrl.dismiss(category, 'save');
    } catch (error) {
    }
  }

  get name() {
    return this.form.get('name');
  }
  get color() {
    return this.form.get('color');
  }
  get icon() {
    return this.form.get('icon');
  }
}
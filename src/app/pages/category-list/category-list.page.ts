import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonCard,
  IonIcon,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonText,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { AddCategoryModalComponent } from '../modals/add-category-modal/add-category-modal.component';
import { ICategory } from 'src/app/models/category.model';
import { StorageService } from 'src/app/core/services/storage-service ';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  providers: [ModalController],
  standalone: true,
  imports: [
    IonText,
    IonFabButton,
    IonFab,
    IonCardContent,
    IonIcon,
    IonCard,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
    HeaderComponent,
    CommonModule,
  ],
})
export class CategoryListPage implements OnInit {
  public title: string = 'Categorías';
  public categories: ICategory[] = [];
  public showAllTab: boolean = true;

  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  // Carga categorías desde el storage
  async loadCategories() {
    try {
      this.categories = await this.storageService.getCategories();
    } catch (error) {
      this.presentToast('Error cargando categorías', 'danger');
      this.categories = [];
    }
  }

  // Función genérica para mostrar un toast
  async presentToast(message: string, color: string = 'primary', duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      icon: 'checkmark-circle',
      buttons: [{ text: 'Cerrar', role: 'cancel' }],
    });
    await toast.present();
  }

  // Función genérica para pedir confirmación
  private async confirmAction(title: string, message: string): Promise<boolean> {
    const modal = await this.modalCtrl.create({
      component: ModalConfirmationComponent,
      componentProps: { title, message },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return !!data;
  }

  // Agregar categoría
  async addCategory() {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'save' && data) {
      this.categories.push(data);
      this.presentToast('¡Categoría creada correctamente!');
    }
  }

  // Editar categoría
  async editCategory(category: ICategory) {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
      componentProps: { editMode: true, category },
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'save' && data) {
      const confirmed = await this.confirmAction(
        'Actualizar categoría',
        `¿Deseas guardar los cambios en la categoría "${category.name}"? Todas las tareas asociadas se actualizarán.`
      );

      if (confirmed) {
        try {
          await this.storageService.updateCategory(data);
          await this.storageService.updateTasksByCategory(data.id, {
            name: data.name,
            color: data.color,
            icon: data.icon,
          });

          // Actualizamos la categoría en memoria
          const index = this.categories.findIndex(c => c.id === data.id);
          if (index > -1) this.categories[index] = data;

          this.presentToast('¡Categoría editada correctamente!');
        } catch (error) {
          this.presentToast('Error actualizando categoría', 'danger');
        }
      }
    }
  }

  // Eliminar categoría
  async deleteCategory(category: ICategory) {
    const confirmed = await this.confirmAction(
      'Eliminar categoría',
      `¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Todas las tareas asociadas se mostrarán como "Sin categoría".`
    );

    if (confirmed) {
      try {
        await this.storageService.deleteCategory(category.id);
        await this.storageService.updateTasksByCategory(category.id, null);

        // Eliminamos la categoría en memoria
        this.categories = this.categories.filter(c => c.id !== category.id);

        this.presentToast('¡Categoría eliminada correctamente!');
      } catch (error) {
        this.presentToast('Error eliminando categoría', 'danger');
      }
    }
  }
}

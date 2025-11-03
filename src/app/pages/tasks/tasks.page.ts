import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonSegmentButton,
  IonToolbar,
  IonIcon,
  IonSegment,
  IonLabel,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { TaskItemComponent } from 'src/app/shared/components/task-item/task-item.component';
import { ICategory } from 'src/app/models/category.model';
import { ITask } from 'src/app/models/task.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ModalController, ToastController } from '@ionic/angular';
import { AddTaskModalComponent } from '../modals/add-task-modal/add-task-modal.component';
import { StorageService } from 'src/app/core/services/storage-service ';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [
    IonFabButton,
    IonFab,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    TaskItemComponent,
    HeaderComponent,
  ],
})
export class TasksPage implements OnInit{
  public categories: ICategory[] = [];
  public selectedCategoryId: string = 'all';
  public tasks: ITask[] = [];
  public title: string = 'Tareas';

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  // Carga categorías y tareas desde el almacenamiento
  async loadData() {
    try {
      this.categories = await this.storageService.getCategories();
      this.tasks = await this.storageService.getTasks();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.presentToast('Error cargando tareas o categorías', 'danger');
    }
  }

  // Filtra tareas según la categoría seleccionada
  get filteredTasks(): ITask[] {
    if (this.selectedCategoryId === 'all') return this.tasks;
    if (this.selectedCategoryId === 'uncategorized') return this.tasks.filter(t => !t.category);
    return this.tasks.filter(t => t.category?.id === this.selectedCategoryId);
  }

  // Cambia la categoría seleccionada
  selectCategory(id: string) {
    this.selectedCategoryId = id;
  }

  // Alterna el estado completado de una tarea
  async toggleTask(task: ITask) {
    task.completed = !task.completed;
    try {
      await this.storageService.updateTask(task);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      this.presentToast('Error actualizando tarea', 'danger');
      task.completed = !task.completed; // revertir cambio en UI
    }
  }

  // Método centralizado para pedir confirmación
  private async confirmAction(title: string, message: string): Promise<boolean> {
    const modal = await this.modalCtrl.create({
      component: ModalConfirmationComponent,
      componentProps: { title, message },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return !!data;
  }

  // Elimina una tarea después de confirmación
  async removeTask(task: ITask) {
    const confirmed = await this.confirmAction(
      'Eliminar tarea',
      `¿Estás seguro de que deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await this.storageService.deleteTask(task.id);
      this.tasks = this.tasks.filter(t => t.id !== task.id); // actualizar en memoria
      this.presentToast('¡Tarea eliminada correctamente!');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      this.presentToast('Error eliminando tarea', 'danger');
    }
  }

  // Abre modal para agregar nueva tarea
  async addTask() {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      componentProps: { categories: this.categories },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.tasks.push(data); // agregar en memoria sin recargar toda la lista
      this.presentToast('¡Tarea creada correctamente!');
    }
  }

  // Abre modal para editar tarea existente
  async editTask(task: ITask) {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      componentProps: {
        task,
        categories: this.categories,
        editMode: true,
      },
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      // actualizar tarea en memoria
      const index = this.tasks.findIndex(t => t.id === data.id);
      if (index > -1) this.tasks[index] = data;
      this.presentToast('¡Tarea editada correctamente!');
    }
  }

  // Muestra un toast genérico
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
}
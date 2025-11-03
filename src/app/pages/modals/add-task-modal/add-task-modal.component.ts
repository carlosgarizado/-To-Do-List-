import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/core/services/storage-service ';
import { ICategory } from 'src/app/models/category.model';
import { ITask } from 'src/app/models/task.model';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonFooter,
    IonNote,
    IonInput,
    IonLabel,
    IonItem,
    IonContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonSelect,
    IonSelectOption,
  ],
})
export class AddTaskModalComponent implements OnInit {
  @Input() categories: ICategory[] = [];
  @Input() editMode: boolean = false;
  @Input() task?: ITask;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // Inicializa el formulario con validaciones
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: [null],
    });

    // Si estamos en modo edición, se rellenan los valores del formulario
    if (this.editMode && this.task) {
      this.form.patchValue({
        title: this.task.title,
        categoryId: this.task.category?.id || null,
      });
    }
  }

  // Cierra el modal sin guardar
  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Método centralizado para pedir confirmación al usuario
  private async confirmAction(title: string, message: string): Promise<boolean> {
    const modal = await this.modalCtrl.create({
      component: ModalConfirmationComponent,
      componentProps: { title, message },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return !!data;
  }

  // Guarda la tarea (nueva o editada)
  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marca todos los campos para mostrar errores
      return;
    }

    const { title, categoryId } = this.form.value;
    const category = this.categories.find(c => c.id === categoryId) || null;

    try {
      if (this.editMode && this.task) {
        // Confirmación antes de actualizar
        const confirmed = await this.confirmAction(
          'Actualizar tarea',
          `¿Deseas guardar los cambios en la tarea "${this.task.title}"?`
        );
        if (!confirmed) return;

        // Creamos el objeto actualizado
        const updatedTask: ITask = {
          ...this.task,
          title,
          category,
        };

        await this.storageService.updateTask(updatedTask);
        this.modalCtrl.dismiss(updatedTask, 'save');

      } else {
        // Crear nueva tarea
        const newTask: ITask = {
          id: Date.now().toString(),
          title,
          completed: false,
          category,
        };

        await this.storageService.addTask(newTask);
        this.modalCtrl.dismiss(newTask, 'save');
      }
    } catch (error) {
      console.error('Error guardando tarea:', error);
    }
  }

  get title() {
    return this.form.get('title');
  }

  get categoryId() {
    return this.form.get('categoryId');
  }
}

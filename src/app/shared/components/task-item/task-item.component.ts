import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon, IonCheckbox, IonLabel, IonItem, IonCard } from "@ionic/angular/standalone";
import { ITask } from 'src/app/models/task.model';
import { CommonModule } from '@angular/common';
import { CategoryChipComponent } from '../category-chip/category-chip.component';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  imports: [IonCard, IonCheckbox, IonIcon, IonLabel, IonItem, CommonModule, CategoryChipComponent]
})
export class TaskItemComponent implements OnInit {
  @Input() task!: ITask;
  @Output() toggleComplete = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<ITask>();
  @Output() editTask = new EventEmitter<ITask>();

  constructor() {}

  ngOnInit() {}

  onToggleComplete() {
    this.toggleComplete.emit(this.task);
  }

  onDelete() {
    this.deleteTask.emit(this.task);
  }

  onEdit() {
    this.editTask.emit(this.task);
  }
}

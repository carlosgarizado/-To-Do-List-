import { Injectable } from '@angular/core';
import { ICategory } from 'src/app/models/category.model';
import { ITask } from 'src/app/models/task.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  constructor(private storage: Storage) {}

  private async ensureInitialized() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  async addTask(task: ITask): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    tasks.push(task);
    await this._storage?.set(this.TASKS_KEY, tasks);
  }

  async getTasks(): Promise<ITask[]> {
    await this.ensureInitialized();
    return (await this._storage?.get(this.TASKS_KEY)) || [];
  }

  async updateTask(updated: ITask): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === updated.id);
    if (index > -1) {
      tasks[index] = updated;
      await this._storage?.set(this.TASKS_KEY, tasks);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    await this._storage?.set(this.TASKS_KEY, filtered);
  }

  async addCategory(category: ICategory): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    categories.push(category);
    await this._storage?.set(this.CATEGORIES_KEY, categories);
  }

  async getCategories(): Promise<ICategory[]> {
    await this.ensureInitialized();
    return (await this._storage?.get(this.CATEGORIES_KEY)) || [];
  }

  async updateCategory(updated: ICategory): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    const index = categories.findIndex((c) => c.id === updated.id);
    if (index > -1) {
      categories[index] = updated;
      await this._storage?.set(this.CATEGORIES_KEY, categories);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== categoryId);
    await this._storage?.set(this.CATEGORIES_KEY, filtered);
  }

  async updateTasksByCategory(categoryId: string, updatedCategory: Partial<ICategory> | null) {
    const tasks = (await this.storage.get('tasks')) || [];
    const updatedTasks = tasks.map((task: any) => {
      if (task.category && task.category.id === categoryId) {
        return {
          ...task,
          category: updatedCategory ? { ...task.category, ...updatedCategory } : null,
        };
      }
      return task;
    });
    await this.storage.set('tasks', updatedTasks);
  }  
}
import { ICategory } from "./category.model";

export interface ITask {
    id: string;
    title: string;
    completed: boolean;
    category?: ICategory | null;
  }
  
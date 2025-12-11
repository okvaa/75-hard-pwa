// src/db/index.ts
import Dexie, { Table } from "dexie";

export interface ExerciseLog {
  key: string;
  completed: boolean;
  sets: {
    weight: string;
    reps: string;
    machine: string;
    pain?: number;
  }[];
}

class WorkoutDB extends Dexie {
  exerciseLogs!: Table<ExerciseLog, string>;

  constructor() {
    super("WorkoutDB");
    this.version(1).stores({
      exerciseLogs: "key",
    });
  }
}

export const db = new WorkoutDB();

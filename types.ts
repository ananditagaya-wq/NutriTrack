export type Meal = {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity?: string;
  source?: "search" | "smart" | "manual";
  createdAt: string;
};

export type WaterLog = {
  id: string;
  amount: number;
  createdAt: string;
};

export type EyeBreak = {
  id: string;
  completedAt: string;
};

export type WellnessState = {
  meals: Meal[];
  waterLogs: WaterLog[];
  eyeBreaks: EyeBreak[];
};

export type Food = {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: string[];
};

export const foods: Food[] = [
  { id: "egg", name: "Egg", serving: "1 large", calories: 72, protein: 6.3, carbs: 0.4, fats: 4.8, tags: ["breakfast", "protein"] },
  { id: "milk", name: "Milk", serving: "250 ml", calories: 150, protein: 8, carbs: 12, fats: 8, tags: ["breakfast", "drink"] },
  { id: "brown-bread", name: "Brown Bread", serving: "2 slices", calories: 140, protein: 6, carbs: 24, fats: 2, tags: ["breakfast"] },
  { id: "oats", name: "Oats", serving: "60 g", calories: 228, protein: 7.8, carbs: 40.6, fats: 4.1, tags: ["breakfast"] },
  { id: "rice", name: "Cooked Rice", serving: "150 g", calories: 195, protein: 4, carbs: 42, fats: 0.5, tags: ["lunch", "dinner"] },
  { id: "dal", name: "Yellow Dal", serving: "200 g", calories: 230, protein: 14, carbs: 36, fats: 4, tags: ["lunch", "vegetarian"] },
  { id: "paneer", name: "Paneer", serving: "100 g", calories: 265, protein: 18.3, carbs: 6.1, fats: 20.8, tags: ["lunch", "dinner", "vegetarian"] },
  { id: "soya", name: "Soya Chunks", serving: "50 g dry", calories: 172, protein: 26, carbs: 16, fats: 0.5, tags: ["protein", "vegetarian"] },
  { id: "roti", name: "Roti", serving: "1 medium", calories: 104, protein: 3, carbs: 18, fats: 2.5, tags: ["lunch", "dinner"] },
  { id: "chicken-breast", name: "Chicken Breast", serving: "100 g cooked", calories: 165, protein: 31, carbs: 0, fats: 3.6, tags: ["protein", "lunch", "dinner"] },
  { id: "chicken-salad", name: "Chicken Salad", serving: "1 bowl", calories: 500, protein: 56, carbs: 90, fats: 23, tags: ["lunch", "dinner"] },
  { id: "banana", name: "Banana", serving: "1 medium", calories: 105, protein: 1.3, carbs: 27, fats: 0.4, tags: ["snack"] },
  { id: "apple", name: "Apple", serving: "1 medium", calories: 95, protein: 0.5, carbs: 25, fats: 0.3, tags: ["snack"] },
  { id: "peanut-butter", name: "Peanut Butter", serving: "2 tbsp", calories: 190, protein: 8, carbs: 7, fats: 16, tags: ["snack", "protein"] }
];

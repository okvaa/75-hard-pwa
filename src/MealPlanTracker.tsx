import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";

const mealPlan = {
  Monday: [
    "🍳 Breakfast: 3 eggs + oatmeal + berries",
    "🥗 Lunch: Grilled chicken, quinoa, broccoli",
    "🍎 Snack: Greek yogurt + almonds",
    "🥩 Dinner: Salmon, sweet potato, asparagus",
  ],
  Tuesday: [
    "🍳 Breakfast: Protein shake + banana",
    "🥗 Lunch: Turkey wrap + mixed greens",
    "🍎 Snack: Cottage cheese + pineapple",
    "🥩 Dinner: Lean beef, rice, green beans",
  ],
  Wednesday: [
    "🍳 Breakfast: Omelet + avocado toast",
    "🥗 Lunch: Chicken Caesar salad (light dressing)",
    "🍎 Snack: Protein bar + apple",
    "🥩 Dinner: Grilled cod, couscous, spinach",
  ],
  Thursday: [
    "🍳 Breakfast: Overnight oats + peanut butter",
    "🥗 Lunch: Shrimp stir fry + brown rice",
    "🍎 Snack: Hard boiled eggs + carrots",
    "🥩 Dinner: Pork tenderloin, potatoes, green beans",
  ],
  Friday: [
    "🍳 Breakfast: Smoothie (protein + fruit + spinach)",
    "🥗 Lunch: Tuna wrap + side salad",
    "🍎 Snack: Hummus + veggie sticks",
    "🥩 Dinner: Grilled chicken, quinoa, roasted peppers",
  ],
  Saturday: [
    "🍳 Breakfast: Egg white scramble + toast",
    "🥗 Lunch: Salmon poke bowl",
    "🍎 Snack: Protein shake + nuts",
    "🥩 Dinner: Turkey burgers + roasted zucchini",
  ],
  Sunday: [
    "🍳 Breakfast: Pancakes (protein-based) + berries",
    "🥗 Lunch: Chicken tacos (corn tortillas)",
    "🍎 Snack: Greek yogurt + fruit",
    "🥩 Dinner: Steak, baked potato, salad",
  ],
};

export default function MealPlanTracker() {
  const [completed, setCompleted] = useState({});

  // Load progress
  useEffect(() => {
    const stored = localStorage.getItem("mealPlanProgress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("mealPlanProgress", JSON.stringify(completed));
  }, [completed]);

  const toggleMeal = (day: string, meal: string) => {
    setCompleted((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: !prev[day]?.[meal],
      },
    }));
  };

  const resetDietProgress = () => {
    setCompleted({});
    localStorage.removeItem("mealPlanProgress");
  };

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="space-y-4 max-h-[70vh] p-2">
        {Object.entries(mealPlan).map(([day, meals]) => (
          <Card key={day} className="rounded-xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-2">{day}</h2>
              <ul className="space-y-2 text-sm">
                {meals.map((meal) => (
                  <li key={meal} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!completed[day]?.[meal]}
                      onCheckedChange={() => toggleMeal(day, meal)}
                    />
                    {meal}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      {/* Reset Button */}
      <Button
        variant="destructive"
        onClick={resetDietProgress}
        className="w-full"
      >
        Reset Diet Progress
      </Button>
    </div>
  );
}

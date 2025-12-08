export function exportWeekToCSV(weekName: string, completedState: Record<string, any>) {
  const rows = [
    ["Day", "Exercise", "Machine", "Set", "Weight", "Reps", "Completed"]
  ];

  for (const key in completedState) {
    const entry = completedState[key];
    const [day, exercise] = key.split("::");

    // Outdoor entries
    if (key.endsWith("outdoor")) {
      rows.push([
        day,
        "Outdoor",
        "",
        "",
        "",
        "",
        entry.completed ? "Yes" : "No"
      ]);
      continue;
    }

    // Normal gym exercises with sets
    entry.sets.forEach((set: any, index: number) => {
      rows.push([
        day,
        exercise,
        entry.machine || "",
        (index + 1).toString(),
        set.weight || "",
        set.reps || "",
        entry.completed ? "Yes" : "No",
      ]);
    });
  }

  // Convert to CSV string
  const csvContent = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${weekName}.csv`;
  a.click();
}

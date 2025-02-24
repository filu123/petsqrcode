export function calculateNextDueDate(startDate: string, frequency: string): Date {
  const start = new Date(startDate);
  const now = new Date();
  const monthsToAdd = {
    monthly: 1,
    bimonthly: 2,
    quarterly: 3,
    biannually: 6,
    annually: 12
  }[frequency] || 1;

  let nextDate = new Date(start);
  while (nextDate <= now) {
    nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
  }

  return nextDate;
}
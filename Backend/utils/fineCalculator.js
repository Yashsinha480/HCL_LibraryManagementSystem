export const calculateFine = (dueDate, returnDate = new Date()) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  const overdueDays = Math.max(0, Math.ceil((returned - due) / msPerDay));

  return {
    overdueDays,
    fineAmount: overdueDays * 10
  };
};

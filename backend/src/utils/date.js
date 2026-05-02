// Returns today's date as YYYY-MM-DD in the server's local timezone.
// Local time (not UTC) so "today" matches the user's day-of-month near midnight.
export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

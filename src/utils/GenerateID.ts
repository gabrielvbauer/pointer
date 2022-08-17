export function generateDateId() {
  return `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
};

export const startOfDay = (date = new Date()) =>
  new Date(new Date(date).setHours(0, 0, 0, 0));

export const isToday = (date = new Date()) =>
  startOfDay(date).getTime() === startOfDay().getTime();

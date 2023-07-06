export const getRandomNumber = (length: number): number => {
  const randomNumber = Math.random() * length;
  return Math.floor(randomNumber);
};

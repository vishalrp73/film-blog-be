export const sanitizeTerm = (term: string): string => {
  const splitTerm = decodeURIComponent(term).split(' ');
  const firstLetters = splitTerm.map((word) => word.charAt(0).toUpperCase());
  const restOfLetters = splitTerm.map((word) => word.slice(1));
  const Uppercased = firstLetters.map(
    (letter, index) => `${letter}${restOfLetters[index]}`,
  );
  return Uppercased.join(' ');
};

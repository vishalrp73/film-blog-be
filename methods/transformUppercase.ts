export const transformUppercase = (term: string): string => {
  const splitTerm = decodeURIComponent(term).split(' ');
  const upperCased = splitTerm.map((word) => word.toUpperCase());
  return upperCased.join(' ');
};

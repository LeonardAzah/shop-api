export const extactFormText = (text: string, regex: RegExp) => {
  const matches = text.match(regex);
  const lastIndext = matches.length - 1;
  return matches[lastIndext];
};

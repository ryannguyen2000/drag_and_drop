export const getPastelColor = (index: number, nums_of_col: number) => {
  const colors = ["#355C7D", "#769FCD", "#B9D7EA", "#D6E6F2"];
  return colors[index % nums_of_col];
};

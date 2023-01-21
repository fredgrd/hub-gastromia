// Splits the number in the whole and fractional part (before and after the decimal)
const formatPrice = (price: number): { whole: string; fractional: string } => {
  const splitPrice = (price / 1000).toFixed(2).split(".");
  return { whole: splitPrice[0], fractional: splitPrice[1] };
};

export default formatPrice;

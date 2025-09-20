export const formatAmount = value => {
  let cleanedValue = value.replace(/[^0-9.]/g, '');
  let [integer, decimal] = cleanedValue.split('.');
  if (integer) {
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return decimal ? `${integer}.${decimal}` : integer;
};

export const removeCommas = val => val.replace(/,/g, '');

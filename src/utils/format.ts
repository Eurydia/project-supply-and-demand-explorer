export const formatMetric = (value: number) => {
  return value.toLocaleString('th-TH', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });
};

export const formatTick = (value: number) => {
  return value.toLocaleString('th-TH', { maximumFractionDigits: 1 });
};

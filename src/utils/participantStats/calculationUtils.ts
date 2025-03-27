
// Helper function to calculate percentile
export function calculatePercentile(value: number, dataset: number[]): number {
  if (dataset.length === 0) return 50; // Default to middle if no data

  // Count how many values are less than our value
  const count = dataset.filter((item) => item < value).length;
  return Math.round((count / dataset.length) * 100);
}

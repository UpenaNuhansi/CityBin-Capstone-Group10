export const getFillColor = (percent) => {
  if (percent >= 90) return '#ff4d4d'; // Red for very full
  if (percent >= 80) return '#ffcc00'; // Yellow for moderately full
  return '#4cd964'; // Green for less full
};
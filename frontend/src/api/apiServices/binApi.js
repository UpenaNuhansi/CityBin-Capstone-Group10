import api from "../axios";

// Fetch all bins
export const getAllBins = async () => {
  const res = await api.get('/bins');
  console.log('API response:', res.data); // Debug
  return res;
};

// Create a new bin
export const createBin = (payload) => {
  return api.post('/bins', payload);
};

// Update a bin
export const updateBin = (binId, updatedData) => api.put(`/bins/${binId}`, updatedData);

// Assign maintenance
export const assignMaintenance = (binId, operatorId) =>
  api.post(`/bins/${binId}/maintenance`, { operatorId });

// Update bin status and auto-unassign operator if status = "OK"
export const updateBinStatus = (binId, status) => 
  api.put(`/bins/${binId}/status`, { status });

// Delete a bin
export const deleteBin = (binId) => api.delete(`/bins/${binId}`);
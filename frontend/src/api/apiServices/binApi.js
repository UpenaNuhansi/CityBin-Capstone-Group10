// import api from "../axios";

// // Fetch all bins
// export const getAllBins = async () => {
//   const res = await api.get('/bins');
//   console.log('API response:', res.data); // Debug
//   return res;
// };

// // Create a new bin
// export const createBin = (payload) => {
//   return api.post('/bins', payload);
// };

// // Update a bin
// export const updateBin = (binId, updatedData) => api.put(`/bins/${binId}`, updatedData);

// // Assign maintenance
// export const assignMaintenance = (binId, operatorId) =>
//   api.post(`/bins/${binId}/maintenance`, { operatorId });

// // Update bin status and auto-unassign operator if status = "OK"
// export const updateBinStatus = (binId, status) => 
//   api.put(`/bins/${binId}/status`, { status });

// // Delete a bin
// export const deleteBin = (binId) => api.delete(`/bins/${binId}`);

// export const getBinsAssignedToOperator = async (operatorId) => {
//   try {
//     const response = await api.get(`/bins/assigned/${operatorId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch assigned bins:", error);
//     throw error;
//   }
// };



import api from '../axios';

export const getAllBins = async () => {
  const token = localStorage.getItem('token');
  const res = await api.get('/bins', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createBin = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await api.post('/bins', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const updateBin = async (binId, payload) => {
  const token = localStorage.getItem('token');
  const res = await api.put(`/bins/${binId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const assignMaintenance = async (binId, operatorId) => {
  const token = localStorage.getItem('token');
  const res = await api.post(
    `/bins/${binId}/maintenance`,
    { operatorId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getBinsAssignedToOperator = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  try {
    const res = await api.get('/bins/assigned-to-operator', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch assigned bins:', error.response?.data || error.message);
    throw error;
  }
};

export const getBinById = async (binId) => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/bins/${binId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteBin = async (binId) => {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/bins/${binId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
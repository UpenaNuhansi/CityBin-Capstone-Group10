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
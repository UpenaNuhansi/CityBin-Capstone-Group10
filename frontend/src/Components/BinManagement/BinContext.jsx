import { createContext, useState, useEffect } from "react";
import { getAllBins, getBinsAssignedToOperator } from "/src/api/apiServices/binApi";
import { toast } from "react-toastify";

export const BinContext = createContext();

export const BinProvider = ({ children }) => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true); 

  const fetchBins = async () => {
    try {
      setLoading(true);
  
      let user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id && user._id) user.id = user._id;
  
      if (!user.id || !user.role) {
        toast.error('Session expired or invalid. Please log in again.');
        window.location.href = '/login';
        return;
      }
  
      let res;
      if (user.role === 'Operator') {
        res = await getBinsAssignedToOperator();
      } else if (user.role === 'Admin') {
        res = await getAllBins(); 
      } else {
        throw new Error('Invalid user role');
      }
  
      const bins = res.data || res || [];
      const filteredBins = Array.isArray(bins)
        ? bins.filter(bin =>
            bin.coordinates &&
            typeof bin.coordinates.lat === 'number' &&
            typeof bin.coordinates.lng === 'number')
        : [];
  
      setBinData(filteredBins);
    } catch (err) {
      console.error('Error fetching bins:', err);
      toast.error('Failed to load bins');
      setBinData([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (isAuthorized) {
      fetchBins();
    }
  }, [isAuthorized]); // only run fetch if authorized

  return (
    <BinContext.Provider value={{ binData, setBinData, fetchBins, loading }}>
      {children}
    </BinContext.Provider>
  );
};

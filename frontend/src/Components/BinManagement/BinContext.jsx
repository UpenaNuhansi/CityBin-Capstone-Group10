// import { createContext, useState, useEffect } from "react";
// import { getAllBins, getBinsAssignedToOperator } from "/src/api/apiServices/binApi";
// import { toast } from "react-toastify";

// export const BinContext = createContext();

// export const BinProvider = ({ children }) => {
//   const [binData, setBinData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [stats, setStats] = useState({
//   //   total: 0,
//   //   active: 0,
//   //   full: 0,
//   //   maintenance: 0,
//   // });

//   const fetchBins = async () => {
//     try {
//       setLoading(true);
//       let user = JSON.parse(localStorage.getItem('user') || '{}');
//       if (!user.id && user._id) user.id = user._id;
//       localStorage.setItem('user', JSON.stringify(user));
//       console.log('BinContext: user from localStorage:', user);
//       if ((!user.id || !user.role) && window.location.pathname !== '/login') {
//         toast.error('Session expired or invalid. Please log in again.');
//         window.location.href = '/login';
//         return;
//       }
  
//       let res;
//       if (user.role === 'Operator') {
//         console.log('BinContext: Fetching bins assigned to operator');
//         try {
//           res = await getBinsAssignedToOperator();
//           console.log('getBinsAssignedToOperator() response:', res);
//         } catch (err) {
//           console.error('Error in getBinsAssignedToOperator:', err);
//           toast.error('Failed to fetch bins for operator');
//           setBinData([]);
//           return;
//         }
//       } else if (user.role === 'Admin') {
//         console.log('BinContext: Fetching all bins for admin');
//         try {
//           res = await getAllBins();
//           console.log('getAllBins() response:', res);
//         } catch (err) {
//           console.error('Error in getAllBins:', err);
//           toast.error('Failed to fetch bins for admin');
//           setBinData([]);
//           return;
//         }
//       } else {
//         throw new Error('Invalid user role');
//       }

//       // Robustly extract bins array
//       if (!res) {
//         toast.error('No response from getAllBins');
//         setBinData([]);
//         return;
//       }
//       const bins = res.data || res || [];
//       const filteredData = Array.isArray(bins)
//         ? bins.filter(bin => bin.coordinates && typeof bin.coordinates.lat === 'number' && typeof bin.coordinates.lng === 'number')
//         : [];
//       setBinData(filteredData);
//     } catch (err) {
//       console.error('Error fetching bins:', err?.message, err?.response?.data);
//       toast.error('Failed to load bin data');
//       setBinData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBins();
//   }, []);

//   return (
//     <BinContext.Provider value={{ binData, setBinData, fetchBins, loading }}>
//       {children}
//     </BinContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { getAllBins, getBinsAssignedToOperator } from "/src/api/apiServices/binApi";
import { toast } from "react-toastify";

export const BinContext = createContext();

export const BinProvider = ({ children }) => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true); // ✅ added

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
  }, [isAuthorized]); // ✅ only run fetch if authorized

  return (
    <BinContext.Provider value={{ binData, setBinData, fetchBins, loading }}>
      {children}
    </BinContext.Provider>
  );
};

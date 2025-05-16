import { useState, useEffect } from 'react';
import DataAnalyticsReportsContent from './DataAnalyticsReportsContent';

export default function DataAnalyticsReports({ handleNavigation }) {
  const [activePage, setActivePage] = useState('Data Analytics & Reports');
  const [searchText, setSearchText] = useState('');
  const [avgBinFillTime, setAvgBinFillTime] = useState(10.5);
  const [collectionFrequency, setCollectionFrequency] = useState(2.1);
  
  const [collectionData, setCollectionData] = useState([
    { month: '2024/05', January: 600, February: 800, March: 450, April: 920, May: 700 },
    { month: '2024/06', January: 700, February: 900, March: 500, April: 800, May: 950 },
    { month: '2024/07', January: 650, February: 750, March: 400, April: 700, May: 800 },
    { month: '2024/08', January: 750, February: 850, March: 600, April: 850, May: 900 },
    { month: '2024/09', January: 800, February: 900, March: 550, April: 890, May: 950 },
  ]);

  const [binData, setBinData] = useState([
    { date: '2024-04-14', binsEmptied: 51, avgFillPercent: 85, fullAlerts: 7 },
    { date: '2024-04-15', binsEmptied: 46, avgFillPercent: 79, fullAlerts: 12 },
    { date: '2024-04-16', binsEmptied: 50, avgFillPercent: 88, fullAlerts: 9 },
    { date: '2024-04-17', binsEmptied: 54, avgFillPercent: 92, fullAlerts: 11 },
    { date: '2024-04-18', binsEmptied: 49, avgFillPercent: 84, fullAlerts: 8 },
  ]);

  useEffect(() => {
    const loadDataFromDB = () => {
      console.log("Connected to database and loaded data");
    };
    
    loadDataFromDB();
    
    const intervalId = setInterval(() => {
      setAvgBinFillTime(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setCollectionFrequency(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handlePageNavigation = (page) => {
    setActivePage(page);
    handleNavigation(page);
  };

  return (
    <DataAnalyticsReportsContent
      activePage={activePage}
      searchText={searchText}
      setSearchText={setSearchText}
      avgBinFillTime={avgBinFillTime}
      collectionFrequency={collectionFrequency}
      collectionData={collectionData}
      binData={binData}
      handleNavigation={handlePageNavigation}
    />
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEntries } from '../utils/firebaseService';
import VisitorGraph from './VisitorGraph';

const DataView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    lastVisit: null,
    platforms: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entries = await getEntries();
        setData(entries);

        // Calculate statistics
        const uniqueVisitors = new Set(entries.map(entry => entry.userAgent)).size;
        const lastVisit = entries.length > 0 ? entries[0].timestamp : null;
        
        // Calculate platform statistics
        const platforms = entries.reduce((acc, entry) => {
          const platform = getPlatform(entry.userAgent);
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalVisits: entries.length,
          uniqueVisitors,
          lastVisit,
          platforms
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPlatform = (userAgent) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return { date: 'N/A', timezone: 'N/A' };
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
      date: date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      timezone
    };
  };

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = data.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(data.length / entriesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the start
      if (currentPage <= 2) {
        endPage = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Process visitor data for the last 7 days
  const getLastSevenDaysData = () => {
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    }).reverse();

    // Count visits for each day
    const dailyVisits = lastSevenDays.map(date => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const visits = data.filter(entry => {
        const visitDate = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        return visitDate >= dayStart && visitDate < dayEnd;
      });

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: visits.length
      };
    });

    return dailyVisits;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-6xl mx-auto my-8"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-black">Visitor Statistics</h2>
      
    
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Total Visits</h3>
          <p className="text-3xl font-bold text-french">{stats.totalVisits}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Unique Visitors</h3>
          <p className="text-3xl font-bold text-french">{stats.uniqueVisitors}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Last Visit</h3>
          <p className="text-xl font-bold text-french">{formatDate(stats.lastVisit).date}</p>
          <p className="text-sm text-gray-400">{formatDate(stats.lastVisit).timezone}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Platforms</h3>
          <div className="mt-2 space-y-1">
            {Object.entries(stats.platforms).map(([platform, count]) => (
              <div key={platform} className="flex justify-between text-gray-300">
                <span>{platform}:</span>
                <span className="text-french">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Visit Time</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Platform</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Browser</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Device</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Location</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">IP Address</th>
                  <th className="px-6 py-3 border-b border-gray-600 text-left text-gray-200 font-semibold">Timezone</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => {
                  const userAgent = item.userAgent || '';
                  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                                userAgent.includes('Firefox') ? 'Firefox' :
                                userAgent.includes('Safari') ? 'Safari' :
                                userAgent.includes('Edge') ? 'Edge' : 'Other';
                  
                  const device = userAgent.includes('Mobile') ? 'Mobile' :
                               userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';

                  const { date, timezone } = formatDate(item.timestamp);

                  return (
                    <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{date}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{getPlatform(userAgent)}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{browser}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{device}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{item.location || 'N/A'}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{item.ipAddress || 'N/A'}</td>
                      <td className="px-6 py-4 border-b border-gray-700 text-gray-300">{timezone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((number, index) => (
              <button
                key={index}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                disabled={number === '...'}
                className={`px-4 py-2 rounded-md ${
                  number === currentPage
                    ? 'bg-french text-white'
                    : number === '...'
                    ? 'bg-gray-800 text-gray-500 cursor-default'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Next
            </button>
          </div>

          {/* Page Info */}
          <div className="text-center mt-4 text-gray-400">
            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, data.length)} of {data.length} entries
          </div>
            {/* Visitor Graph */}
          <div className="mt-8">
            <VisitorGraph visitorData={getLastSevenDaysData()} />
          </div>

        </>
      )}
    </motion.div>
  );
};

export default DataView; 
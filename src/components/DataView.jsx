import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEntries } from '../utils/firebaseService';

const DataView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
              {data.map((item) => {
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
      )}
    </motion.div>
  );
};

export default DataView; 
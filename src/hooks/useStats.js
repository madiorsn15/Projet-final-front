import { useState, useEffect } from 'react';
import api from '../utils/api';

const useStats = () => {
  const [stats,   setStats]   = useState({ totalProducts: 0, totalSellers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data || { totalProducts: 0, totalSellers: 0 });
      } catch (err) {
        console.error('Erreur chargement stats:', err);
        setStats({ totalProducts: 0, totalSellers: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Formate le nombre : 1200 → "1 200"
  const format = (n) => new Intl.NumberFormat('fr-SN').format(n || 0);

  return {
    stats,
    loading,
    productsFormatted: format(stats.totalProducts),
    sellersFormatted:  format(stats.totalSellers),
  };
};

export default useStats;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, RefreshCw, Filter } from 'lucide-react';

const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const platforms = ['all', 'CodeChef', 'Codeforces', 'GeeksforGeeks', 'LeetCode', 'HackerEarth'];

  const fetchContests = async () => {
    setLoading(true);
    try {
      const allContests = await Promise.all([
        fetchCodeChef(),
        fetchCodeforces(),
        fetchGeeksforGeeks(),
        fetchLeetCode(),
        fetchHackerEarth()
      ]);
      
      const merged = allContests.flat().sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      
      setContests(merged);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodeChef = async () => {
    try {
      const res = await fetch('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc');
      const data = await res.json();
      const contestsData = [...(data.present_contests || []), ...(data.future_contests || [])];
      
      return contestsData.map(c => ({
        id: Math.random().toString(36).substr(2, 9),
        platform: 'CodeChef',
        title: c.contest_name,
        url: `https://www.codechef.com/${c.contest_code}`,
        start_time: c.contest_start_date_iso,
        duration: (new Date(c.contest_end_date_iso) - new Date(c.contest_start_date_iso)) / 1000
      }));
    } catch (e) {
      console.error('CodeChef error:', e);
      return [];
    }
  };

  const fetchCodeforces = async () => {
    try {
      const res = await fetch('https://codeforces.com/api/contest.list');
      const data = await res.json();
      const now = Date.now() / 1000;
      
      return data.result
        .filter(c => c.startTimeSeconds + c.durationSeconds > now)
        .map(c => ({
          id: Math.random().toString(36).substr(2, 9),
          platform: 'Codeforces',
          title: c.name,
          url: `https://codeforces.com/contests/${c.id}`,
          start_time: new Date(c.startTimeSeconds * 1000).toISOString(),
          duration: c.durationSeconds
        }));
    } catch (e) {
      console.error('Codeforces error:', e);
      return [];
    }
  };

  const fetchGeeksforGeeks = async () => {
    try {
      const res = await fetch('https://practiceapi.geeksforgeeks.org/api/vr/events/?type=contest&sub_type=upcoming');
      const data = await res.json();
      
      return (data.results?.upcoming || []).map(c => ({
        id: Math.random().toString(36).substr(2, 9),
        platform: 'GeeksforGeeks',
        title: c.name,
        url: `https://practice.geeksforgeeks.org/contest/${c.slug}`,
        start_time: c.start_time,
        duration: (new Date(c.end_time) - new Date(c.start_time)) / 1000
      }));
    } catch (e) {
      console.error('GeeksforGeeks error:', e);
      return [];
    }
  };

  const fetchLeetCode = async () => {
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ allContests { title titleSlug startTime duration } }`
        })
      });
      const data = await res.json();
      const now = Date.now() / 1000;
      
      return (data.data?.allContests || [])
        .filter(c => c.startTime + c.duration > now)
        .map(c => ({
          id: Math.random().toString(36).substr(2, 9),
          platform: 'LeetCode',
          title: c.title,
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          start_time: new Date(c.startTime * 1000).toISOString(),
          duration: c.duration
        }));
    } catch (e) {
      console.error('LeetCode error:', e);
      return [];
    }
  };

  const fetchHackerEarth = async () => {
    // HackerEarth requires scraping which is complex in browser
    // You'd need a backend API for this
    return [];
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const formatDuration = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatus = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff < 0) return { text: 'Live', color: 'bg-green-500' };
    if (diff < 86400000) return { text: 'Today', color: 'bg-orange-500' };
    if (diff < 604800000) return { text: 'This Week', color: 'bg-blue-500' };
    return { text: 'Upcoming', color: 'bg-gray-500' };
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'CodeChef': 'bg-amber-600',
      'Codeforces': 'bg-blue-600',
      'GeeksforGeeks': 'bg-green-600',
      'LeetCode': 'bg-yellow-600',
      'HackerEarth': 'bg-purple-600'
    };
    return colors[platform] || 'bg-gray-600';
  };

  const filteredContests = filter === 'all' 
    ? contests 
    : contests.filter(c => c.platform === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Contest Tracker
          </h1>
          <p className="text-gray-300">Track competitive programming contests from multiple platforms</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === p 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {p === 'all' ? 'All Platforms' : p}
                </button>
              ))}
            </div>
            
            <button
              onClick={fetchContests}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {lastUpdated && (
            <p className="text-gray-400 text-sm mt-4">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContests.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No contests found
              </div>
            ) : (
              filteredContests.map(contest => {
                const { date, time } = formatDateTime(contest.start_time);
                const status = getStatus(contest.start_time);
                
                return (
                  <div
                    key={contest.id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-[1.01]"
                  >
                    <div className="flex flex-wrap gap-4 items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getPlatformColor(contest.platform)}`}>
                            {contest.platform}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                          {contest.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {time}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Duration: {formatDuration(contest.duration)}
                          </div>
                        </div>
                      </div>
                      
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Visit
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestTracker;
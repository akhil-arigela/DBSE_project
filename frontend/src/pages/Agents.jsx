import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAgents } from '../api/agentApi';
import StarRating from '../components/StarRating';
import { Briefcase, Phone, Mail, Award } from 'lucide-react';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents()
      .then(res => setAgents(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading verified agents...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Verified Real Estate Agents</h1>
        <p className="text-gray-500">Connect with expert local agents who can guide you through site tours, valuations, and paperwork.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div
            key={agent.agent_id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-105 transition-transform">
              {agent.name?.charAt(0) || 'A'}
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{agent.name}</h3>
            <p className="text-xs text-blue-700 font-semibold mb-2">{agent.agency_name || 'Independent Real Estate Agent'}</p>
            
            <div className="flex items-center gap-1.5 mb-3">
              <StarRating value={parseFloat(agent.avg_rating) || 0} size={15} />
              <span className="text-xs font-bold text-gray-700">
                {parseFloat(agent.avg_rating) > 0 ? parseFloat(agent.avg_rating).toFixed(1) : 'New'}
              </span>
              {agent.total_reviews > 0 && (
                <span className="text-xs text-gray-400">({agent.total_reviews} reviews)</span>
              )}
            </div>

            <div className="w-full text-xs text-gray-500 border-t border-b border-gray-100 py-3 my-3 space-y-1.5">
              <div className="flex items-center justify-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>{agent.experience_years || 0} years experience</span>
              </div>
              {agent.license_number && (
                <div className="flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  <span>Lic: {agent.license_number}</span>
                </div>
              )}
            </div>

            <Link
              to={`/agents/${agent.agent_id}`}
              className="mt-auto block w-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              View Profile & Listings
            </Link>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center text-gray-500 py-16">No agents registered currently.</div>
      )}
    </div>
  );
};

export default Agents;

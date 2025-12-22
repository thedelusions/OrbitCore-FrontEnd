import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";
import { getProjectTeam } from "../../../services/teamService";
import './Team.css';

const Team = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        
        const data = await getProjectTeam(id);
        setTeamMembers(data);
        
       
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <div className="loading">Loading team...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="team-container">
      <h1>Team Members</h1>
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={`${member.projectId}-${member.id}`} className="team-member-card">
            <h3>{member.username}</h3>
            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Project:</strong> {member.projectTitle}</p>
            {member.role && <p><strong>Role:</strong> {member.role}</p>}
            {member.bio && <p><strong>Bio:</strong> {member.bio}</p>}
            {member.github_profile && (
              <p>
                <strong>GitHub:</strong>
                <a href={member.github_profile} target="_blank" rel="noopener noreferrer">
                  {member.github_profile}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
      {teamMembers.length === 0 && (
        <p className="no-teams">No team members found.</p>
      )}
    </div>
  );
};

export default Team;
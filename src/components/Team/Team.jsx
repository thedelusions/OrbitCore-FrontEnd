import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router";
import { getProjectTeam, removeTeamMember, getTeamComments, addTeamComment} from "../../../services/teamService";
import { UserContext } from '../../contexts/UserContext';
import './Team.css';
import Footer from '../Footer/Footer';
const Team = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        
        const teamInfo = await getProjectTeam(id);
        setTeamMembers(teamInfo);
        const commentInfo = await getTeamComments(id)
        setComments(commentInfo)
       
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, [id]);

  const handleRemovingMember = async (userId) => {
    try {
      await removeTeamMember(id, userId)
      setTeamMembers(prev => prev.filter(member => member.user_id !== userId))
    }
    catch(err) {
      alert(err.message)
    }
  }
  const isOwner = teamMembers.some(
  member =>
    member.role === 'Owner' &&
    member.user_id === (user?.id || user?.user_id || user?.userId)
);
  if (loading) return <div className="loading">Loading team...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <><div className="team-container">
      <h1>Team Members</h1>
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={`${member.project_id}-${member.user_id}`} className="team-member-card">
            <h3>{member.user?.username}</h3>
            <p><strong>Email:</strong> {member.user?.email}</p>
            <p><strong>Role:</strong> {member.role}</p>
            {member.user?.bio && <p><strong>Bio:</strong> {member.user.bio}</p>}
            {member.user?.github_profile && (
              <p>
                
                <a href={member.user.github_profile} target="_blank" rel="noopener noreferrer">
                Github Profile Link
                </a>
              </p>
            )}
            {member.role !== 'Owner' && isOwner && (
            <button className='remove-btn' onClick={() => handleRemovingMember(member.user_id)}>
              Remove
            </button>
            )}
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <p className="no-teams">No team members found.</p>
      )}
    </div>
    <Footer />
    </>
    
  );
};

export default Team;
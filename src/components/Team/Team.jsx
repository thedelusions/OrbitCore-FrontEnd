import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router";
import { getProjectTeam, removeTeamMember, getTeamComments, addTeamComment, deleteTeamComment} from "../../../services/teamService";
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
      setError(err.message)
    }
  }
  const currentUserId = user?.id || user?.user_id || user?.userId;
  const isOwner = teamMembers.some(
  member =>
    member.role === 'Owner' &&
    member.user_id === (user?.id || user?.user_id || user?.userId)
);
const handleAddingComment = async (e) => {
  e.preventDefault();
  try {
    const newComment = await addTeamComment(id, {content: commentText})
    setComments(prev => [...prev, newComment])
    setCommentText("")
  }
  catch (err) {
    setError(err.message)
  }
}
const handleDeleteComment = async (commentId) => {
  try {
    await deleteTeamComment(id, commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }
  catch (err) {
    setError(err.message)
  }
}
  if (loading) return <div className="loading">Loading team...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <div className="team-container">
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
            <button
        className="rem-member-button"
        onClick={() => handleRemovingMember(member.user_id)}
      >
        <svg viewBox="0 0 448 512" className="svgIcon">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
            )}
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <p className="no-teams">No team members found.</p>
      )}
      <h2 className='comments-title'>Discussion</h2>
      <div className='comments-list'>
        <div className="comments-list">
        {comments.map(comment => (
  <div key={comment.id} className="comment">
    <strong>{comment.user?.username}</strong>
    <p>{comment.content}</p>

    {(comment.user_id === currentUserId || isOwner) && (
      <button
        className="rem-button"
        onClick={() => handleDeleteComment(comment.id)}
      >
        <svg viewBox="0 0 448 512" className="svgIcon">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    )}
  </div>
))}
      </div> 
      <form onSubmit={handleAddingComment} className="comment-form">
        <div className="input-container">
          <textarea value={commentText} onChange={e => setCommentText(e.target.value)} required/>
          <label className="label">Write a comment...</label>
          <span className="underline"></span>
        </div>

  <button type="submit">Add Comment</button>
</form>
      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default Team;
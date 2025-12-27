import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router";
import { getProjectTeam, removeTeamMember, getTeamComments, addTeamComment, deleteTeamComment} from "../../../services/teamService";
import { getUserById } from "../../../services/userService";
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
        
        const teamWithUserData = await Promise.all(
          teamInfo.map(async (member) => {
            try {
              const userData = await getUserById(member.user_id);
              return {
                ...member,
                user: userData
              };
            } catch (err) {
              console.error(`Failed to fetch user ${member.user_id}:`, err);
              return {
                ...member,
                user: null
              };
            }
          })
        );
        
        setTeamMembers(teamWithUserData);
        
        const commentInfo = await getTeamComments(id);
        const commentsWithUserData = await Promise.all(
          commentInfo.map(async (comment) => {
            try {
              const userData = await getUserById(comment.user_id);
              return {
                ...comment,
                user: userData
              };
            } catch (err) {
              console.error(`Failed to fetch user ${comment.user_id}:`, err);
              return {
                ...comment,
                user: null
              };
            }
          })
        );
        setComments(commentsWithUserData);
       
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, [id]);
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) {
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};  
  const handleRemovingMember = async (userId) => {
    try {
      await removeTeamMember(id, userId)
      setTeamMembers(prev => prev.filter(member => member.user_id !== userId))
    }
    catch(err) {
      alert(err.message)
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
    const newComment = await addTeamComment(id, {content: commentText});
    const userData = await getUserById(newComment.user_id);
    setComments(prev => [...prev, { ...newComment, user: userData }]);
    setCommentText("");
  }
  catch (err) {
    alert(err.message);
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    await deleteTeamComment(id, commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }
  catch (err) {
    alert(err.message)
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
            <h3>
              <a 
                href={`/users/${member.user_id}`}
                onClick={(e) => { e.preventDefault(); navigate(`/users/${member.user_id}`); }}
                className="member-link"
              >
                {member.user?.username || 'Unknown'}
              </a>
            </h3>
            <p><strong>Email:</strong> {member.user?.email}</p>
            <p><strong>Role:</strong> {member.role}</p>
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
      <h2>Team Chat</h2>
      <div className='comments-list'>
        <div className="comments-list">
        {comments.map(comment => (
  <div key={comment.id} className="comment">
    <strong>{comment.user?.username}</strong>
    <span className="comment-time">
        {timeAgo(comment.created_at)}
      </span>
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
        <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a massage..."/>
        <button type="submit">Send Massage</button>
      </form>
      </div>w
    </div>
    <Footer />
    </>
    
  );
};

export default Team;
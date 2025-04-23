import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coverPhoto from '../../assets/coverphoto.png';
import Logo from '../../assets/Logo2.png';
import Footer from '../../components/Footer/Footer';
import './Profile.css';

// Import the profile avatar images
import user1 from '../../assets/users/user_1.png';
import user2 from '../../assets/users/user_2.png';
import user3 from '../../assets/users/user_3.png';
import user4 from '../../assets/users/user_4.png';
import user5 from '../../assets/users/user_5.png';

const Profile = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([
    { id: 1, name: 'Profile 1', avatar: user1 },
    { id: 2, name: 'Profile 2', avatar: user2 },
    { id: 3, name: 'Profile 3', avatar: user3 },
    { id: 4, name: 'Profile 4', avatar: user4 },
    { id: 5, name: 'Profile 5', avatar: user5 }
  ]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newName, setNewName] = useState('');

  const handleProfileClick = (profile) => {
    navigate('/home');
  };

  const handleEditClick = (profile, e) => {
    e.stopPropagation();
    setEditingProfile(profile.id);
    setNewName(profile.name);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameSubmit = (profileId, e) => {
    e.preventDefault();
    setProfiles(profiles.map(profile => 
      profile.id === profileId ? { ...profile, name: newName } : profile
    ));
    setEditingProfile(null);
  };

  const handleDeleteClick = (profileId, e) => {
    e.stopPropagation();
    setProfiles(profiles.filter(profile => profile.id !== profileId));
  };

  const handleAddProfile = () => {
    if (profiles.length < 5) {
      const newId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
      const availableAvatars = [user1, user2, user3, user4, user5];
      const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
      
      setProfiles([
        ...profiles,
        {
          id: newId,
          name: `Profile ${newId}`,
          avatar: randomAvatar
        }
      ]);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-background" style={{ backgroundImage: `url(${coverPhoto})` }}>
        <div className="background-gradient" />
      </div>

      <header className="profile-header">
        <img src={Logo} alt="Tenflix" className="tenflix-logo" />
      </header>

      <main className="profile-content">
        <h1>Who's watching?</h1>
        <div className="profile-grid">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="profile-card"
              onClick={() => handleProfileClick(profile)}
            >
              <div className="profile-avatar">
                <img src={profile.avatar} alt={profile.name} />
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteClick(profile.id, e)}
                >
                  ×
                </button>
              </div>
              {editingProfile === profile.id ? (
                <form onSubmit={(e) => handleNameSubmit(profile.id, e)}>
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    onClick={(e) => e.stopPropagation()}
                    className="profile-name-input"
                    autoFocus
                  />
                </form>
              ) : (
                <div className="profile-name" onClick={(e) => handleEditClick(profile, e)}>
                  {profile.name}
                </div>
              )}
            </div>
          ))}
          {profiles.length < 5 && (
            <div className="profile-card add-profile" onClick={handleAddProfile}>
              <div className="profile-avatar">
                <span className="add-icon">+</span>
              </div>
              <div className="profile-name">Add Profile</div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

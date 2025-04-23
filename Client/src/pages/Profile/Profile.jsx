import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import coverPhoto from '../../assets/coverphoto.png';
import Logo from '../../assets/Logo2.png';
import Footer from '../../components/Footer/Footer';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import profileService from '../../services/profileService';
import './Profile.css';

// Import the profile avatar images
import user1 from '../../assets/users/user_1.png';
import user2 from '../../assets/users/user_2.png';
import user3 from '../../assets/users/user_3.png';
import user4 from '../../assets/users/user_4.png';
import user5 from '../../assets/users/user_5.png';
import user6 from '../../assets/users/user_6.png';
import user7 from '../../assets/users/user_7.png';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuth, user, setSelectedProfile } = useAuthContext();
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableAvatars = [
    { path: '/assets/users/user_1.png', image: user1 },
    { path: '/assets/users/user_2.png', image: user2 },
    { path: '/assets/users/user_3.png', image: user3 },
    { path: '/assets/users/user_4.png', image: user4 },
    { path: '/assets/users/user_5.png', image: user5 },
    { path: '/assets/users/user_6.png', image: user6 },
    { path: '/assets/users/user_7.png', image: user7 }
  ];

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * availableAvatars.length);
    return availableAvatars[randomIndex];
  };

  const fetchProfiles = async () => {
    try {
      setError(null);
      const response = await profileService.getProfiles();
      if (!response.profiles) {
        throw new Error('Invalid response format from server');
      }
      
      const profilesWithAvatars = response.profiles.map(profile => {
        const avatarImage = availableAvatars.find(av => av.path === profile.avatar)?.image;
        return {
          id: profile.id,
          name: profile.name,
          avatar: avatarImage || user1,
          avatarPath: profile.avatar
        };
      });
      setProfiles(profilesWithAvatars);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError(error.response?.data?.message || 'Failed to load profiles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = async (profile) => {
    try {
      setError(null);
      const response = await profileService.selectProfile(profile.id);
      if (response.success) {
        setSelectedProfile(profile);
        navigate('/');
      } else {
        throw new Error(response.message || 'Failed to select profile');
      }
    } catch (error) {
      console.error('Error selecting profile:', error);
      setError(error.message || 'Failed to select profile. Please try again.');
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfile(profile.id);
    setNewName(profile.name);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameSubmit = async (profileId, e) => {
    e.preventDefault();
    try {
      setError(null);
      const profile = profiles.find(p => p.id === profileId);
      const response = await profileService.updateProfile(profileId, { 
        name: newName,
        avatar: profile.avatarPath
      });
      
      if (!response.profile) {
        throw new Error('Invalid response format from server');
      }

      const avatarImage = availableAvatars.find(av => av.path === response.profile.avatar)?.image;
      setProfiles(profiles.map(p => 
        p.id === profileId ? { 
          ...p,
          name: response.profile.name,
          avatar: avatarImage || p.avatar,
          avatarPath: response.profile.avatar
        } : p
      ));
      setEditingProfile(null);
      setNewName(''); // Reset the new name after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile name. Please try again.');
    }
  };

  const handleDeleteClick = async (profileId) => {
    try {
      setError(null);
      await profileService.deleteProfile(profileId);
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error.response?.data?.message || 'Failed to delete profile. Please try again.');
    }
  };

  const handleAddProfile = async () => {
    if (profiles.length < 5) {
      try {
        setError(null);
        const randomAvatar = getRandomAvatar();
        
        const response = await profileService.createProfile({
          name: `Profile ${profiles.length + 1}`,
          avatar: randomAvatar.path
        });
        
        if (!response.profile) {
          throw new Error('Invalid response format from server');
        }

        const avatarImage = availableAvatars.find(av => av.path === response.profile.avatar)?.image;
        setProfiles([...profiles, { 
          id: response.profile.id,
          name: response.profile.name,
          avatar: avatarImage || randomAvatar.image,
          avatarPath: response.profile.avatar
        }]);
      } catch (error) {
        console.error('Error creating profile:', error);
        setError(error.response?.data?.message || 'Failed to create new profile. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-message">Loading profiles...</div>
      </div>
    );
  }

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
        {error && <div className="error-message">{error}</div>}
        <div className="profile-grid">
          {profiles.map(profile => (
            <ProfilePicture
              key={profile.id}
              avatar={profile.avatar}
              name={profile.name}
              isEditing={editingProfile === profile.id}
              onDelete={() => handleDeleteClick(profile.id)}
              onEdit={editingProfile === profile.id ? handleNameChange : () => handleEditClick(profile)}
              onClick={() => handleProfileClick(profile)}
              showDelete={true}
            />
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

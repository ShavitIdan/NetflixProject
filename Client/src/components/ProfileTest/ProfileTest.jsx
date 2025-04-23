import React, { useState, useEffect } from 'react';
import profileService from '../../services/profileService';
import './ProfileTest.css';

const ProfileTest = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProfile, setNewProfile] = useState({ name: '', avatar: '' });

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfiles();
      // Ensure profiles is always an array
      setProfiles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profiles: ' + err.message);
      setProfiles([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      await profileService.createProfile(newProfile);
      await fetchProfiles();
      setNewProfile({ name: '', avatar: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileId, updatedName) => {
    try {
      setLoading(true);
      await profileService.updateProfile(profileId, { name: updatedName });
      await fetchProfiles();
      setError(null);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    try {
      setLoading(true);
      await profileService.deleteProfile(profileId);
      await fetchProfiles();
      setError(null);
    } catch (err) {
      setError('Failed to delete profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-test">
      <h2>Profile Service Test</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="create-profile">
        <h3>Create New Profile</h3>
        <input
          type="text"
          placeholder="Profile Name"
          value={newProfile.name}
          onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Avatar URL"
          value={newProfile.avatar}
          onChange={(e) => setNewProfile({ ...newProfile, avatar: e.target.value })}
        />
        <button onClick={handleCreateProfile} disabled={loading}>
          Create Profile
        </button>
      </div>

      <div className="profiles-list">
        <h3>Existing Profiles</h3>
        {loading ? (
          <div>Loading...</div>
        ) : profiles.length === 0 ? (
          <div>No profiles found</div>
        ) : (
          <ul>
            {profiles.map((profile) => (
              <li key={profile._id}>
                <div className="profile-info">
                  <img src={profile.avatar} alt={profile.name} />
                  <span>{profile.name}</span>
                </div>
                <div className="profile-actions">
                  <button
                    onClick={() => {
                      const newName = prompt('Enter new name:', profile.name);
                      if (newName) handleUpdateProfile(profile._id, newName);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProfile(profile._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileTest; 
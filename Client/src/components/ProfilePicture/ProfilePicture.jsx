import React from 'react';
import './ProfilePicture.css';

const ProfilePicture = ({ 
  avatar, 
  name, 
  isEditing = false, 
  onDelete, 
  onEdit, 
  onClick,
  showDelete = false 
}) => {
  return (
    <div className="profile-picture-container" onClick={onClick}>
      <div className="profile-avatar">
        <img src={avatar} alt={name} />
        {showDelete && (
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        )}
      </div>
      {!isEditing ? (
        <div className="profile-name" onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}>
          {name}
        </div>
      ) : (
        <div className="profile-name-input-container">
          <input
            type="text"
            value={name}
            onChange={(e) => onEdit(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="profile-name-input"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePicture; 
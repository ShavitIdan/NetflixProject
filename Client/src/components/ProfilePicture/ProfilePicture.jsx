import React, { useState, useEffect, useRef } from 'react';
import './ProfilePicture.css';

const ProfilePicture = ({ 
  avatar, 
  name, 
  isEditing = false, 
  onDelete, 
  onEdit, 
  onNameSubmit,
  onClick,
  showDelete = false 
}) => {
  const [inputValue, setInputValue] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNameSubmit(inputValue);
    }
  };

  const handleBlur = () => {
    onNameSubmit(inputValue);
  };

  return (
    <div className="profile-picture-container" onClick={onClick}>
      <div className="profile-avatar">
        <img src={avatar} alt={name} />
        {showDelete && (
          <button
            className="profile-delete-button"
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
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
            className="profile-name-input"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePicture; 
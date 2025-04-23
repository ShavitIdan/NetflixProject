export const validateToken = (token) => {
  if (!token) return false;
  
  try {
    // Split the token into its parts
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return validateToken(token);
}; 
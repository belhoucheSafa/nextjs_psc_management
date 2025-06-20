
export const getCurrentUser = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };
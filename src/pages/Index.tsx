import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'student' ? '/student' : '/warden');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

export default Index;

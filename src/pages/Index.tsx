import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? '/learn' : '/login'} replace />;
};

export default Index;

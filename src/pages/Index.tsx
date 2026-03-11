import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export default Index;

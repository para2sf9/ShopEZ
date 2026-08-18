import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedLink({ to, children, className }) {
  const { user } = useAuth();
  return <Link to={user ? to : '/login'} className={className}>{children}</Link>;
}

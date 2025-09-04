import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  LogOut, 
  Building2,
  User,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'employee':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      allowed: ['admin', 'manager', 'employee']
    },
    {
      to: '/tasks',
      icon: CheckSquare,
      label: 'Tasks',
      allowed: ['admin', 'manager', 'employee']
    },
    {
      to: '/users',
      icon: Users,
      label: 'User Management',
      allowed: ['admin', 'manager']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.allowed.includes(user?.role)
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TaskManager</h1>
              <p className="text-xs text-gray-500">Employee System</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
                {getInitials(user?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.full_name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            
            {user?.department && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Building2 className="w-4 h-4" />
                <span>{user.department}</span>
              </div>
            )}
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

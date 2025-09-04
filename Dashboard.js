import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Users, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/tasks`)
      ]);

      setStats(statsResponse.data);
      
      // Get recent tasks (last 5)
      const sortedTasks = tasksResponse.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionRate = stats?.total_tasks > 0 
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role !== 'employee' && (
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-900">{stats?.total_employees || 0}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-900">{stats?.total_tasks || 0}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <CheckSquare className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats?.completed_tasks || 0}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <Target className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Overdue</p>
                <p className="text-3xl font-bold text-orange-900">{stats?.overdue_tasks || 0}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Progress Overview</span>
            </CardTitle>
            <CardDescription>Your task completion statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion</span>
                <span className="font-medium text-gray-900">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm font-medium">{stats?.pending_tasks || 0}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium">{stats?.in_progress_tasks || 0}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">{stats?.completed_tasks || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Recent Tasks</span>
            </CardTitle>
            <CardDescription>Your latest task activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No tasks found</p>
                <p className="text-sm text-gray-400">Tasks will appear here once created</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(task.created_at)}
                        </span>
                        {task.due_date && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Due {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status?.replace('_', ' ').charAt(0).toUpperCase() + 
                         task.status?.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-col space-y-2"
              onClick={() => window.location.href = '/tasks'}
            >
              <CheckSquare className="w-6 h-6" />
              <span>View All Tasks</span>
            </Button>
            
            {user?.role !== 'employee' && (
              <Button 
                variant="outline"
                className="h-20 border-2 border-green-200 hover:bg-green-50 flex-col space-y-2"
                onClick={() => window.location.href = '/users'}
              >
                <Users className="w-6 h-6 text-green-600" />
                <span>Manage Users</span>
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="h-20 border-2 border-purple-200 hover:bg-purple-50 flex-col space-y-2"
              onClick={() => window.location.reload()}
            >
              <Activity className="w-6 h-6 text-purple-600" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

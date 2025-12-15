'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  Activity,
  Clock,
  Bell,
  User,
  Sparkles,
  MapPin,
  ArrowRight,
  Search,
  MessageCircle,
  DollarSign,
  CheckCircle,
  BookOpen,
  Award,
  Zap,
  Target,
  Gift,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { userDashboardService } from '@/services/userDashboardService';
import type { DashboardStats, RecentActivity } from '@/services/userDashboardService';
import { toast } from 'react-hot-toast';

export default function UserDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        userDashboardService.getDashboardStats(),
        userDashboardService.getRecentActivity(5)
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getSpendingTrend = () => {
    if (!stats) return null;
    const currentMonth = stats.monthlySpending[stats.monthlySpending.length - 1]?.amount || 0;
    const previousMonth = stats.monthlySpending[stats.monthlySpending.length - 2]?.amount || 0;
    const change = previousMonth ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
    
    if (change > 0) {
      return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', value: change.toFixed(1) };
    } else if (change < 0) {
      return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100', value: Math.abs(change).toFixed(1) };
    }
    return null;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-white" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-white" />;
      case 'review': return <Star className="w-5 h-5 text-white" />;
      case 'favorite': return <Heart className="w-5 h-5 text-white" />;
      default: return <Activity className="w-5 h-5 text-white" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <RoleBasedLayout role="user">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Enhanced Header */}
          <div className="bg-blue-600 rounded-3xl shadow-2xl mb-8 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Welcome back</p>
                    <h1 className="text-3xl font-bold">{getUserGreeting()}</h1>
                  </div>
                </div>
                <p className="text-blue-100 text-sm flex items-center mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all">
                  <Bell className="w-6 h-6 text-white" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
                <button 
                  onClick={() => router.push('/user/dashboard/profile')}
                  className="flex items-center space-x-3 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="font-semibold text-sm">My Profile</p>
                    <p className="text-xs text-blue-100">View details</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Active Bookings */}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  {stats && stats.activeBookings > 0 && (
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active Bookings</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stats?.activeBookings || 0}
                </p>
                <p className="text-sm text-gray-400 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {stats?.totalBookings || 0} total bookings
                </p>
              </div>

              {/* Total Spent */}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-green-500 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  {(() => {
                    const trend = getSpendingTrend();
                    if (!trend) return null;
                    const IconComponent = trend.icon;
                    return (
                      <div className={`px-3 py-1 ${trend.bg} rounded-full flex items-center`}>
                        <IconComponent className={`w-3 h-3 ${trend.color} mr-1`} />
                        <span className={`text-xs font-bold ${trend.color}`}>
                          {trend.value}%
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Investment</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{(stats?.totalSpent || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  This month spending
                </p>
              </div>

              {/* Saved Properties */}
              <div 
                onClick={() => router.push('/user/dashboard/favorites')}
                className="group bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Saved Properties</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">{stats?.favoritesCount || 0}</p>
                <p className="text-sm text-gray-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Click to explore
                </p>
              </div>

              {/* Reviews & Rating */}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-yellow-500 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  {stats && stats.averageRating >= 4 && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Top Reviewer
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Reviews Given</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stats?.reviewsCount || 0}
                </p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (stats?.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {stats?.averageRating.toFixed(1) || 'N/A'} average
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
                      <p className="text-blue-100 text-sm">Your recent actions</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all">
                    View All
                  </button>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-gradient-to-br from-gray-200 to-gray-300 h-14 w-14"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
                      <p className="text-gray-500 mb-6">Start exploring properties to see your activity here</p>
                      <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                      >
                        Explore Properties
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div 
                          key={activity._id} 
                          className="group relative flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                        >
                          {index !== recentActivity.length - 1 && (
                            <div className="absolute left-9 top-16 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
                          )}
                          
                          <div className="relative z-10 p-3 bg-blue-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all flex-shrink-0">
                            {getActivityIcon(activity.type)}
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {activity.title}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatTimeAgo(activity.timestamp)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Support */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                      <p className="text-blue-100 text-sm">Navigate faster</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => router.push('/')}
                    className="group w-full px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="flex items-center font-medium">
                      <div className="p-2 bg-white/20 rounded-lg mr-3">
                        <Search className="w-5 h-5" />
                      </div>
                      Search Properties
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => router.push('/user/dashboard/bookings')}
                    className="group w-full px-4 py-4 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="flex items-center font-medium">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      My Bookings
                    </span>
                    <div className="flex items-center space-x-2">
                      {stats && stats.activeBookings > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          {stats.activeBookings}
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/user/dashboard/favorites')}
                    className="group w-full px-4 py-4 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="flex items-center font-medium">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      Saved Properties
                    </span>
                    <div className="flex items-center space-x-2">
                      {stats && stats.favoritesCount > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          {stats.favoritesCount}
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/user/dashboard/profile')}
                    className="group w-full px-4 py-4 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="flex items-center font-medium">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      My Profile
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Insights Card */}
              <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">Your Insights</h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-sm">Total Bookings</span>
                    <span className="font-bold">{stats?.totalBookings || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-sm">Pending Payments</span>
                    <span className="font-bold">{stats?.pendingPayments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-sm">Upcoming Check-ins</span>
                    <span className="font-bold">{stats?.upcomingCheckIns || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Gift className="w-5 h-5" />
                  <span>Earn rewards with every booking!</span>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
                <div className="bg-blue-600 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Need Help?</h3>
                      <p className="text-blue-100 text-sm">We're here 24/7</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-blue-100 text-sm mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Instant chat support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Property expert guidance</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Booking assistance</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all font-bold flex items-center justify-center group">
                    <MessageCircle className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Lightbulb, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Lightbulb className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                IdeoPark
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { to: "/explore", label: "Explore Ideas" },
              { to: "/how-it-works", label: "How it Works" },
              ...(user ? [{ to: "/submit-idea", label: "Submit Idea" }] : []),
              ...(user ? [{ to: "/announcements", label: "Announcements" }] : []),
              { to: "/pricing", label: "Pricing" },
              { to: "/dashboard", label: "Dashboard" }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium group rounded-xl hover:bg-blue-50/50"
              >
                {item.label}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 ml-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative p-0 rounded-full hover:scale-105 transition-transform duration-300">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <AvatarImage src="" alt={profile?.full_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 text-white font-bold text-lg">
                          {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none text-slate-900">
                            {profile?.full_name || "User"}
                          </p>
                          <p className="text-xs leading-none text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem asChild className="cursor-pointer p-3 hover:bg-blue-50">
                      <Link to="/dashboard" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer p-3 hover:bg-red-50 text-red-600 font-medium">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-6">
                <Button asChild variant="ghost" className="text-lg px-6 py-3 font-medium hover:bg-slate-100 rounded-xl transition-all duration-300">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user ? (profile?.full_name || "User") : "Guest"}</p>
                    {user?.email && (
                      <p className="text-xs leading-none text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/explore" className="p-3">Explore Ideas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/how-it-works" className="p-3">How it Works</Link>
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/submit-idea" className="p-3">Submit Idea</Link>
                  </DropdownMenuItem>
                )}
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/announcements" className="p-3">Announcements</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="p-3">Pricing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="p-3">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer p-3 text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="p-3">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="p-3 font-semibold text-blue-600">Get Started</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

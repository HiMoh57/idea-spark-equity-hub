import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lightbulb, LogOut, Menu } from 'lucide-react';
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
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-md">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Ideopark</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            <Link to="/explore" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
              Explore Ideas
            </Link>
            {user && (
              <Link to="/submit-idea" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
                Submit Idea
              </Link>
            )}
            {user && (
              <Link to="/announcements" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
                Announcements
              </Link>
            )}
            <Link to="/pricing" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
              Pricing
            </Link>

            <Link to="/dashboard" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
              Dashboard
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                        {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" className="text-lg px-6 py-2">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-6 py-2 rounded-lg shadow-md">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user ? (profile?.full_name || "User") : "Guest"}</p>
                    {user?.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/explore">Explore Ideas</Link>
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/submit-idea">Submit Idea</Link>
                  </DropdownMenuItem>
                )}
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/announcements">Announcements</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/pricing">Pricing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/auth">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/auth">Get Started</Link>
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

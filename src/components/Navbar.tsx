import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../..//src/store/AuthStore";
import { useEffect, useState } from "react";
import { LogOut, Menu, UserIcon, X, PenTool } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "..//api/auth";

const Navbar = () => {
      const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const { data } = useQuery({
    queryFn: () => getUser({ userId: user?.id! }),
    queryKey: ["user", user?.id],
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
    {!isMenuOpen && (
        <header className="flex h-16 bg-white relative  p-4 shadow-md sticky top-0 z-10">
          <div className="hidden container mx-auto md:flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <PenTool className="bg-amber-600 text-white p-2 w-8 h-8 rounded-lg"/>
              <p className="text-xl font-bold">BlogSite</p>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="hover:text-amber-600 hover:underline text-sm">
                Home
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/my-blogs"
                     className="hover:text-amber-600 hover:underline text-sm"
                  >
                    My Blogs
                  </Link>
                  
                  <Link
                    to={`/profile/${user.id}`}
                    className="hover:text-amber-600 text-gray-700 flex items-center gap-2"
                  >
                    <Button variant='ghost'>
                    <UserIcon className="w-4 h-4"/>
                    <span className="text-sm">{data?.firstName}&nbsp;{data?.lastName}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="hover:text-red-600 hover:bg-red-100">
                    <LogOut />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-center text-gray-700">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    className="hover:text-amber-600 hover:underline"
                  >
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Signup
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
          <Link to="/" className="md:hidden flex items-center gap-2 pl-3">
              <PenTool className="bg-amber-600 text-white p-2 w-8 h-8 rounded-lg"/>
              <p className="text-xl font-bold">BlogSite</p>
            </Link>
          <Button
            className="hover:bg-amber-700 bg-amber-600 md:hidden absolute right-2 self-center"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={25} />
          </Button>
        </header>
      )}
      {isMenuOpen && (
<header className="pt-16 shadow-md bg-white/70 backdrop-blur-sm p-10 fixed top-0 left-0 z-50 w-full">
          
          <Button
            className="bg-amber-600 hover:bg-amber-700 absolute right-5 top-5 self-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={30} />
          </Button>

          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-amber-600 mr-4 hover:underline"
            >
              Home
            </Link>
            {user ? (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/my-blogs"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-amber-600 hover:underline mr-3"
                >
                  My Blogs
                </Link>

                <Link
                  to={`/profile/${user.id}`}
                    className="hover:text-amber-600 text-gray-700 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon />
                  <span>{data?.firstName}&nbsp;{data?.lastName}</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-red-600"
                >
                  <LogOut className="w-5"/>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:underline mr-3"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:underline"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </header>
      )}
      </>
  )
}

export default Navbar
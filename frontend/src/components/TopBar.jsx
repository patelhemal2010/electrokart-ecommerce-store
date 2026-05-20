import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/usersApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import FreshSearchBar from "./FreshSearchBar";

const TopBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const user = userInfo
    ? {
        name: userInfo.username || userInfo.name || "User",
        avatar: userInfo.avatar || "/default-avatar.png",
      }
    : null;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isAdminContext = location.pathname.startsWith("/admin");
  const profileHref =
    userInfo?.isAdmin && isAdminContext ? "/admin/profile" : "/profile";

  return (
    <header className="sticky top-0 z-40 bg-gray-800 backdrop-blur border-b border-gray-700 w-full shadow-lg">
      {/* Row 1: logo + actions */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center flex-shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center text-lg sm:text-2xl font-extrabold tracking-wide">
              <span className="text-white">Electro</span>
              <span className="text-orange-400">Kart</span>
            </div>
          </Link>
        </div>

        {/* Desktop search (center) */}
        {!isAdminContext && (
          <div className="hidden lg:flex flex-1 justify-center items-center px-4 max-w-2xl mx-auto min-w-0">
            <FreshSearchBar />
          </div>
        )}

        <div className="flex justify-end items-center gap-1 sm:gap-3 relative flex-shrink-0">
          {user ? (
            <>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setShowProfile(!showProfile)}
                type="button"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <span className="text-gray-200 font-medium hidden md:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {showProfile && (
                <div className="absolute top-12 sm:top-14 right-0 w-56 sm:w-64 bg-gray-900 text-gray-200 rounded-xl shadow-xl border border-gray-700 z-50">
                  <div className="flex flex-col items-center p-4 sm:p-6 bg-gradient-to-r from-pink-600 to-purple-700 rounded-t-xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-800 overflow-hidden mb-2 border-4 border-pink-400">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div className="text-white text-base sm:text-lg font-semibold text-center">
                      {user.name}
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 p-3 sm:p-4 border-t border-gray-700">
                    <Link
                      to={profileHref}
                      className="flex-1 text-center px-3 py-2 text-sm bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition"
                      onClick={() => setShowProfile(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                      onClick={logoutHandler}
                      type="button"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-light-100 to-light-200 text-light-800 rounded-lg hover:from-light-200 hover:to-light-300 transition-all border border-primary-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: mobile search */}
      {!isAdminContext && (
        <div className="lg:hidden px-3 pb-3">
          <FreshSearchBar />
        </div>
      )}
    </header>
  );
};

export default TopBar;

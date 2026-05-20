import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineCamera,
  AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const navItemClass =
    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-primary-50 hover:text-primary-600";

  return (
    <aside
      id="navigation-container"
      style={{ zIndex: 9999 }}
      className="hidden lg:flex flex-col justify-between p-3 text-light-800 bg-gradient-to-b from-white to-light-50 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-primary-200 shadow-light-lg"
    >
      <div className="flex flex-col space-y-1 pt-2">
        <Link to="/" className={navItemClass}>
          <AiOutlineHome size={24} />
          <span className="nav-item-name whitespace-nowrap">HOME</span>
        </Link>

        <Link to="/shop" className={navItemClass}>
          <AiOutlineShopping size={24} />
          <span className="nav-item-name whitespace-nowrap">SHOP</span>
        </Link>

        <Link to="/visual-search" className={navItemClass}>
          <AiOutlineCamera size={24} />
          <span className="nav-item-name whitespace-nowrap">VISUAL SEARCH</span>
        </Link>

        <Link to="/cart" className={`${navItemClass} relative`}>
          <AiOutlineShoppingCart size={24} />
          <span className="nav-item-name whitespace-nowrap">Cart</span>
          {cartCount > 0 && (
            <span className="absolute left-6 top-1 min-w-[18px] h-[18px] px-1 text-xs text-white bg-pink-500 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/favorite" className={`${navItemClass} relative`}>
          <AiOutlineHeart size={24} />
          <span className="nav-item-name whitespace-nowrap">Favorites</span>
          <FavoritesCount />
        </Link>
      </div>

      <div className="relative pb-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center text-gray-800 focus:outline-none w-full px-3"
          type="button"
        >
          {userInfo && (
            <>
              <span className="nav-item-name text-sm font-medium text-primary-700 truncate">
                {userInfo.username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-auto shrink-0 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute left-0 right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-100 text-gray-600 text-sm overflow-hidden ${
              userInfo.isAdmin ? "" : ""
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Navigation;

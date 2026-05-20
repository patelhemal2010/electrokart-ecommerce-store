import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineCamera,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
import FavoritesCount from "../pages/Products/FavoritesCount";

const navLinkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center flex-1 min-w-0 py-2 px-1 text-[10px] sm:text-xs font-medium transition-colors ${
    isActive ? "text-primary-600" : "text-gray-500"
  }`;

const MobileBottomNav = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] safe-area-pb"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto h-14 sm:h-16">
        <NavLink to="/" end className={navLinkClass}>
          <AiOutlineHome className="text-xl sm:text-2xl mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/shop" className={navLinkClass}>
          <AiOutlineShopping className="text-xl sm:text-2xl mb-0.5" />
          <span>Shop</span>
        </NavLink>

        <NavLink to="/visual-search" className={navLinkClass}>
          <AiOutlineCamera className="text-xl sm:text-2xl mb-0.5" />
          <span className="truncate max-w-[4rem]">Search</span>
        </NavLink>

        <NavLink to="/cart" className={navLinkClass}>
          <span className="relative">
            <AiOutlineShoppingCart className="text-xl sm:text-2xl mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-pink-500 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </NavLink>

        <NavLink to="/favorite" className={navLinkClass}>
          <span className="relative flex flex-col items-center">
            <AiOutlineHeart className="text-xl sm:text-2xl mb-0.5" />
            <FavoritesCount />
          </span>
          <span>Wishlist</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

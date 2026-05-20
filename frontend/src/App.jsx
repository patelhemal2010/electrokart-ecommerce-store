import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import MobileBottomNav from "./components/MobileBottomNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "./components/TopBar";
import AdminNavigation from "./pages/Admin/AdminNavigation";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import { useDispatch } from "react-redux";
import { useAllProductsQuery } from "./redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "./redux/api/categoryApiSlice";
import { setProducts, setCategories } from "./redux/features/shop/shopSlice";

const App = () => {
  const dispatch = useDispatch();
  const { data: productsData = [] } = useAllProductsQuery();
  const { data: categoriesData = [] } = useFetchCategoriesQuery();

  useEffect(() => {
    if (productsData.length > 0) {
      dispatch(setProducts(productsData));
    }
    if (categoriesData.length > 0) {
      dispatch(setCategories(categoriesData));
    }
  }, [productsData, categoriesData, dispatch]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminAuthPage =
    location.pathname === "/admin/login";
  const isAuthPage = 
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ToastContainer />
      <TopBar />
      {!isAdminRoute && !isAuthPage && <Navigation />}
      {!isAdminRoute && !isAuthPage && <MobileBottomNav />}
      {isAdminRoute && !isAdminAuthPage && <AdminNavigation />}
      <main
        className={`flex-1 w-full max-w-full transition-all duration-300 px-2 sm:px-4 ${
          isAuthPage
            ? "ml-0 py-6"
            : isAdminRoute && !isAdminAuthPage
              ? "ml-0 md:ml-[15%] py-4 sm:py-6"
              : "ml-0 lg:ml-16 py-4 sm:py-6 pb-20 lg:pb-6"
        }`}
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        {/* All nested routes will render here */}
        <Outlet />
      </main>
      {/* Footer - Only show on non-admin pages and non-auth pages */}
      {!isAdminRoute && !isAuthPage && <Footer />}
      {/* AI Chatbot - Available on all pages */}
      <Chatbot />
    </div>
  );
};

export default App;

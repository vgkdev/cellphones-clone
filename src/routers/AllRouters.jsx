import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProductPage from "../pages/dashboard/ProductsPage";
import CustomersPage from "../pages/dashboard/CustomersPage";
import DatabaseControlPage from "../pages/dashboard/DatabaseControlPage";
import HomePage from "../pages/shopping/Homepage";
import NavBar from "../components/navBar/NavBar";
import PreviewProductPage from "../pages/dashboard/PreviewProductPage";
import MainHomePage from "../pages/shopping/MainHomePage";
import ViewPostPage from "../pages/shopping/ViewPostPage";
import SignInShopping from "../pages/auth/SignInShopping";
import UnauthorizedPage from "../components/UnauthorizedEntryPage";
import ProductDetailPage from "../pages/shopping/ProductDetailPage";
import PageNotFound from "../components/PageNotFound";
import CartPage from "../pages/shopping/CartPage";
import EditProfilePage from "../pages/auth/EditProfilePage";
import UserSettingPage from "../pages/shopping/UserSettingPage";
import Checkout from "../components/order/Checkout";
import EventPage from "../pages/dashboard/EventPage";
import VoucherPage from "../pages/dashboard/VoucherPage";
import Footer from "../components/footer/Footer";
import OrderManagementPage from "../pages/dashboard/OrderManagementPage";
import { Box, Button } from "@mui/material";
import Voucher from "../pages/shopping/Voucher";
import LoginReminder from "../components/miscellaneous/LoginReminder";
import ChatSandbox from "../components/chat/ChatSandbox";
import { ChatBubble } from "@mui/icons-material";
import ChatButton from "../components/chat/ChatButton";
import UserOrderPage from "../pages/shopping/UserOrderPage";
import AccessoriesPage from "../pages/dashboard/AccessoriesPage";
import CustomerSupportButton from "../components/chat/CustomerSupportButton";
import CustomerChatPage from "../pages/dashboard/CustomerChatPage";

const AllRoutes = () => {
  const user = useSelector((state) => state.user.user);
  console.log(">>>check user: ", user);
  const isStaffOrAdmin = user ? user.isStaff || user.isManager : false;
  const isAdmin = user ? user.isManager : false;

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NavBar />

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            {/* -------------------shopping-------------------- */}
            <Route path="/" element={<Navigate to="/shopping/homepage" />} />
            <Route
              path="/shopping"
              element={<Navigate to="/shopping/homepage" />}
            />
            <Route path="/shopping/homepage" element={<MainHomePage />} />
            <Route path="/shopping/all-products" element={<HomePage />} />
            <Route
              path="/shopping/all-products/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="/shopping/sign-up" element={<SignUp />}></Route>
            <Route
              path="/shopping/sign-in"
              element={<SignInShopping />}
            ></Route>
            <Route
              path="/shopping/view-post"
              element={<ViewPostPage />}
            ></Route>
            <Route
              path="/shopping/cart"
              element={user ? <CartPage /> : <LoginReminder />}
            ></Route>
            <Route
              path="/shopping/edit-profile"
              element={user ? <EditProfilePage /> : <LoginReminder />}
            ></Route>
            <Route
              path="/shopping/user-setting"
              element={user ? <UserSettingPage /> : <LoginReminder />}
            ></Route>
            <Route path="/shopping/checkout" element={<Checkout />}></Route>
            <Route
              path="/shopping/voucher"
              element={user ? <Voucher /> : <LoginReminder />}
            ></Route>
            <Route
              path="/shopping/orders"
              element={user ? <UserOrderPage /> : <LoginReminder />}
            ></Route>

            {/* -------------------dashboard-------------------- */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Navigate to="/dashboard/dashboard" />
                ) : (
                  <Navigate to="/dashboard/sign-in" />
                )
              }
            />
            <Route
              path="/dashboard/dashboard"
              element={
                isStaffOrAdmin ? <DashboardPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/products"
              element={isStaffOrAdmin ? <ProductPage /> : <UnauthorizedPage />}
            />
            <Route
              path="/dashboard/customers"
              element={
                isStaffOrAdmin ? <CustomersPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/staffs"
              element={
                isAdmin ? (
                  <CustomersPage showStaffs={true} />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
            <Route
              path="/dashboard/database-control"
              element={
                isStaffOrAdmin ? <DatabaseControlPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/events-management"
              element={isStaffOrAdmin ? <EventPage /> : <UnauthorizedPage />}
            />
            <Route
              path="/dashboard/vouchers-managemnent"
              element={isStaffOrAdmin ? <VoucherPage /> : <UnauthorizedPage />}
            />
            <Route
              path="/dashboard/accessories-management"
              element={
                isStaffOrAdmin ? <AccessoriesPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/orders-management"
              element={
                isStaffOrAdmin ? <OrderManagementPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/customer-support"
              element={
                isStaffOrAdmin ? <CustomerChatPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/products/preview-product"
              element={
                isStaffOrAdmin ? <PreviewProductPage /> : <UnauthorizedPage />
              }
            />
            <Route
              path="/dashboard/chat/chat-sandbox"
              element={isStaffOrAdmin ? <ChatSandbox /> : <UnauthorizedPage />}
            />
            <Route path="/dashboard/sign-in" element={<SignIn />}></Route>

            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Footer />
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 50,
          right: 50,
          zIndex: 100,
          flexDirection: "row",
          display: "flex",
          gap: 2,
        }}
      >
        <CustomerSupportButton />
        <ChatButton />
      </Box>
    </Router>
  );
};

export default AllRoutes;

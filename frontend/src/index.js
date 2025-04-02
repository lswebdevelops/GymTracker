import React from "react";
import ReactDOM from "react-dom/client";
import HomeScreen from "./screens/HomeScreen";
import HomeBookScreen from "./screens/HomeBookScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import BooksScreen from "./screens/BooksScreen";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderListScreen from "./screens/admin/OrderListScreen";
import BookListScreen from "./screens/admin/BookListScreen";
import BookEditScreen from "./screens/admin/BookEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import PoemListScreen from "./screens/admin/PoemListScreen"; // Import PoemListScreen
import PoemEditScreen from "./screens/admin/PoemEditScreen"; // Import PoemEditScreen
import PoemCreateScreen from "./screens/admin/PoemCreateScreen"; // Import PoemCreateScreen
import PoemScreen from "./screens/PoemScreen";

import BlogListScreen from "./screens/admin/BlogListScreen"; 
import BlogEditScreen from "./screens/admin/BlogEditScreen"; 
import BlogScreen from "./screens/BlogScreen";
import BlogDetailsScreen from "./screens/BlogDetailsScreen"
import BlogCreateScreen from "./screens/admin/BlogCreateScreen";


import BiographyScreen from "./screens/BiographyScreen";
import UsersEmailListScreen from "./screens/admin/UsersEmailListScreen"; // Import UsersEmailListScreen
import UpcomingScreen from "./screens/UpcomingScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/book/:id" element={<HomeBookScreen />} />
      <Route path="/cart/" element={<CartScreen />} />
      <Route path="/login/" element={<LoginScreen />} />
      <Route path="/register/" element={<RegisterScreen />} />
      <Route path="/poems" element={<PoemScreen />} />
      <Route path="/poem/:id" element={<PoemScreen />} />
      <Route path="/biography" element={<BiographyScreen />} />
      <Route path="/books" element={<BooksScreen />} />

      <Route path="/blogs" element={<BlogScreen />} />
      <Route path="/blog/:id" element={<BlogDetailsScreen  />} />
      <Route path="/upcoming" element={<UpcomingScreen />} />

      {/* user private route */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping/" element={<ShippingScreen />} />
        <Route path="/payment/" element={<PaymentScreen />} />
        <Route path="/placeorder/" element={<PlaceOrderScreen />} />
        <Route path="/order/:id/" element={<OrderScreen />} />
        <Route path="/profile/" element={<ProfileScreen />} />
      </Route>

      {/* admin routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist/" element={<OrderListScreen />} />
        <Route path="/admin/booklist/" element={<BookListScreen />} />
        <Route
          path="/admin/booklist/:pageNumber/"
          element={<BookListScreen />}
        />
        <Route path="/admin/book/:id/edit" element={<BookEditScreen />} />
        <Route path="/admin/userlist/" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/admin/email-list" element={<UsersEmailListScreen />} />

        {/* Poem admin routes */}
        <Route path="/admin/poemlist/" element={<PoemListScreen />} />{" "}           
        <Route path="/admin/poem/create" element={<PoemCreateScreen />} />{" "}       
        <Route path="/admin/poem/:id/edit" element={<PoemEditScreen />} />{" "}
       
        {/* Blog admin routes */}
        <Route path="/admin/bloglist/" element={<BlogListScreen />} />{" "}           
        <Route path="/admin/blog/create" element={<BlogCreateScreen />} />{" "}       
        <Route path="/admin/blog/:id/edit" element={<BlogEditScreen />} />{" "}
       
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
              <RouterProvider router={router} />
          </Provider>
  </React.StrictMode>
);

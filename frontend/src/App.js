import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from './slices/usersApiSlice';
import { setCredentials } from './slices/authSlice';
import Loader from './components/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // State to track if the profile has been successfully fetched and loaded
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Determine if the getProfile query should be skipped.
  // It should run if there's userInfo in localStorage (indicating a logged-in user)
  // but the Redux userInfo state hasn't been fully hydrated with the profile data yet.
  const shouldSkipProfileQuery = !localStorage.getItem('userInfo'); // Skip if no userInfo in localStorage

  const { data: profileData, isLoading: isLoadingProfile, isSuccess: isProfileSuccess, isError: isProfileError } = useGetProfileQuery(undefined, {
    skip: shouldSkipProfileQuery,
  });

  useEffect(() => {
    // This effect runs when the query for profile data changes state
    if (isProfileSuccess && profileData) {
      // If profile data is successfully fetched, update Redux state
      dispatch(setCredentials(profileData));
      setProfileLoaded(true); // Mark profile as loaded
    } else if (isProfileError) {
      console.error("Failed to fetch user profile on app load:", profileData);
      setProfileLoaded(true); // Still mark as loaded to avoid infinite loader, but handle error
      // You might want to dispatch a logout action here if the token is invalid
    } else if (!isLoadingProfile && shouldSkipProfileQuery) {
      // If not loading, and we skipped the query (meaning no user info in localStorage),
      // we can consider the profile "loaded" for an unauthenticated user.
      setProfileLoaded(true);
    }
  }, [isProfileSuccess, profileData, isProfileError, isLoadingProfile, shouldSkipProfileQuery, dispatch]);

  // Show loader if profile is not yet loaded
  if (!profileLoaded) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet /> {/* Render Outlet only after profile is loaded */}
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;

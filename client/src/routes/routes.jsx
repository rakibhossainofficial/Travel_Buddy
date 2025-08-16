import DashboardLayout from "@/layouts/DashboardLayouts";
import MainLayout from "@/layouts/MainLayout";
import PrivateLayout from "@/layouts/PrivateLayout";
import ProtectedAuthLayout from "@/layouts/ProtectedAuthLayout";
import AboutPage from "@/pages/AboutPage";
import Community from "@/pages/Community";
import AddPackage from "@/pages/dashboard/AddPackage";
import AddStory from "@/pages/dashboard/AddStory";
import AllTrips from "@/pages/dashboard/AllTrips";
import ApplyGuide from "@/pages/dashboard/ApplyGuide";
import AssignedTours from "@/pages/dashboard/AssignedTours";
import BookPackage from "@/pages/dashboard/BookPackage";
import EditStory from "@/pages/dashboard/EditStory";
import ManageCandidates from "@/pages/dashboard/ManageCandidates";
import ManageProfile from "@/pages/dashboard/ManageProfile";
import ManageStories from "@/pages/dashboard/ManageStories";
import ManageUsers from "@/pages/dashboard/ManageUsers";
import MyBookings from "@/pages/dashboard/MyBookings";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OfferAnnouncements from "@/pages/OfferAnnoucement";
import PackageDetails from "@/pages/PackageDetails";
import PaymentPage from "@/pages/Payment";
import PaymentHistory from "@/pages/PaymentHistory";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Register from "@/pages/Register";
import StoryDetails from "@/pages/StoryDetails";
import TourGuideProfile from "@/pages/TourGuideProfile";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "guides-profile/:id",
        element: <TourGuideProfile />,
      },
      {
        path: "all-trips",
        element: <AllTrips />,
      },
      {
        path: "package/:id",
        element: <PackageDetails />,
      },
      {
        path: "story-details/:id",
        element: <StoryDetails />,
      },
      {
        path: "offers",
        element: <OfferAnnouncements />,
      },
    ],
  },
  {
    path: "/auth",
    element: <ProtectedAuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ManageProfile />,
          },
          {
            path: "add-story",
            element: <AddStory />,
          },
          {
            path: "stories",
            element: <ManageStories />,
          },
          {
            path: "edit-story/:id",
            element: <EditStory />,
          },
          {
            path: "apply-guide",
            element: <ApplyGuide />,
          },
          {
            path: "bookings",
            element: <MyBookings />,
          },
          {
            path: "add-package",
            element: <AddPackage />,
          },
          {
            path: "book/:id",
            element: <BookPackage />,
          },
          {
            path: "payment/:id",
            element: <PaymentPage />,
          },
          {
            path: "payment-success",
            element: <PaymentSuccess />,
          },
          {
            path: "payments",
            element: <PaymentHistory />,
          },
          {
            path: "tours",
            element: <AssignedTours />,
          },
          {
            path: "users",
            element: <ManageUsers />,
          },
          {
            path: "candidates",
            element: <ManageCandidates />,
          },
        ],
      },
    ],
  },
]);

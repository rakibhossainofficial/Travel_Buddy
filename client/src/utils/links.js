export const navLinks = [
  { label: "Home", path: "/", isPrivate: false },
  { label: "Community", path: "/community", isPrivate: false },
  { label: "About Us", path: "/about", isPrivate: false },
  { label: "Trips", path: "/trips", isPrivate: false },
  { label: "Login", path: "/login", isPrivate: false },
  { label: "Register", path: "/register", isPrivate: false },
  { label: "Dashboard", path: "/dashboard", isPrivate: true },
  { label: "Offer Announcements", path: "/offers", isPrivate: true },
];

export const dashboardLinks = {
  tourist: [
    { label: "Manage Profile", path: "/dashboard" },
    { label: "My Bookings", path: "/dashboard/bookings" },
    { label: "Manage Stories", path: "/dashboard/stories" },
    { label: "Add Story", path: "/dashboard/add-story" },
    { label: "Join as Tour Guide", path: "/dashboard/apply-guide" },
  ],
  guide: [
    { label: "Manage Profile", path: "/dashboard" },
    { label: "My Assigned Tours", path: "/dashboard/tours" },
    { label: "Manage Stories", path: "/dashboard/stories" },
    { label: "Add Story", path: "/dashboard/add-story" },
  ],
  admin: [
    { label: "Manage Profile", path: "/dashboard" },
    { label: "Add Package", path: "/dashboard/add-package" },
    { label: "Manage Users", path: "/dashboard/users" },
    { label: "Manage Candidates", path: "/dashboard/candidates" },
  ],
};

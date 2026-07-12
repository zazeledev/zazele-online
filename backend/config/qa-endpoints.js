module.exports = [
  {
    name: "Health status check",
    method: "GET",
    path: "/api/health",
    expected: [200]
  },
  {
    name: "Login validator check",
    method: "POST",
    path: "/api/auth/login",
    expected: [200, 400]
  },
  {
    name: "Registration constraints check",
    method: "POST",
    path: "/api/auth/register",
    expected: [400]
  },
  {
    name: "Student Profile information",
    method: "GET",
    path: "/api/student/profile",
    expected: [200, 401]
  },
  {
    name: "Admin Profile Update Requests",
    method: "GET",
    path: "/api/admin/profile-update-requests",
    expected: [200, 401]
  },
  {
    name: "Notifications listings",
    method: "GET",
    path: "/api/notifications",
    expected: [200, 401]
  },
  {
    name: "Courses modules directory",
    method: "GET",
    path: "/api/courses/modules",
    expected: [200]
  },
  {
    name: "Upcoming Events listings",
    method: "GET",
    path: "/api/events/upcoming",
    expected: [200]
  },
  {
    name: "Uploads logo resource check",
    method: "GET",
    path: "/assets/logo.png",
    expected: [200]
  }
];

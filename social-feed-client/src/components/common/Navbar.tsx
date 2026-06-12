import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { NOTIFICATIONS_QUERY } from "../../graphql/queries/notification";
import type { Notification } from "../../types/notification";
import { useSubscription } from "@apollo/client/react";
import { NEW_NOTIFICATION } from "../../graphql/subscriptions/notification";
import { useMutation } from "@apollo/client/react";
import { MARK_NOTIFICATIONS_AS_READ } from "../../graphql/mutations/notification";

const Navbar = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const { data, loading, error } = useQuery(NOTIFICATIONS_QUERY);

  // inital Notifications Seed

  const getMessage = (n: Notification) => {
    if (n.type === "FOLLOW") {
      return `${n.fromUser.displayName} followed you`;
    }

    if (n.type === "LIKE") {
      return `${n.fromUser.displayName} liked your post`;
    }

    return `${n.fromUser.displayName} commented on your post`;
  };

  useEffect(() => {
    if (data?.notifications) {
      setAllNotifications(data.notifications);
    }
  }, [data]);

  // const [
  //   deleteCommentMutation,
  //   { loading: deleteCommentLoading, error: deleteMutationError },
  // ] = useMutation(DELETE_COMMENT_MUTATION, {
  //   refetchQueries: [{ query: COMMENT_QUERY, variables: { postId: id } }],
  // });

  const [
    markNotificationsAsReadMutation
  ] = useMutation(MARK_NOTIFICATIONS_AS_READ);

  useSubscription(NEW_NOTIFICATION, {
    onData: ({ data }) => {
      const newNotification = data.data?.newNotification;
      if (newNotification)
        setAllNotifications((prev) => [newNotification, ...prev]);
    },
  });
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification["type"]) => {
    if (type === "FOLLOW") return "👤";
    if (type === "LIKE") return "❤️";
    return "💬";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/feed" className="text-lg font-bold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors">
          SocialFeed
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            to="/feed"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/feed"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link
            to="/search"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/search"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!isOpen) {
                  markNotificationsAsReadMutation();
                  setAllNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                  );
                }
                setIsOpen(!isOpen);
              }}
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {allNotifications.length > 0 && (
                    <span className="text-xs text-gray-400">{allNotifications.length} total</span>
                  )}
                </div>

                {loading && (
                  <div className="px-4 py-6 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                )}
                {error && (
                  <p className="px-4 py-3 text-xs text-red-500">{error.message}</p>
                )}

                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {!loading && allNotifications.length === 0 ? (
                    <li className="px-4 py-8 text-center">
                      <p className="text-2xl mb-2">🔔</p>
                      <p className="text-sm text-gray-400">No notifications yet</p>
                    </li>
                  ) : (
                    allNotifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                          !notification.isRead ? "bg-indigo-50/60" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base mt-0.5 shrink-0">{getIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-snug">{getMessage(notification)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(Number(notification.createdAt)).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Avatar + name — click to own profile */}
          <button
            type="button"
            onClick={() => navigate(`/profile/${user?.username}`)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.displayName}
            </span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

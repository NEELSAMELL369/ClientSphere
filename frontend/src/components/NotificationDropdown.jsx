import { useNotifications } from "../context/NotificationContext";

const NotificationDropdown = () => {
  const {
    notifications,
    loading,
    markAsReadFn,
    deleteNotificationFn,
  } = useNotifications();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-80 bg-white shadow-xl rounded-lg p-3">
      <h3 className="font-bold text-lg mb-2">Notifications</h3>

      {notifications.length === 0 && (
        <p className="text-gray-500 text-center">No notifications</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`border-b p-3 flex justify-between items-start ${
            n.isRead ? "bg-gray-100" : "bg-blue-50"
          }`}
        >
          <div>
            <p className="font-medium">{n.type || "Activity"}</p>
            <p className="text-sm text-gray-600">{n.activity?.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {!n.isRead && (
              <button
                onClick={() => markAsReadFn(n.id)}
                className="text-blue-600 text-xs hover:underline"
              >
                Mark read
              </button>
            )}

            <button
              onClick={() => deleteNotificationFn(n.id)}
              className="text-red-600 text-xs hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationDropdown;

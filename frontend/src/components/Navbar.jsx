import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-amber-200 flex justify-between px-15 h-12 rounded-2xl items-center">
      <p className="font-semibold">
        Hello, <span>{user.name}</span>
      </p>
      <ul className="">
        <li>
          {user.role === "ADMIN" ? (
            <span>
              <strong>Company Id: </strong> {user.companyId}
            </span>
          ) : (
            <span>
              <strong>My Id </strong> {user.id}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

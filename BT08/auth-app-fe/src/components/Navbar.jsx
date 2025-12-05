import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/products" className="navbar-logo">
          UTE Shop
        </Link>
        <Link
          to="/dashboard"
          className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          to="/products"
          className={`navbar-link ${isActive("/products") ? "active" : ""}`}
        >
          Sản phẩm
        </Link>
        <Link
          to="/cart"
          className={`navbar-link ${isActive("/cart") ? "active" : ""}`}
        >
          Giỏ hàng
        </Link>
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <>
            <span className="navbar-user">
              Xin chào, <strong>{currentUser.name || currentUser.email}</strong>
            </span>
            <button className="navbar-btn outline" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`navbar-link ${isActive("/login") ? "active" : ""}`}
            >
              Đăng nhập
            </Link>
            <Link to="/register" className="navbar-btn">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

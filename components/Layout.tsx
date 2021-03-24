import Link from "next/link";
import { ToastContainer } from "react-toastify";

export default function Layout({ children }) {
  return (
    <div>
      <nav
        className="navbar navbar-expend-lg navbar-light md-3"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container">
          <div className="mr-auto">
            <a className="navbar-brand" href="#">
              Navbar
            </a>
          </div>
          <form className="d-flex">
            <Link href="/">
              <a>戻る</a>
            </Link>
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
      <div className="container">{children} </div>
      <ToastContainer />
    </div>
  );
}
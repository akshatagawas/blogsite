import {Link} from "react-router-dom";

export default function Header(){
    return(
        <header>
        <Link to="" className="logo">BLOGsite</Link>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="">Register</Link>
        </nav>
      </header>
    );
}
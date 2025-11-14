import { Link } from "react-router-dom";
import "../pages.css";

const Profile=()=>{
    return(
        <div>
            <ul className="nav-links">
                <li className="header-list"><Link to="/home">Home</Link></li>
                <li className="header-list"><Link to="/logout">Logout</Link></li>
          </ul>
            <div className="container"><h1>Hi Student. You can see your details here.</h1></div>
        </div>
        
        
    )
}
export default Profile
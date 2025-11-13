import { Link } from "react-router-dom";
import "../pages.css"

const Students =()=>{
    return (
        <div>
            <ul className="nav-links">
                <li className="header-list"><Link to="/home">Home</Link></li>
                <li className="header-list"><Link to="/logout">Logout</Link></li>
          </ul>
          <div className="container">
            <h1 className="heading">Hi Admin! you can see the list of students and their details Here.</h1>
          </div>

        </div>
        
        
    )
    
}
export default Students
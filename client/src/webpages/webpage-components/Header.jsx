import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavbarText
} from "reactstrap";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
 
  return (
    <Navbar dark expand="md">
      <h1 class="logo">Stock Analyst</h1>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <nav>
            <ul>
              <NavItem>
                <li>
                  <Link to={process.env.PUBLIC_URL + '/'}>
                    Home
                  </Link>
                </li>
              </NavItem>
              <NavItem>
                <li>
                  <Link to="/Stocks">
                    Stocks
                  </Link>
                </li>
              </NavItem>
            </ul>
          </nav>
        </Nav>
        <NavbarText>
          <div class="login-container">
            {localStorage.getItem("token") === null
              ?
              //render login & register button
              <div>
                <Link to="/Register">
                <button type="submit">
                    Register
                  </button></Link>

                  <Link to="/Login">
                  <button type="submit">
                    Login
                  </button></Link>
              </div>
              :
              //render logout button
              <button type="submit" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("expiry");
                window.location.reload(false);
              }}  
              >
                Logout
              </button>
           }
          </div>
        </NavbarText>
      </Collapse>
    </Navbar>
  );
};

export default Header;

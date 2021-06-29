import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./webpages/Home";
import Quote from "./webpages/Quote";
import Stocks from "./webpages/Stocks";
import Register from "./webpages/Register";
import Login from "./webpages/Login";
import Footer from "./webpages/webpage-components/Footer";
import Header from "./webpages/webpage-components/Header";


export default function App() {
  const token = localStorage.getItem("token");
  const expiryDate = localStorage.getItem("expiry");


  //everytime App renders check if the jwt-token is expired
  if (token !== null && Date.now() >= expiryDate) {
    console.log("token expired");
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path={process.env.PUBLIC_URL + '/'}>
            <Home />
          </Route>
          <Route path="/Stocks" component={Stocks} />
          <Route path="/Quote/:symbol" component={Quote} />
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

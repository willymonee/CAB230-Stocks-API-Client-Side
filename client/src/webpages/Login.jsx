import React, {useState} from "react";
import jwt from "jsonwebtoken";
import { useHistory } from 'react-router-dom';

export default function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const url = "http://131.181.190.87:3000/user/login";
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

    return (
      <div>
        <h1>Login Page</h1>
        <form className="forms"
            onSubmit={(event) => {
                event.preventDefault();
                fetch(url, {
                    method: "post",
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      email: email,
                      password: password
                    })
                  })
                    .then((res) => res.json())
                    .then((data) => {
                        let decodeToken = jwt.decode(data.token);
                        if (decodeToken === null)
                        {
                          setError(data.error);
                          setErrorMessage(data.message);
                        }
                        else {
                          console.log(decodeToken);
                          console.log(decodeToken.exp);
                          let expire = decodeToken.exp * 1000;
                          localStorage.setItem("expiry", expire);
                          localStorage.setItem("token", data.token);
                          //re-direct to homepage then re-render to show changes
                          history.push(process.env.PUBLIC_URL + '/');
                          history.go(); 
                      }
                    }); 
              }}
          >
            <label htmlFor="email">Email:</label>
            <input 
                id="email" 
                name="email" 
                type="text" 
                placeholder="Enter Email"
                value={email}
                onChange={event => {
                    const {value} = event.target;
                    setEmail(value);
                  
                }}
                />
            <label htmlFor="password">Password:</label>
            <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={event => {
                    const {value} = event.target;
                    setPassword(value);
                    }}
                />
            <button type="submit">Submit</button>
        </form>
        
        {error
          ? <p>{errorMessage}</p>
          : null
        }
    </div>
  );
}
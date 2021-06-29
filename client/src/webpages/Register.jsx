import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

export default function Register() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const url = "http://131.181.190.87:3000/user/register";
    const history = useHistory();
    
    return (
      <div>
        <h1>Register</h1>
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
                      console.log(data);
                      setMessage(data.message);
                      setError(data.error);
                      setSuccess(data.success);
                      if (data.error !== true){
                        history.push("/Login"); 
                      }
                  })
                ; 
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
          ?  <p>Error: {message} </p>
          :  null
        }
        {success
          ? <p>{message}</p>
          : null
        }
      </div>
    );
  }

  
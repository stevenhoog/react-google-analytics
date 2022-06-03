import React, {useState, useEffect} from "react";
import "./App.css";
import { renderButton, checkSignedIn } from "./utils";
import Report from './report';

function App() {  

  const [isSignedIn, setIsSignedIn] = useState(false);

  const updateSignin = (signedIn) => { //(3)
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const init = () => { //(2)
    checkSignedIn()
      .then((signedIn) => {
        updateSignin(signedIn);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  
  useEffect(() => {
    window.gapi.load("auth2", init); //(1)
  });

  return (
    <div className="App">
      {!isSignedIn ? (
        <div id="signin-button"></div>
      ) : (
        <Report />
      )}
    </div>
  );
} 

export default App;

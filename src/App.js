import React from "react";
import { useAuth } from "@frontegg/react";
import { AdminPortal } from "@frontegg/react";

function App() {
  const { user, isAuthenticated } = useAuth();
  const handleClick = () => {
    AdminPortal.show();
  };

  return (
    <div className="App">
      <button onClick={handleClick}>Settings</button>
      {isAuthenticated && (
        <div>
          <img src={user.profilePictureUrl} alt={user.name} />
          <span>{user.name}</span>
        </div>
      )}
    </div>
  );
}

export default App;

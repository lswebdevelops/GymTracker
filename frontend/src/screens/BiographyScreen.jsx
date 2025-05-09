import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gtLogo from "../assets/GymTracker-logo.png";

const BiographyScreen = () => {
  const [biography, setBiography] = useState([]);

  useEffect(() => {
    const fetchBiography = async () => {
      try {
        const response = await fetch("/api/biography");
        const data = await response.json();
        setBiography(data);
      } catch (error) {
        console.error("Failed to load biography:", error);
      }
    };

    fetchBiography();
  }, []);

  return (
    <div className="div-container-bio">
      {biography.map((bio) => (
        <div key={bio.name}>
          <h1>{bio.name}</h1>
          <div className="bio-container">
            <div style={{ flex: 1 }}>
              <p className="bio-content">{bio.bio}</p>
            </div>
          </div>
          <hr />
          <div className="gym-logo-aboutUs">
            <Link
            
              to="https://github.com/lswebdevelops"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={gtLogo} alt="gt-logo" style={{ height: "75px" }} /> Gym
              Tracker
            </Link>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default BiographyScreen;

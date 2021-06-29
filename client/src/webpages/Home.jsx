import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Hero />
    </div>
  );
}

const Hero = () => (
  <div class="hero">
    <div class="hero-wrapper">
      <h1>Welcome to Stock Analyst Portal</h1>
      <div class="hero-box">
        <Link to="/Stocks">
          Stocks
        </Link>
        <ol>
          <li>Search for all available companies (filtered by industries).</li>
          <li>Then select desired company to see stock quotes.</li>
          <li>Select stock quotes from a selected time frame</li>
        </ol>
      </div>
    </div>
  </div>
);

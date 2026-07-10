import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto max-w-md px-4 py-24 text-center">
    <p className="font-display text-6xl font-700 text-rust">404</p>
    <h1 className="mt-3 font-display text-2xl font-600">Page not found</h1>
    <p className="mt-2 text-slatewash">The listing or page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
  </div>
);

export default NotFound;

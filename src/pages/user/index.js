import React from "react";
import { Routes, Route } from "react-router-dom";
//
import Overview from "./Overview";

function UserView() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
    </Routes>
  );
}

export default UserView;

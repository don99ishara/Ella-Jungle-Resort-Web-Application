import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AgencyMyPackage from "./agencyMyPackage";

function AgencyHome() {

  const { userInfo } = useSelector((state) => state.auth);
const agencyId = userInfo._id;

  return (
    <div>
      <div>
        <AgencyMyPackage />

      </div>
    </div>
  );
}

export default AgencyHome;
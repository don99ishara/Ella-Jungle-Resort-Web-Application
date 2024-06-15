import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./agencyStarRating";
import axios from "axios";
import { useSelector } from 'react-redux';


function AgencyDetailsProfile() {

  const { agencyId } = useParams();
  const { userInfo } = useSelector(state => state.auth);
  const userId = userInfo.userId;

  const [agencyData, setAgencyData] = useState({
    agencyName: "",
    address: "",
    img: "",
    mobile: "",
    businessRegistrationNumber: "",
    representerMail: "",
    businessMail: "",
    fax: "",
    taxIdNumber: "",
    description: "",
    websiteLink: "",
    rating: "",
    agentId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/api/agencies/get/${agencyId}`
        );
        const { data } = result; // Extract data from the result object
        setAgencyData(data); // Set the agencyData state with the received data
      } catch (error) {
        console.error("Error fetching agency data:", error);
      }
    };
    fetchData();
  }, [agencyId]);

  return (
    <div className="container flex flex-col min-h-[350px] mx-20 mt-3 ">
      <h1 className="self-start mt-3 mb-5 ml-3 text-4xl font-semibold">
        {agencyData.agencyName}
      </h1>
      <div className="flex items-start">
        <img
          className="ml-3 w-72 h-72 rounded-3xl"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/792c7ac941d0eed14463449a48a7e8eab3826f850bd35b8183438d15e0b42ad8?apiKey=bd6dc691d3624fe581379f78a6e48c90&"
          alt=""
        />
        <div className="flex flex-col items-start">
          <div className="flex pl-5 text-xl">
            <div>
              <p className="pb-4">Reg No:</p>
              <p className="pb-4">Address:</p>
              <p className="pb-4">Telephone:</p>
              <p className="pb-4">Email:</p>
              <p className="pb-4">Fax:</p>
            </div>
            <div className="ml-10">
              <p className="pb-4">{agencyData.businessRegistrationNumber}</p>
              <p className="pb-4"> {agencyData.address}</p>
              <p className="pb-4">{agencyData.mobile}</p>
              <p className="pb-4">{agencyData.businessMail}</p>
              <p className="pb-4">{agencyData.fax}</p>
            </div>
          </div>
          <div className="flex pl-5 mt-5 max-w-[700px]">
            <p>{agencyData.description}</p>
          </div>
          <div className="flex gap-5 my-5 ml-5">
            <a href={agencyData.websiteLink}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e554f3583ab683cda87bc919720bac4db0578a18c5a864f04c398686f5e83077?apiKey=bd6dc691d3624fe581379f78a6e48c90&"
                alt="facebook"
                className=" max-w-[50px]"
              />
            </a>
            <a href="www.facebook.com">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/24d3dc882006ce9cc71830a0bc085fc2352963a4639e40d3c5695fdea8b352ac?apiKey=bd6dc691d3624fe581379f78a6e48c90&"
                alt="facebook"
                className=" max-w-[50px]"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyDetailsProfile;

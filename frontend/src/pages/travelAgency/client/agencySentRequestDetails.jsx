import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function AgencySentRequestDetails() {
  const { requestId } = useParams();
  const [agencyName, setAgencyName] = useState("");

  const currentDate = new Date().toISOString();

  const [requestData, setRequestData] = useState({
    ArrivalDate: "",
    DepartureDate: "",
    NoOfDays: "",
    NoOfNights: "",
    NoOfAdults: "",
    NoOfChildren: "",
    RoomType: "",
    RequestDescription: "",
    UserId: "",
    AgencyId: "",
    SentDate: "",
    Status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/getRequestId/${requestId}`
        );
        const {
          ArrivalDate,
          DepartureDate,
          NoOfDays,
          NoOfNights,
          NoOfAdults,
          NoOfChildren,
          RoomType,
          RequestDescription,
          UserId,
          AgencyId,
          SentDate,
          Status,
        } = result.data.clientRequest;
        setRequestData({
          ArrivalDate,
          DepartureDate,
          NoOfDays,
          NoOfNights,
          NoOfAdults,
          NoOfChildren,
          RoomType,
          RequestDescription,
          UserId,
          AgencyId,
          SentDate,
          Status,
        }); // Fetch agency details using AgencyId
        const agencyResult = await axios.get(
          `http://localhost:5000/api/agencies/get/${AgencyId}`
        );
        const { agencyName } = agencyResult.data; // Assuming the response contains the agencyName
        setAgencyName(agencyName);
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchData();
  }, [requestId]);

  const handleUpdateRequest = async () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "rgb(38, 219, 104)",
      denyButtonColor: "#3085d6",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`/UpdateRequest/${requestId}`, {
            ...requestData,

            UserId: requestData.UserId,
            AgencyId: requestData.AgencyId,
            SentDate: currentDate,
            Status: "pending",
          });
          Swal.fire("Saved!", "", "success").then(() => {
            window.location = `/profile`;
          });
        } catch (error) {
          console.error("Error updating request:", error);
          alert("Error updating request");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleDeleteRequest = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:5000/DeleteRequest/${requestId}`
          );
          Swal.fire({
            title: "Deleted!",
            text: "Your request has been deleted.",
            icon: "success",
          });
          window.location = `/profile`;
        } catch (error) {
          console.error("Error deleting request:", error);
          alert("Error deleting request");
        }
      }
    });
  };

  return (
    <div>
      <div className="flex bg-gray-200 rounded-2xl bg-opacity-60 container my-10  flex-col mx-auto  border border-green-500  max-w-[1000px] ">
        <div className="mt-3 text-2xl text-center">
          <h1>Send Request</h1>
        </div>

        <div className="flex mx-auto mt-10">
          <form>
            <div className="flex items-start text-xl font-medium text-gray-900 form-group">
              <div className="flex flex-col gap-2 mx-20 text-xl">
                <div className="flex items-start mb-2 ">
                  <label>Agency Name</label>
                  <h1 className=" text-green-500  ml-[70px] text-2xl">
                    {agencyName}
                  </h1>
                </div>
                <div className="flex items-start mb-2 ">
                  <label>Arrival Date</label>
                  <input
                    type="date"
                    id="arrivalDate"
                    name="ArrivalDate"
                    className="ml-[90px] rounded-lg border border-green-500 pl-3"
                    value={requestData.ArrivalDate}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        ArrivalDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-start mb-2">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    className="ml-[58px] rounded-lg border border-green-500 pl-3 "
                    id="departureDate"
                    name="DepartureDate"
                    value={requestData.DepartureDate}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        DepartureDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-start mb-2">
                  <label>Number of Days</label>
                  <input
                    type="number"
                    className="ml-[51px] w-16 rounded-lg border border-green-500 pl-3"
                    id="noOfDays"
                    name="NoOfDays"
                    value={requestData.NoOfDays}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        NoOfDays: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-start mb-2">
                  <label>Number of Nights</label>
                  <input
                    type="number"
                    className="ml-[40px] w-16 rounded-lg border border-green-500  pl-3"
                    id="noOfNights"
                    name="NoOfNights"
                    value={requestData.NoOfNights}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        NoOfNights: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-start mb-2">
                  <label>Number of Adults</label>
                  <input
                    type="number"
                    className="ml-[42px] w-16 rounded-lg border border-green-500  pl-3"
                    id="noOfAdults"
                    name="NoOfAdults"
                    value={requestData.NoOfAdults}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        NoOfAdults: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-start mb-2">
                  <label>Number of Children</label>
                  <input
                    type="number"
                    className="w-16 ml-[22px] rounded-lg border border-green-500  pl-3"
                    id="noOfChildren"
                    name="NoOfChildren"
                    value={requestData.NoOfChildren}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        NoOfChildren: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col mx-20 mt-[-5px]">
                <div className="flex mb-2">Room Type</div>
                <div className="relative inline-flex hs-dropdown">
                  <select
                    className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-green-500 rounded-lg shadow-sm hs-dropdown-toggle gap-x-2 hover:border-green-500 disabled:opacity-50 disabled:pointer-events-none "
                    aria-labelledby="hs-dropdown-default"
                    value={requestData.RoomType}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        RoomType: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Room Type
                    </option>
                    <option value="chalet">Eco Jungle Chalet</option>
                    <option value="cottage">Eco Jungle Cottage</option>
                    <option value="cabin">Eco Jungle Cabin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col mx-20 mt-5 mb-10">
              <div className="mb-2 text-xl font-medium text-gray-900">
                <label className="text-xl">Special Requests:</label>
              </div>
              <div>
                <textarea
                  className="w-[750px] max-h-[100px] h-[100px] border-green-500 border rounded-lg pt-3 pl-5"
                  name="RequestDescription"
                  id="RequestDescription"
                  value={requestData.RequestDescription}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      RequestDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <button
                id="spRequest"
                className="mx-20 border border-gray-300 mb-10 w-[200px] h-10 bg-green-500 rounded-full text-white text-lg font-semibold relative overflow-hidden group hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
                type="button" // Change type to button to prevent form submission
                onClick={handleUpdateRequest}
              >
                Update Request
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-40 ease"></span>
              </button>
              <button
                id="spRequest"
                className="border border-gray-300 mx-20 mb-10 w-[200px] h-10 bg-red-500 rounded-full text-white text-lg font-semibold relative overflow-hidden group hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300"
                type="button" // Change type to button to prevent form submission
                onClick={handleDeleteRequest}
              >
                Delete Request
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-40 ease"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgencySentRequestDetails;

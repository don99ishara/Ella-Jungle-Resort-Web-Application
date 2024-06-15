import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function AgencyRequestDetails() {
  const { requestId } = useParams();
  const [userData, setUserData] = useState({}); // [1] Define state for user data
  // * set initial state for request data
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

  // * Fetching request data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/getRequestId/${requestId}`);
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
        });
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchData();
  }, [requestId]);

  //fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/api/users/specific/${requestData.UserId}`);
        setUserData(result.data);
        console.log("User data:", result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [requestData.UserId]);

  // * Function to handle accepting request
  const handleAcceptRequest = async () => {
    try {
      const updatedRequest = await axios.put(`http://localhost:5000/UpdateRequest/${requestId}`, {
        ...requestData,
        UserId: requestData.UserId,
        AgencyId: requestData.AgencyId,
        Status: "accepted",
      });
      if (updatedRequest.data.message === "Request Updated") {
        Swal.fire({
          icon: "success",
          title: "Request Accepted!",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location = `/agencyHome/`;
          }
        });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      const updatedRequest = await axios.put(`http://localhost:5000/UpdateRequest/${requestId}`, {
        ...requestData,
        UserId: requestData.UserId,
        AgencyId: requestData.AgencyId,
        Status: "rejected",
      });
      if (updatedRequest.data.message === "Request Updated") {
        Swal.fire({
          icon: "success",
          title: "Request Rejected!",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location = `/agencyHome/`;
          }
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div>
      <div className='flex bg-gray-200 rounded-2xl bg-opacity-60 container my-10  flex-col mx-auto  border border-green-500  max-w-[1000px] '>
        <div className='mt-3 text-2xl text-center'>
          <h1>Received Request</h1>
        </div>

        <div className='flex mx-auto mt-10'>
          <form>
            <div className='flex items-start text-xl font-medium text-gray-900 form-group'>
              <div className='flex flex-col gap-2 mx-20 text-xl'>
                <div className='flex items-start mb-2 '>
                  <label>Client Name</label>
                  <h1 className=' text-green-500  ml-[70px] text-2xl'>{userData.name}</h1>
                </div>
                <div className='flex items-start mb-2 '>
                  <label>Arrival Date</label>
                  <input
                    type='date'
                    id='arrivalDate'
                    name='ArrivalDate'
                    className='ml-[92px] rounded-lg border border-green-500 pl-5 w-[160px]'
                    readOnly
                    value={requestData.ArrivalDate}
                  />
                </div>
                <div className='flex items-start mb-2'>
                  <label>Departure Date</label>
                  <input
                    type='date'
                    className='ml-[59px] rounded-lg border border-green-500 pl-5 w-[160px]'
                    id='departureDate'
                    name='DepartureDate'
                    value={requestData.DepartureDate}
                    readOnly
                  />
                </div>
                <div className='flex items-start mb-2'>
                  <label>Number of Days</label>
                  <input
                    type='number'
                    className='ml-[51px] w-16 rounded-lg border border-green-500 pl-5'
                    id='noOfDays'
                    name='NoOfDays'
                    value={requestData.NoOfDays}
                    readOnly
                  />
                </div>
                <div className='flex items-start mb-2'>
                  <label>Number of Nights</label>
                  <input
                    type='number'
                    className='ml-[40px] w-16 rounded-lg border border-green-500 pl-5'
                    id='noOfNights'
                    name='NoOfNights'
                    value={requestData.NoOfNights}
                    readOnly
                  />
                </div>
                <div className='flex items-start mb-2'>
                  <label>Number of Adults</label>
                  <input
                    type='number'
                    className='ml-[42px] w-16 rounded-lg border border-green-500 pl-5'
                    id='noOfAdults'
                    name='NoOfAdults'
                    value={requestData.NoOfAdults}
                    readOnly
                  />
                </div>
                <div className='flex items-start mb-2'>
                  <label>Number of Children</label>
                  <input
                    type='number'
                    className='w-16 ml-[22px] rounded-lg border border-green-500 pl-5'
                    id='noOfChildren'
                    name='NoOfChildren'
                    value={requestData.NoOfChildren}
                    readOnly
                  />
                </div>
              </div>

              <div className='flex flex-col mx-20 mt-[-5px] text-xl'>
                <div className='flex '>Room Type</div>
                <div className='relative inline-flex hs-dropdown'>
                  <select
                    className='inline-flex items-center px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-green-500 rounded-lg shadow-sm hs-dropdown-toggle gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none '
                    aria-labelledby='hs-dropdown-default'
                    value={requestData.RoomType}
                    readOnly
                  >
                    <option value='' disabled>
                      Select Room Type
                    </option>
                    <option value='chalet' disabled>
                      Eco Jungle Chalet
                    </option>
                    <option value='cottage' disabled>
                      Eco Jungle Cottage
                    </option>
                    <option value='cabin' disabled>
                      Eco Jungle Cabin
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className='flex flex-col mx-20 mt-5 mb-10'>
              <div className='mb-2 text-xl font-medium text-gray-900'>
                <label className='text-xl'>Special Requests:</label>
              </div>
              <div>
                <textarea
                  className='w-[750px] max-h-[100px] h-[100px] border-green-500 border rounded-lg p-5'
                  name='RequestDescription'
                  id='RequestDescription'
                  value={requestData.RequestDescription}
                  readOnly
                />
              </div>
            </div>
            {requestData.Status === "pending" && ( // Only render button for new requests
              <div>
                <button
                  id='spRequest'
                  className='border border-gray-300 mx-20 mb-10 w-[200px] h-10 bg-green-500 rounded-full text-white text-lg font-semibold relative overflow-hidden group hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300'
                  type='button' // Change type to button to prevent form submission
                  onClick={handleAcceptRequest}
                >
                  Accept Request
                  <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-40 ease'></span>
                </button>
                <button
                  id='spRequest'
                  className='border border-gray-300 mx-20 mb-10 w-[200px] h-10 bg-red-500 rounded-full text-white text-lg font-semibold relative overflow-hidden group hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300'
                  type='button' // Change type to button to prevent form submission
                  onClick={handleRejectRequest}
                >
                  Reject Request
                  <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-40 ease'></span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgencyRequestDetails;

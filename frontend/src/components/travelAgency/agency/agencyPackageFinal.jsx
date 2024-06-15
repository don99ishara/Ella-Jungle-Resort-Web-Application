import React, { useState, useEffect } from "react";
import axios from "axios";
import AgencyPackageRoom from "./agencyPackageRoom";
import AgencyPackageActivity from "./agencyPackageActivity";
import AgencyPackageTransport from "./agencyPackageTransport";
import Swal from "sweetalert2";

function AgencyPackageFinal({
  selectedRoomId,
  selectedActivityId,
  selectedTransportId,
  agencyId,
  packageId,
}) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState();
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [commission, setCommission] = useState(0);
  const [fullDays, setFullDays] = useState(0);
  const [packageImage, setPackageImage] = useState(null);

  // * Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getAgencyPackageById/${packageId}`);
        const packageDetails = response.data;

        // * Set package details
        setPackageName(packageDetails.packageName);
        setPackageDescription(packageDetails.packageDescription);
        setPrice(packageDetails.price);
        setDiscount(packageDetails.discount);
        setCommission(packageDetails.commission);
        setFullDays(packageDetails.fullDays);
        setPackageImage(packageDetails.packageImage || "No_Image.png");
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    if (packageId !== "null") {
      fetchPackageDetails();
    }
  }, [packageId]);

  const handleCreateOrUpdatePackage = async () => {
    if (!selectedRoomId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a room.",
      });
      return;
    }

    if (!packageName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter package name!",
      });
      return;
    }

    const packageImageData = packageImage ? packageImage : "No_Image.png";

    try {
      const formData = new FormData();
      formData.append("packageName", packageName);
      formData.append("packageImage", packageImageData);
      formData.append("roomId", selectedRoomId);
      formData.append("activityId", selectedActivityId || null);
      formData.append("transportId", selectedTransportId || null);
      formData.append("spaId", null);
      formData.append("fullDays", fullDays);
      formData.append("packageDescription", packageDescription);
      formData.append("commission", commission);
      formData.append("discount", discount);
      formData.append("price", price);
      formData.append("agencyId", agencyId);
      formData.append("published", false);

      if (packageId === "null") {
        // * Create new package
        const response = await axios.post("http://localhost:5000/addAgencyPackage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "New package added!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location = `/AgencyHome/`;
        });
      } else {
        // * Update existing package
        try {
          if (!packageImageData) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please select an image for the package.",
            });
            return;
          }
          const updatedPackageData = {
            packageName,
            packageImage: packageImageData,
            roomId: selectedRoomId,
            activityId: selectedActivityId || null,
            transportId: selectedTransportId || null,
            fullDays,
            packageDescription,
            commission,
            discount,
            price,
            agencyId,
            published: false,
          };

          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, update it!",
          }).then(async (result) => {
            const response = await axios.put(
              `http://localhost:5000/updateAgencyPackage/${packageId}`,
              updatedPackageData
            );

            console.log(response.data);

            Swal.fire({
              icon: "success",
              title: "Package updated!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location = `/AgencyPackageDetails/${packageId}`;
            });
          });
        } catch (error) {
          console.error("Error updating package:", error);
        }
      }
    } catch (error) {
      console.error("Error creating/updating package:", error);
    }
  };

  const handleFileChange = (e) => {
    setPackageImage(e.target.files[0]);
  };

  // * Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!selectedRoomId) return;
      try {
        const response = await axios.get(`http://localhost:5000/residence/rooms/${selectedRoomId}`);
        setSelectedRoom(response.data);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    if (selectedRoomId) {
      fetchRoomDetails();
    }
  }, [selectedRoomId]);

  // * Fetch activity details
  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!selectedActivityId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/SpecialActivity/get/${selectedActivityId}`
        );
        setSelectedActivity(response.data);
        console.log("hiiiii", response.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      }
    };

    if (selectedActivityId !== null && selectedActivityId !== undefined) {
      fetchActivityDetails();
    }
  }, [selectedActivityId]);

  console.log(selectedActivityId);

  // * Fetch transport details
  useEffect(() => {
    console.log("Fetching transport details...");
    const fetchTransportDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getTransportById/${selectedTransportId}`
        );
        console.log("Transport details response:", response.data);
        setSelectedTransport(response.data.transport);
      } catch (error) {
        console.error("Error fetching transport details:", error);
      }
    };

    if (selectedTransportId) {
      fetchTransportDetails();
    }
  }, [selectedTransportId]);

  // * Update package price
  const updatePrice = () => {
    const roomPrice = selectedRoom ? selectedRoom.price : 0;
    const activityPrice = selectedActivity ? selectedActivity.price : 0;
    const transportPrice = selectedTransport ? selectedTransport.pricePerKm : 0;

    const packagePrice = roomPrice + activityPrice + transportPrice;

    const commissionValue = (commission / 100) * packagePrice;
    const discountValue = (discount / 100) * packagePrice;

    const finalPrice = packagePrice + commissionValue - discountValue;

    setPrice(finalPrice);
  };

  console.log(selectedActivity);

  return (
    <div>
      <div className='pointer-events-none'>
        {selectedRoom && (
          <AgencyPackageRoom
            roomId={selectedRoom.id}
            roomName={selectedRoom.roomName}
            image={selectedRoom.image}
            description={selectedRoom.description}
            price={selectedRoom.price}
          />
        )}

        {selectedActivity && (
          <AgencyPackageActivity
            activityId={selectedActivity._id}
            activityImage={selectedActivity.image}
            activityName={selectedActivity.name}
            description={selectedActivity.description}
            price={selectedActivity.price}
          />
        )}

        {selectedTransport && selectedTransport._id && (
          <AgencyPackageTransport
            transportId={selectedTransport._id}
            vehicleType={selectedTransport.vehicleType}
            pricePerKm={selectedTransport.pricePerKm}
            maxPassengers={selectedTransport.maxPassengers}
            image={selectedTransport.image}
            description={selectedTransport.description}
          />
        )}
      </div>

      <div className='container w-[800px] border border-green-500 mx-auto rounded-xl mb-3 bg-green-400 bg-opacity-20'>
        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'>Name of Package : </h3>
          <input
            type='text'
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className='border border-green-500  min-h-[auto] w-[300px] rounded-xl border-1  px-3 py-[0.32rem] ml-6 mt-5'
            required
          />
        </div>
        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'>Image of Package:</h3>
          <input
            className='flex m-0  w-[300px] mt-[25px] ml-[28px] border-green-500 rounded-lg h-[30px] border bg-white bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3 file:py-[0.32rem] file:text-surface focus:border-green-500 focus:text-gray-700 focus:shadow-inset focus:outline-none'
            id='formFileSm'
            type='file'
            onChange={handleFileChange}
          />
        </div>

        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'> Full Days : </h3>
          <input
            type='number'
            className='flex  w-[80px] mt-[25px] ml-[60px] border border-green-500 rounded-lg h-[30px] px-3'
            value={fullDays}
            onChange={(e) => setFullDays(Number(e.target.value))}
            min={0}
          />
        </div>
        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'> Discount : </h3>
          <input
            type='number'
            className='flex  w-[80px] mt-[25px] ml-[67px] border border-green-500 rounded-lg h-[30px] px-3'
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            min={0}
          />
          <h3 className='ml-2 text-xl text-black mt-7'> % </h3>
        </div>
        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'> Commission : </h3>
          <input
            type='number'
            className='flex  w-[80px] mt-[25px] ml-[35px] border border-green-500 rounded-lg h-[30px] px-3'
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            min={0}
          />
          <h3 className='ml-2 text-xl text-black mt-7'> % </h3>
        </div>

        <div className='flex'>
          <h3 className='ml-20 text-xl text-black mt-7'>Final Price :</h3>
          <input
            type='number'
            className='flex  w-[150px] mt-[25px] ml-[50px] border border-green-500 rounded-lg h-[30px] px-3'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
          />
          <button
            onClick={updatePrice}
            className='px-2 ml-2 text-xs text-black bg-green-300 border border-gray-400 rounded-xl mt-7'
          >
            Update price
          </button>
        </div>

        <div className=''>
          <h3 className='ml-20 text-xl text-black mt-7'>Description :</h3>
          <textarea
            value={packageDescription}
            className='flex  w-[600px] mt-3 ml-20 border border-green-500 rounded-lg min-h-[50px] px-3 py-2'
            onChange={(e) => setPackageDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          className='mx-20 my-10 w-[200px] h-10 bg-green-500 rounded-full text-white text-lg font-semibold relative overflow-hidden group hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300'
          type='submit'
          onClick={handleCreateOrUpdatePackage}
        >
          {packageId === "null" ? "Create " : "Update "} Package
          <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-40 ease'></span>
        </button>
      </div>
    </div>
  );
}

export default AgencyPackageFinal;

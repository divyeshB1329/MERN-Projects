import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0 "
        onClick={() => {
            props.setRidePopupPanel(false)
        }}
      >
        <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-3">New Ride Available!</h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 w-10 rounded-full object-cover "
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
          <h2 className="text-lg font-medium">{props.ride?.user.fullname.firstname + " "+props.ride?.user.lastname }</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 kM</h5>
      </div>

      <div className="flex justify-between gap-2 flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm mt-1 text-gray-600">
              {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
        <div className="w-full mt-5 items-center justify-between">
        <button
          onClick={() => {
            props.setRidePopupPanel(false)

          }}
          className="w-full bg-gray-300 text-gray-700 font-semibold p-3 px-10 mb-4 rounded-lg"
        >
          Ignore
        </button>
        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true)
            props.confirmRide()
          }}
          className="w-full bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
        >
          Accept
        </button>
        
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;

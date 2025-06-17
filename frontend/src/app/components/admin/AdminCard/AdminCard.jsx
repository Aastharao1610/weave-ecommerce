"use client";
import React from "react";

const AdminCard = ({
  title,
  value,
  icon: Icon,
  bgColor = "bg-white",
  textColor = "text-black",
}) => {
  return (
    <div
      className={`rounded-2xl w-[350px] h-[150px]  shadow-md p-6 ${bgColor} ${textColor} flex justify-between items-center my-4`}
    >
      <div>
        <h2 className="text-lg font-semibold opacity-80">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {Icon && <Icon className="w-10 h-10 opacity-70" />}
    </div>
  );
};

export default AdminCard;

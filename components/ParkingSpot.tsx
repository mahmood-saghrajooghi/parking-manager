import React from "react";

interface ParkingSpotProps {
  id: string;
  reservations: { id: string; width: number; left: number }[];
  i: number;
}

export const ParkingSpot: React.FC<ParkingSpotProps> = ({
  id,
  reservations,
  i,
}) => {
  return (
    <div
      key={id}
      className="relative overflow-hidden group border border-dashed rounded h-full w-full grid place-items-center	hover:cursor-pointer"
    >
      <div className="dark:text-white text-center text-sm">
        جایگاه شماره {i.toLocaleString("fa")}
      </div>
      <div className="absolute h-1.5 -bottom-1.5 w-full left-0 duration-200 bg-emerald-400 group-hover:bottom-0"></div>
      {reservations.map(({ id, width, left }) => (
        <div
          key={id}
          className="absolute h-1.5 -bottom-1.5 bg-red-400 duration-200 group-hover:bottom-0"
          style={{ width: `${width}%`, left: `${left}%` }}
        ></div>
      ))}
    </div>
  );
};

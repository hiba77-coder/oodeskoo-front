import React from "react";

interface BrandCardProps {
  brandName: string;
  imageUrl: string;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brandName,
  imageUrl,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">

      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={brandName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Brand Name */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-black dark:text-white">
          {brandName}
        </h3>
      </div>

    </div>
  );
};

export default BrandCard;
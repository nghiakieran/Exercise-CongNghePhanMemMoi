import React from "react";

export type CartCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const CartCard: React.FC<CartCardProps> = ({ children, className }) => {
  return (
    <div
      className={`rounded-lg bg-white ${className || ""}`}
    >
      {children}
    </div>
  );
};



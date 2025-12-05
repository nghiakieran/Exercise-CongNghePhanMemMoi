import React from "react";

export type CartButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export const CartButton: React.FC<CartButtonProps> = ({
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "px-6 py-3 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants: Record<string, string> = {
    primary: `${base} !bg-blue-600 !text-white hover:!bg-blue-700 active:!bg-blue-800 shadow-md hover:shadow-lg focus:ring-blue-500 disabled:!bg-gray-400 disabled:!text-white disabled:cursor-not-allowed disabled:shadow-none`,
    secondary: `${base} !bg-gray-100 !text-gray-800 hover:!bg-gray-200 active:!bg-gray-300 shadow-sm hover:shadow-md focus:ring-gray-500 disabled:!bg-gray-200 disabled:!text-gray-400 disabled:cursor-not-allowed disabled:shadow-none`,
    danger: `${base} !bg-red-500 !text-white hover:!bg-red-600 active:!bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500 disabled:!bg-gray-400 disabled:!text-white disabled:cursor-not-allowed disabled:shadow-none`,
  };

  const classes = `${variants[variant]} ${className}`.trim();

  return <button className={classes} disabled={disabled} {...props} />;
};

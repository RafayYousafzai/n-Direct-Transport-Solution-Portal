"use client";
import { Input } from "@heroui/react";
import EyeFilledIcon from "@/constant/icons/EyeFilledIcon";
import EyeSlashFilledIcon from "@/constant/icons/EyeSlashFilledIcon";
import { useState } from "react";

function PasswordInput({ value, handleChange }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      fullWidth
      label="Password"
      variant="bordered"
      placeholder="Enter your password"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      onChange={handleChange}
      value={value}
    />
  );
}

export default PasswordInput;

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";

function PasswordProtection({ onAuthenticate }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "something...") {
      onAuthenticate();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <h3>Enter Password</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <CardFooter>
              <Button fullWidth type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ProtectedLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <PasswordProtection onAuthenticate={() => setIsAuthenticated(true)} />
    );
  }

  return <>{children}</>;
}

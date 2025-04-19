"use client";

import PriceSettings from "@/components/PriceSettings";
import { useEffect, useState } from "react";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import useAdminContext from "@/context/AdminProvider";

export default function CustomPrice() {
  const { priceSettings } = useAdminContext();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (priceSettings) {
      setSettings(priceSettings.same_day);
      setLoading(false);
    }
  }, [priceSettings]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const newSettings = {
        ...priceSettings,
        same_day: settings,
      };

      console.log("Updated settings:", newSettings);

      await updateDoc("data", "price_settings", newSettings);

      toast.success("Saved price settings");
    } catch (error) {
      toast.error("Failed to save price settings");
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !settings) {
    return <Spinner />;
  }

  return (
    <div className="w-full overflow-hidden">
      <PriceSettings
        title={"Same Day"}
        priceSettings={settings}
        setPriceSettings={setSettings}
      >
        <Button
          color="primary"
          className="mr-auto w-40"
          onPress={handleSave}
          isLoading={loading}
        >
          Save
        </Button>
      </PriceSettings>
    </div>
  );
}

"use client";

import PriceSettings from "@/components/PriceSettings";
import { useEffect, useState } from "react";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button } from "@heroui/react";
import { fetchDocById } from "@/api/firebase/functions/fetch";

export default function CustomPrice() {
  const [priceSettings, setPriceSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetchDocById("price_settings", "data");
        console.log(res);

        setPriceSettings(res);
      } catch (error) {
        console.error("Error fetching price settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      await updateDoc("settings", "price_settings", priceSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {!loading && (
        <PriceSettings
          priceSettings={priceSettings}
          setPriceSettings={setPriceSettings}
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
      )}
    </div>
  );
}

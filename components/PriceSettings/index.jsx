"use client";

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Services from "./Services";
import MinServicesPrices from "./MinServicesPrices";
import GST from "./GST";
import TruckServices from "./TruckServices";
import Additional from "./Additional";
import WaitTimeRate from "./WaitTimeRate";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Loading from "@/components/Loading";
import LAYOUTS from "./layouts";
import { IconGripVertical } from "@tabler/icons-react";
import { Button, ButtonGroup, Divider } from "@heroui/react";
import TruckWaitTimeRate from "./TruckWaitTimeRate";

const ResponsiveGridLayout = WidthProvider(Responsive);
const sortObjectKeysNumerically = (obj) => {
  const sortedKeys = Object.keys(obj).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
    return numA - numB;
  });

  return sortedKeys.reduce((result, key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      result[key] = sortObjectKeysNumerically(obj[key]);
    } else {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export default function PriceSettings({
  title,
  priceSettings,
  setPriceSettings,
  children,
}) {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLayout = localStorage.getItem("userLayout");
    setLayout(
      savedLayout ? JSON.parse(savedLayout) : { lg: LAYOUTS.horizontal }
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    setPriceSettings((prevSettings) => sortObjectKeysNumerically(prevSettings));
  }, []);

  const handleLayoutChange = (allLayouts) => {
    setLayout(allLayouts);
    localStorage.setItem("userLayout", JSON.stringify(allLayouts));
  };

  const setDefaultLayout = (layoutType) => {
    const newLayout = { lg: LAYOUTS[layoutType] };
    setLayout(newLayout);
    localStorage.setItem("userLayout", JSON.stringify(newLayout));
  };

  const handleChange = (category, key, value) => {
    setPriceSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: value,
      },
    }));
  };

  if (loading) {
    return <Loading />;
  }

  const {
    gst,
    minWaitTime,
    minServices,
    services,
    truckServices,
    additional,
    truckWaitTimeRate,
  } = priceSettings;

  const sections = [
    truckServices && {
      key: "truck",
      title: "Truck",
      component: (
        <TruckServices
          handleChange={(key, value) =>
            handleChange("truckServices", key, value)
          }
          settings={truckServices}
        />
      ),
    },
    services && {
      key: "services",
      title: "Ute/Van",
      component: (
        <Services
          handleChange={(key, value) => handleChange("services", key, value)}
          settings={services}
        />
      ),
    },
    minServices && {
      key: "minServicePrices",
      title: "Ute/Van",
      component: (
        <MinServicesPrices
          handleChange={(key, value) => handleChange("minServices", key, value)}
          settings={minServices}
        />
      ),
    },
    gst && {
      key: "gst",
      title: "GST",
      component: (
        <GST
          handleChange={(key, value) => handleChange("gst", key, value)}
          settings={gst}
        />
      ),
    },
    gst && {
      key: "additional",
      title: "Additional",
      component: (
        <Additional
          handleChange={(key, value) => handleChange("additional", key, value)}
          settings={additional}
        />
      ),
    },
    minWaitTime && {
      key: "waitTimeRate",
      title: "Wait Time Rate  Ute/Van",
      component: (
        <WaitTimeRate
          handleChange={(key, value) => handleChange("minWaitTime", key, value)}
          settings={minWaitTime}
        />
      ),
    },
    truckWaitTimeRate && {
      key: "truckWaitTimeRate",
      title: "Wait Time Rate  Truck",
      component: (
        <TruckWaitTimeRate
          handleChange={(key, value) =>
            handleChange("truckWaitTimeRate", key, value)
          }
          settings={truckWaitTimeRate}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {title || ""} Service Rates
      </h1>
      <div className="flex justify-end gap-4 mb-4">
        {children}
        <Divider orientation="vertical" />
        <ButtonGroup>
          <Button
            variant="solid"
            color="primary"
            onClick={() => setDefaultLayout("grid")}
          >
            Default Layout
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={() => setDefaultLayout("horizontal")}
          >
            Horizontal Layout
          </Button>
        </ButtonGroup>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        onLayoutChange={(_, allLayouts) => handleLayoutChange(allLayouts)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 2, xs: 2, xxs: 1 }}
        rowHeight={100}
        draggableHandle=".drag-handle"
        isResizable
        isDraggable
      >
        {sections
          .filter((item) => item !== undefined)
          .map(({ key, title, component }) => (
            <div
              key={key}
              className="bg-white p-4 rounded-lg shadow-md relative"
            >
              <button className="drag-handle absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-move">
                <IconGripVertical size={20} />
              </button>
              <h2 className="text-md font-semibold text-gray-700 mb-4">
                {title}
              </h2>
              {component}
            </div>
          ))}
      </ResponsiveGridLayout>
    </div>
  );
}

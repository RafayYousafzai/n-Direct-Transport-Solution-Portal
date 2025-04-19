"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import NextDay from "./components/next_day";
import ThreeFourDay from "./components/three_four_day";

export default function App() {
  return (
    <div className="flex w-full flex-col ">
      <Tabs fullWidth color="primary" aria-label="Options">
        <Tab key="photos" title="Next Day">
          <Card>
            <CardBody>
              <NextDay />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="3-4 Days">
          <Card>
            <CardBody>
              <ThreeFourDay />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

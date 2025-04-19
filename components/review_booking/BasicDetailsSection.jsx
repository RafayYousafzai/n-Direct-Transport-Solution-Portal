"use client";

import "./form.css";
import DateTime from "@/components/fields/DateTime";
import ItemDimensions from "@/components/ItemDimensions";
import CustomInput from "@/components/fields/CustomInput";
import ServicesFields from "@/components/fields/ServicesFields";

import { formatDate, formatTime } from "@/api/DateAndTime/format";
import { Divider } from "@mui/material";
import { Button, ButtonGroup } from "@heroui/react";
import { ResetIcon } from "@radix-ui/react-icons";

export default function BasicDetailsSection({
  user,
  setUser,
  type,
  diseble,
  noEmail,
  selectedEmail,
  formData,
  setFormData,
  setError,
  handleChange,
  handleDateChange,
  resetSelectedEmail,
}) {
  return (
    <>
      <div className="box">
        <h3>Job information</h3>
        <p>
          Account:
          {selectedEmail && (
            <ButtonGroup onClick={resetSelectedEmail} className="ml-2">
              {user.role === "admin" && selectedEmail?.name !== "" && (
                <Button
                  onClick={resetSelectedEmail}
                  variant="flat"
                  size="sm"
                  isIconOnly
                >
                  <ResetIcon />
                </Button>
              )}
              <Button variant="flat" size="sm">
                {selectedEmail?.name !== ""
                  ? selectedEmail.name
                  : user?.firstName}
              </Button>
            </ButtonGroup>
          )}
        </p>
        <br />
        <CustomInput
          name="contact"
          label="Contact"
          value={formData.contact}
          handleChange={handleChange}
        />
        <CustomInput
          name="internalReference"
          label="Internal Reference"
          value={formData.internalReference}
          handleChange={handleChange}
        />
        <br />
        {noEmail ? (
          <CustomInput
            name="email"
            label="Email"
            value={formData.email}
            handleChange={handleChange}
          />
        ) : null}
        <br />
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1582e1",
            color: "white",
            width: "100%",
            borderRadius: 10,
          }}
        >
          <p>
            <strong>Please Note: </strong>
            {type === "same_day" ? (
              "Interstate/regional prices may vary from the original quote. Please wait for the job to be accepted and we will contact you if any changes are necessary."
            ) : (
              <>
                <br />
                1. Has to be booked before 12 noon <br />
                2. Deliveries will be carried out during normal business hours
                (7am - 5pm) <br />
                3. Goods must be ready for pickup at the time of the booking
                <br />
                4. Accurate dimensions and weights will be required for accurate
                pricing
              </>
            )}
          </p>

          <p>
            <strong>
              Accurate measurements are necessary for accurate pricing.
            </strong>
          </p>
        </div>
        <Divider style={{ margin: "5.5rem 0" }} />
      </div>
      <div className="box">
        <h3>Ready Date & Time</h3>
        <DateTime
          service={formData.service}
          handle_date={(name, val) => handleDateChange(name, formatDate(val))}
          handle_time={(name, val) => handleDateChange(name, formatTime(val))}
          handleInvalid={(e) => setError(e)}
        />
        <h5 className="my-8">Service information</h5>
        {type === "same_day" ? (
          <ServicesFields
            handleChange={(service) =>
              setFormData({ ...formData, service: service })
            }
            value={formData.service}
          />
        ) : null}
        <ItemDimensions
          handleItems={(items) => setFormData({ ...formData, items: items })}
          defaultItems={formData?.items}
          diseble={diseble}
        />
      </div>
    </>
  );
}

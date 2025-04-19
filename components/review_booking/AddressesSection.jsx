import "./form.css";

import { useEffect, useState } from "react";
import { Alert } from "@mantine/core";
import { Chip, Switch } from "@heroui/react";
import { ErrorOutline } from "@mui/icons-material";
import { PlacesAutocomplete } from "@/components/Index";

import CustomInput from "@/components/fields/CustomInput";
import FrequentAddress from "@/components/fields/FrequentAddress";
import SelectMultipleAddresses from "@/components/select-address/SelectMultipleAddresses";

export default function AddressesSection({
  user,
  edit,
  locationsError,
  handleRefresh,
  formData,
  setFormData,
  handleChange,
  handle_address,
  showFrequentOrigins,
  setShowFrequentOrigins,
  showFrequentDestinations,
  setShowFrequentDestinations,
}) {
  const [showMultipleAddresses, setShowMultipleAddresses] = useState(false);

  useEffect(() => {
    if (formData.address.useMultipleAddresses) {
      setShowMultipleAddresses(true);
    } else {
      setShowMultipleAddresses(false);
    }
  }, []);

  const toggleChip = () => {
    // handleRefresh();
    return (
      <div className="h-10">
        <Switch
          isSelected={showMultipleAddresses}
          onValueChange={setShowMultipleAddresses}
        >
          Multiple Addresses
        </Switch>
      </div>
    );
  };

  const handleMultipleAddresses = (address, type) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        Origin: {},
        Destination: {},
        useMultipleAddresses: true,
        [`Multiple${type}`]: address,
      },
    });
  };

  const handleRemoveAddress = (labelToRemove, type) => {
    setFormData((prevData) => {
      const updatedAddresses = prevData.address[`Multiple${type}`]?.filter(
        (addr) => addr.label !== labelToRemove
      );

      return {
        ...prevData,
        address: {
          ...prevData.address, // Preserve existing addresses
          [`Multiple${type}`]: updatedAddresses,
          useMultipleAddresses: updatedAddresses?.length > 0, // Disable multiple mode if no addresses remain
        },
      };
    });
  };

  return (
    <>
      <div className="box">
        {toggleChip()}
        <h3>Pickup Details</h3>
        {locationsError && (
          <Alert icon={<ErrorOutline />} className="w-full">
            Please enter valid location
          </Alert>
        )}
        <CustomInput
          name="pickupCompanyName"
          label="Company Name"
          value={formData.pickupCompanyName}
          handleChange={handleChange}
        />

        {!showMultipleAddresses ? (
          <>
            <FrequentAddress
              address={formData.address.Origin}
              handleChange={(e) => handle_address("Origin", e)}
              show={() => setShowFrequentOrigins(false)}
              visible={edit}
            />
            {edit && showFrequentOrigins ? (
              <PlacesAutocomplete
                onLocationSelect={(e) => handle_address("Origin", e, true)}
                address={formData.address.Origin}
                pickup={true}
                handleCheckboxChange={(e) =>
                  setFormData({
                    ...formData,
                    savePickAddress: e.target.checked,
                  })
                }
                checkbox={formData.savePickAddress}
                saveOption={true}
              />
            ) : (
              <CustomInput
                value={formData.address.Origin.label}
                handleChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Origin: {
                        ...formData.address.Origin,
                        label: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </>
        ) : (
          user.role === "admin" && (
            <SelectMultipleAddresses
              removeAddress={(label) => handleRemoveAddress(label, "Origin")}
              value={formData.address.MultipleOrigin}
              handleAddresses={(address) =>
                handleMultipleAddresses(address, "Origin")
              }
            />
          )
        )}

        <CustomInput
          name="pickupReference1"
          label="Reference/Pickup Instruction"
          value={formData.pickupReference1}
          handleChange={handleChange}
        />
        <CustomInput
          name="pickupPhone"
          label="Phone number"
          value={formData.pickupPhone}
          handleChange={handleChange}
        />
      </div>

      <div className="box mt-10">
        <h3>Drop Details</h3>
        {/* {toggleChip()} */}

        {locationsError && (
          <Alert icon={<ErrorOutline />} className="w-full">
            Please enter valid location
          </Alert>
        )}
        <CustomInput
          name="dropCompanyName"
          label="Company Name"
          value={formData.dropCompanyName}
          handleChange={handleChange}
        />

        {!showMultipleAddresses ? (
          <>
            <FrequentAddress
              address={formData.address.Destination}
              handleChange={(e) => handle_address("Destination", e)}
              show={() => setShowFrequentDestinations(false)}
              visible={edit}
            />
            {edit && showFrequentDestinations ? (
              <PlacesAutocomplete
                onLocationSelect={(e) => handle_address("Destination", e, true)}
                address={formData.address.Destination}
                handleCheckboxChange={(e) =>
                  setFormData({
                    ...formData,
                    saveDropAddress: e.target.checked,
                  })
                }
                checkbox={formData.saveDropAddress}
                saveOption={true}
              />
            ) : (
              <CustomInput
                value={formData.address.Destination.label}
                handleChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Destination: {
                        ...formData.address.Destination,
                        label: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </>
        ) : (
          user.role === "admin" && (
            <SelectMultipleAddresses
              removeAddress={(label) =>
                handleRemoveAddress(label, "Destination")
              }
              value={formData.address.MultipleDestination}
              handleAddresses={(address) =>
                handleMultipleAddresses(address, "Destination")
              }
            />
          )
        )}

        <CustomInput
          name="deliveryIns"
          label="Delivery Instructions"
          value={formData.deliveryIns}
          handleChange={handleChange}
        />
        <CustomInput
          name="deliveryPhone"
          label="Phone number"
          value={formData.deliveryPhone}
          handleChange={handleChange}
        />
      </div>
    </>
  );
}

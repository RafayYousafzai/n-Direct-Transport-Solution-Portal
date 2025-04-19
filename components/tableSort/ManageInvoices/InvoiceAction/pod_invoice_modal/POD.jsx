"use client";

import { useEffect, useState } from "react";
import DropzoneButton from "@/components/Dropzone/index";
import {
  updateDoc,
  uploadImageToFirestore,
} from "@/api/firebase/functions/upload";
import { Box, LoadingOverlay } from "@mantine/core";
import { PhotoView } from "react-photo-view";
import { Button, Image, Input } from "@heroui/react";

export default function Page({ booking, close }) {
  const [name, setName] = useState(booking?.receiverName || "");
  const [images, setImages] = useState(booking?.images);
  const [refresh, setRefresh] = useState(1);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  console.log({ images: booking.images });

  useEffect(() => {
    setImages(booking?.images);
  }, [booking]);

  const handleSave = async () => {
    try {
      setLoadingOverlay(true);

      let uploadedImageUrls = [];

      if (images && images.length > 0) {
        uploadedImageUrls = await Promise.all(
          images.map(async (image) => {
            try {
              const downloadURL = await uploadImageToFirestore(image);
              if (downloadURL) {
                return downloadURL;
              } else {
                console.log("Error while saving image.");
                return null;
              }
            } catch (error) {
              console.error("Error uploading image:", error);
              return null;
            }
          })
        );

        uploadedImageUrls = uploadedImageUrls.filter((url) => url !== null);

        console.log("All images uploaded successfully:", uploadedImageUrls);
      } else {
        console.log("No images to upload");
      }

      await updateDoc("place_bookings", booking.docId, {
        ...booking,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
        receiverName: name,
      });

      setImages(uploadedImageUrls);
      setLoadingOverlay(false);
      close();
    } catch (error) {
      console.error("Error uploading images:", error);
      setLoadingOverlay(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loadingOverlay}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f7f7f7",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {booking ? (
          <>
            <h1 style={{ marginBottom: "1rem", color: "#333" }}>Add PODs</h1>

            <Input
              type="name"
              label="Receiver Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <DropzoneButton
              key={refresh}
              handleImage={(blob) => {
                setImages([...images, blob]);
                setRefresh(refresh + 1);
              }}
            />

            <div className="flex flex-wrap gap-4">
              {images &&
                images.length > 0 &&
                images.map((item, index) => (
                  <PhotoView key={`${index}-${item}`} src={item}>
                    <div className="w-full flex flex-col justify-center align-middle">
                      <Image
                        src={item}
                        alt=""
                        className="w-full h-auto my-4 rounded-lg "
                      />
                      <Button
                        onClick={() => removeImage(index)}
                        size="sm"
                        color="danger"
                      >
                        Remove
                      </Button>
                    </div>
                  </PhotoView>
                ))}
            <h1 style={{ marginBottom: "1rem", color: "#333" }}>  Pick up Images</h1>

              {booking?.pickupImages?.length > 0 &&
                booking?.pickupImages?.map((item, index) => (
                  <PhotoView key={`${index}-${item}`} src={item}>
                    <div className="w-full flex flex-col justify-center align-middle">
                      <Image
                        src={item}
                        alt=""
                        className="w-full aspect-square object-cover h-auto my-4 rounded-lg "
                      />
                    </div>
                  </PhotoView>
                ))}
            </div>
            <Button
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "1rem" }}
            >
              Save & Deliver
            </Button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Box>
  );
}

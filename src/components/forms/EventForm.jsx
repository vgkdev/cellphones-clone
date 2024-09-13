import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  ThemeProvider,
  Modal,
  TextField,
  Typography,
  Tabs,
  Tab,
  Stack,
  Tooltip,
  Chip,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { Event } from "../../models/Event";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { DISPLAY_PARTS } from "../../models/Event";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../../store/actions/productsAction";
import { addEvent, getEventById, updateEvent } from "../../db/dbEvent";
import {
  deleteEventCarouselImage,
  handleUploadEventCarouselImage,
  uploadEventDisplayImage,
  uploadEventDisplayPart,
} from "../../db/storageImage";
import { Await } from "react-router-dom";
import { priceFormatter, toTruncatedString } from "../../utils/stringHelper";
import ProductCard from "../product/ProductCard";
import { set } from "firebase/database";
import MockProductCard from "../product/MockProductCard";

export const MockProductCardView = ({
  primaryUrl,
  secondaryUrl,
  tertiaryUrl,
  product,
  event,
  selectingPart,
  setActivePartTab,
}) => {
  const [mockProduct, setMockProduct] = useState({
    ...product,
    activeEvent: event.id,
  });

  // force Product Card to re-render
  useEffect(() => {
    setMockProduct((prevProduct) => ({
      ...prevProduct,
      activeEvent: event.id,
    }));
  }, [event]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/intro-to-se.appspot.com/o/events%2Ftransparent-fake-png-background-checkered-box-boxes-fake-transparent-background-png-file-effect-flat-vector-designers-must-need-265492346.webp?alt=media&token=4f481fc2-e4a2-4eca-a635-a4c042281500)`
          }}
        >
          <img
            src={primaryUrl}
            alt="Primary"
            width="100"
            height="100"
            style={{
              border:
                selectingPart === DISPLAY_PARTS.PRIMARY
                  ? "2px solid red"
                  : "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (setActivePartTab) setActivePartTab(0);
            }}
          />
          <img
            src={secondaryUrl}
            alt="Secondary"
            width="100"
            height="100"
            style={{
              border:
                selectingPart === DISPLAY_PARTS.SECONDARY
                  ? "2px solid blue"
                  : "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (setActivePartTab) setActivePartTab(1);
            }}
          />
          <img
            src={tertiaryUrl}
            alt="Tertiary"
            width="100"
            height="100"
            style={{
              border:
                selectingPart === DISPLAY_PARTS.TERTIARY
                  ? "2px solid green"
                  : "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (setActivePartTab) setActivePartTab(2);
            }}
          />
        </Box>
        <MockProductCard
          product={mockProduct}
          selectingPart={selectingPart}
          activeEvent={event}
        />
      </Box>
    </ThemeProvider>
  );
};

export default function EventForm({ eventId }) {
  const [newEvent, setNewEvent] = useState(new Event());
  const [activeDisplayImageTab, setActiveDisplayImageTab] = useState(0);
  const [activeDisplayPartTab, setActiveDisplayPartTab] = useState(0);
  const { showSnackbar } = useSnackbarUtils();
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleDisplayImageTabChange = (event, newValue) => {
    setActiveDisplayImageTab(newValue);
  };

  const handleUploadDisplayImageUrl = (event) => {
    if (event.target.files.length <= 0) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    const file = event.target.files[0];

    if (!file) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    uploadEventDisplayImage(
      newEvent.id,
      file,
      (url) => {
        console.log(">>> check url: " + url);
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          displayImageUrl: url,
        }));
      },
      (error) => {
        showSnackbar("Error uploading display image " + error, "error", true);
      }
    );
  };

  const handleDisplayPartTabChange = (event, newValue) => {
    setActiveDisplayPartTab(newValue);
  };

  const handleUploadDisplayPart = (e, part) => {
    if (e.target.files.length <= 0) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    const file = e.target.files[0];

    if (!file) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    uploadEventDisplayPart(
      newEvent.id,
      part,
      file,
      (partName, url) => {
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          [partName]: url,
        }));
        updateEvent({
          ...newEvent,
          [partName]: url,
        });
      },
      (error) => {
        showSnackbar("Error uploading display part " + error, "error", true);
      }
    );
  };

  const handleUploadEventImages = async (e) => {
    if (e.target.files.length <= 0) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    const files = e.target.files;

    if (!files) {
      showSnackbar("No file selected", "warning", true);
      return;
    }

    let urls = [];
    const filesArray = Array.from(files);

    const uploadPromises = filesArray.map(
      (file) =>
        new Promise((resolve, reject) => {
          handleUploadEventCarouselImage(
            newEvent.id,
            file,
            (url) => {
              urls.push(url);
              resolve();
            },
            (error) => {
              showSnackbar(
                "Error uploading event image " + error,
                "error",
                true
              );
              reject(error);
            }
          );
        })
    );

    try {
      await Promise.all(uploadPromises);
      console.log("All files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files", error);
    }

    newEvent.imageUrls = [...newEvent.imageUrls, ...urls];

    updateEvent(
      {
        ...newEvent,
      },
      (rEvent) => {
        showSnackbar("Event updated successfully ", "success");
        setNewEvent({
          ...rEvent,
        });
      }
    );
  };

  const handleDeleteEventCarouselImage = async (url) => {
    deleteEventCarouselImage(
      url,
      () => {
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          imageUrls: prevEvent.imageUrls.filter((imageUrl) => imageUrl !== url),
        }));
        updateEvent(
          {
            ...newEvent,
            imageUrls: newEvent.imageUrls.filter(
              (imageUrl) => imageUrl !== url
            ),
          },
          (rEvent) => {
            showSnackbar("Event updated successfully ", "success");
            setNewEvent({
              ...rEvent,
            });
          }
        );
      },
      (error) => {
        showSnackbar("Error deleting event image " + error, "error", true);
      }
    );
  };
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    if (eventId === "") {
      return;
    }

    getEventById(
      eventId,
      (event) => {
        setNewEvent({
          ...event,
        });
      },
      (error) => {
        showSnackbar("Error getting event " + error, "error", true);
      }
    );
  }, [eventId]);

  const handleSubmit = () => {
    console.log(newEvent);
    if (newEvent.id === "") {
      addEvent(
        newEvent,
        (rEvent) => {
          showSnackbar("Event created successfully ", "success", false, 3000);
          setNewEvent({
            ...rEvent,
          });
        },
        (error) => {
          showSnackbar("Error creating event " + error, "error", true);
        }
      );
    } else {
      updateEvent(
        newEvent,
        (rEvent) => {
          showSnackbar("Event updated successfully ", "success");
          setNewEvent({
            ...rEvent,
          });
        },
        (error) => {
          showSnackbar("Error updating event " + error, "error", true);
        }
      );
    }
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Paper
        sx={{
          padding: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "auto",
          }}
          width="100%"
        >
          <Typography variant="h6">Event Form</Typography>
          {newEvent.id !== "" && (
            <TextField
              name="id"
              label="Event ID"
              value={newEvent.id}
              fullWidth
              required
              disabled
            />
          )}
          <TextField
            name="name"
            label="Event Name"
            value={newEvent.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            name="title"
            label="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Event Description"
            value={newEvent.description}
            onChange={handleInputChange}
            fullWidth
            required
            multiline
            rows={4}
          />

          {newEvent.id !== "" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Display Image</Typography>
              <Tabs
                value={activeDisplayImageTab}
                onChange={handleDisplayImageTabChange}
              >
                <Tab label="Upload file" />
                <Tab label="Input URL" />
              </Tabs>
              {activeDisplayImageTab === 0 ? (
                <TextField
                  name="displayImageUrl"
                  onChange={handleUploadDisplayImageUrl}
                  fullWidth
                  type="file"
                />
              ) : (
                <TextField
                  name="displayImageUrl"
                  label="Display Image URL"
                  onChange={handleInputChange}
                  fullWidth
                  type="url"
                />
              )}
              <img
                src={newEvent.displayImageUrl}
                alt="Display"
                width="100"
                height="100"
              />
            </Box>
          )}

          {newEvent.id !== "" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Tabs
                value={activeDisplayPartTab}
                onChange={handleDisplayPartTabChange}
              >
                <Tab label="Primary" />
                <Tab label="Secondary" />
                <Tab label="Tertiary" />
              </Tabs>

              <Typography variant="h6" color={"primary"}>
                {activeDisplayPartTab === 0
                  ? "Primary"
                  : activeDisplayPartTab === 1
                  ? "Secondary"
                  : "Tertiary"}{" "}
                Display Part
              </Typography>

              {activeDisplayPartTab === 0 ? (
                <Box>
                  <TextField
                    name="primaryDisplayPart"
                    onChange={(e) => {
                      handleUploadDisplayPart(e, DISPLAY_PARTS.PRIMARY);
                      e.target.value = "";
                    }}
                    fullWidth
                    type="file"
                    accept=".svg, .png, .gif"
                  />
                  <Typography>URL</Typography>
                  <TextField
                    name="primaryDisplayPart"
                    onChange={handleInputChange}
                    fullWidth
                    type="url"
                    value={newEvent.primaryDisplayPart}
                  />
                </Box>
              ) : activeDisplayPartTab === 1 ? (
                <Box>
                  <TextField
                    name="secondaryDisplayPart"
                    onChange={(e) => {
                      handleUploadDisplayPart(e, DISPLAY_PARTS.SECONDARY);
                      e.target.value = "";
                    }}
                    fullWidth
                    type="file"
                    accept=".svg, .png, .gif"
                  />
                  <Typography>URL</Typography>
                  <TextField
                    name="secondaryDisplayPart"
                    onChange={handleInputChange}
                    fullWidth
                    type="url"
                    value={newEvent.secondaryDisplayPart}
                  />
                </Box>
              ) : (
                <Box>
                  <TextField
                    name="tertiaryDisplayPart"
                    onChange={(e) => {
                      handleUploadDisplayPart(e, DISPLAY_PARTS.TERTIARY);
                      e.target.value = "";
                    }}
                    fullWidth
                    type="file"
                    accept=".svg, .png, .gif"
                  />
                  <Typography>URL</Typography>
                  <TextField
                    name="tertiaryDisplayPart"
                    onChange={handleInputChange}
                    fullWidth
                    type="url"
                    value={newEvent.tertiaryDisplayPart}
                  />
                </Box>
              )}

              {products.length > 0 && (
                <MockProductCardView
                  key={
                    newEvent.primaryDisplayPart +
                    newEvent.secondaryDisplayPart +
                    newEvent.tertiaryDisplayPart
                  }
                  primaryUrl={newEvent.primaryDisplayPart}
                  secondaryUrl={newEvent.secondaryDisplayPart}
                  tertiaryUrl={newEvent.tertiaryDisplayPart}
                  product={products[0]}
                  event={newEvent}
                  selectingPart={
                    Object.values(DISPLAY_PARTS)[activeDisplayPartTab]
                  }
                  setActivePartTab={setActiveDisplayPartTab}
                />
              )}
            </Box>
          )}

          {newEvent.id !== "" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Image URLs</Typography>
              <TextField
                type="file"
                onChange={(e) => {
                  handleUploadEventImages(e);
                  e.target.value = "";
                }}
                inputProps={{ multiple: true }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                flexWrap={"wrap"}
              >
                {newEvent.imageUrls.map((url, index) => (
                  <Tooltip
                    key={index}
                    title={
                      <img src={url} alt="Display" width="100" height="100" />
                    }
                    placement="bottom"
                  >
                    <Chip
                      label={toTruncatedString(url, 10)}
                      variant="outlined"
                      color="primary"
                      onDelete={() => {
                        handleDeleteEventCarouselImage(url);
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={!newEvent.isExclusive}
                onChange={(e) => {
                  setNewEvent({
                    ...newEvent,
                    isExclusive: !newEvent.isExclusive,
                  });
                }}
                name="isExclusive"
              />
            }
            label="All Products"
          />

          <TextField
            name="discountRate"
            label={
              "Discount Rate - " +
              toTruncatedString(newEvent.discountRate * 100) +
              "%"
            }
            type="number"
            value={newEvent.discountRate}
            onChange={handleInputChange}
          />

          <TextField
            name="maxDiscount"
            label={
              "Max Discount - " +
              priceFormatter.format(newEvent.maxDiscount) +
              " VND"
            }
            type="number"
            value={newEvent.maxDiscount}
            onChange={handleInputChange}
          />

          {newEvent.isExclusive && (
            <React.Fragment>
              <InputLabel id="applicableProducts">Selected Products</InputLabel>
              <Select
                labelId="applicableProducts"
                name="applicableProducts"
                id="applicableProducts"
                multiple
                value={newEvent.applicableProducts}
                onChange={handleInputChange}
              >
                <MenuItem value={[]}>None</MenuItem>
                {products.map((product) => (
                  <MenuItem value={product.id} key={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </React.Fragment>
          )}

          <Typography>Start Time</Typography>
          <TextField
            name="startTime"
            type="datetime-local"
            value={newEvent.startTime}
            onChange={handleInputChange}
          />
          {/* end day */}
          <Typography>End Time</Typography>
          <TextField
            name="endTime"
            type="datetime-local"
            value={newEvent.endTime}
            onChange={handleInputChange}
          />

          {newEvent.id !== "" ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create event
            </Button>
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

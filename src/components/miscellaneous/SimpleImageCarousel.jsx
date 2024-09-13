import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function SimpleImageCarousel({ images, imageNames }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        maxWidth: 536,
        maxHeight: 600,
      }}
    >
      {/* Indicator */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          bgcolor: "background.default",
          // border: "1px solid",
        }}
        width="20%"
        gap={1}
      >
        {/* Vertical image thumbnails to control the carousel */}
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setActiveStep(index)}
            style={{
              height: "50px",
              width: "50px",
              cursor: "pointer",
              opacity: index === activeStep ? 1 : 0.5,
              borderRadius: "5px",
            }}
          />
        ))}
      </Box>
      {/* Carousel */}
      <Box sx={{ maxWidth: 413, flexGrow: 1 }} width="80%">
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            pl: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography
            variant="p"
            color="primary"
            width="100%"
            align="center"
            textAlign="center"
          >{imageNames[activeStep]}</Typography>
        </Paper>
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((imageUrl, index) => (
            <div key={imageUrl}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: 516,
                    display: "block",
                    maxWidth: 413,
                    overflow: "hidden",
                    width: "100%",
                  }}
                  borderRadius={2}
                  src={imageUrl}
                  alt={imageNames[index]}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Box>
    </Box>
  );
}

export default SimpleImageCarousel;

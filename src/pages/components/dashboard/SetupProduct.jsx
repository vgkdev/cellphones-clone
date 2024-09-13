import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ManageProductStock from "./ManageProductStock";

import { Product } from "../../../models/Product";
import ManageProductImageAndVideo from "./ManageProductImageAndVideo";
import ManagePost from "./ManagePost";
import ManageFAQ from "./ManageFAQ";

const steps = ["Stocks", "Images & Videos", "Posts", "FAQs"];

export default function SetupProduct({ product = null, onFinished = null }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return true;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleFinish = () => {
    if (onFinished) {
      onFinished();
    }
  };

  return (
    <Box
      sx={{
        overflow: "auto",
        width: "100%",
        maxHeight: "48vh",
        border: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          p: 2,
          position: "sticky",
          top: "0px",
          background: "white",
          zIndex: 100,
          // border: "1px solid #f0f0f0",
          paddingRight: "100spx",
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            background: "white",
            opacity: 1,
            width: "100%",
          }}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep !== steps.length && (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,

                position: "sticky",
                top: "0px",
                width: "100%",
                border: "1px solid #f0f0f0",
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
      {/* {activeStep === steps.length && (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleFinish}>Finish</Button>
          </Box>
        </React.Fragment>
      )} */}
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleFinish}>Finish</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && <ManageProductStock productId={product.id} />}
          {activeStep === 1 && (
            <ManageProductImageAndVideo productId={product.id} />
          )}
          {activeStep === 2 && <ManagePost productId={product.id} />}
          {activeStep === 3 && <ManageFAQ productId={product.id} />}
        </React.Fragment>
      )}
    </Box>
  );
}

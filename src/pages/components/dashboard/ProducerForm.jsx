import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import PlusIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import FormGrid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import { FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { addProducer, updateProducer } from "../../../db/dbProducer";

const normalizeSvg = (svgContent) => {
  const obj = new DOMParser().parseFromString(svgContent, "image/svg+xml");
  const svg = obj.documentElement;

  // Get viewBox attribute
  // const viewBox = svg.getAttribute("viewBox");

  // Set width and height attributes
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");

  return svg.outerHTML;
};

const SUCCESS_VALIDATION = "OK";
const NONE_VALIDATION = "";

export const FormActionResult = {
  SUCCESS: "success",
  FAILURE: "failure",
  NONE: "none",
};

export default function ProducerForm({ producer = null }) {
  const [name, setName] = React.useState(producer ? producer.name : "");
  const [uploadedSvg, setUploadedSvg] = React.useState(
    producer ? producer.logoSvg : null
  );
  const [logoSvg, setLogoSvg] = React.useState(
    producer ? producer.logoSvg : ""
  );
  const [description, setDescription] = React.useState(
    producer ? producer.description : ""
  );
  const [nameValidation, setNameValidation] = React.useState(NONE_VALIDATION);
  const [logoSvgValidation, setLogoSvgValidation] =
    React.useState(NONE_VALIDATION);
  const [descriptionValidation, setDescriptionValidation] =
    React.useState(NONE_VALIDATION);
  const [autoClear, setAutoClear] = React.useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const dispatch = useDispatch();

  const handleLogoSvgChange = (event) => {
    setLogoSvg(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const resetForm = () => {
    setName("");
    setLogoSvg("");
    setDescription("");
    setUploadedSvg(null);
    setLogoSvg("");
    setNameValidation(NONE_VALIDATION);
    setLogoSvgValidation(NONE_VALIDATION);
    setDescriptionValidation(NONE_VALIDATION);
  };

  const validateName = () => {
    if (name === "") {
      setNameValidation("Name is required");
      return false;
    }
    setNameValidation(SUCCESS_VALIDATION);
    return true;
  };

  const validateLogoSvg = () => {
    if (logoSvg === "") {
      setLogoSvgValidation("Logo SVG is required");
      return false;
    } else if (!isValidHtml(logoSvg)) {
      setLogoSvgValidation("Invalid SVG file");
      return false;
    }

    setLogoSvgValidation(SUCCESS_VALIDATION);
    return true;
  };

  const validateDescription = () => {
    if (description === "") {
      setDescriptionValidation("Description is required");
      return false;
    }
    setDescriptionValidation(SUCCESS_VALIDATION);
    return true;
  };

  const validateForm = () => {
    validateName();
    validateLogoSvg();
    validateDescription();
  };

  const isFormValid = () => {
    return validateName() && validateLogoSvg() && validateDescription();
  };

  function isValidHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Check for parsing errors
    const parserErrors = doc.getElementsByTagName("parsererror");
    if (parserErrors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const { showSnackbar } = useSnackbarUtils();

  const submitForm = () => {
    if (!isFormValid()) {
      showSnackbar("Form is not valid", "error");
      console.log("Form is not valid");
      return;
    }

    const newProducer = {
      name: name,
      logoSvg: uploadedSvg,
      description: description,
    };

    if(producer){
      updateProducer(
        { ...producer, ...newProducer },
        (id) => {
          console.log("Producer updated with id: " + id);
          showSnackbar("Producer updated with id: " + id, "success");
        },
        (error) => {
          console.error("Producer update error: " + error);
          showSnackbar("Producer update error: " + error, "error");
        }
      )
      return;
    }

    // Add producer to database
    // if (producer) {
    //   dispatch(updateProducer(newProducer, producer.id));
    // } else {
    //   dispatch(addProducer(newProducer));
    //   if (autoClear) {
    //     resetForm();
    //   }
    // }

    addProducer(
      newProducer,
      (id) => {
        console.log("Producer added with id: " + id);
        if (autoClear) {
          resetForm();
        }
        showSnackbar("Producer added with id: " + id, "success");
      },
      (error) => {
        console.error("Producer add error: " + error);
        showSnackbar("Producer add error: " + error, "error");
      }
    );
  };

  return (
    <div>
      <Accordion defaultExpanded={producer ? true : false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          {producer ? (
            <Typography color="primary" variant="subtitle">
              Producers
            </Typography>
          ) : (
            <Button startIcon={<PlusIcon />}>Add new</Button>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <FormGrid container spacing={2}>
              <FormGrid item xs={6}>
                <FormLabel>Name</FormLabel>
                <TextField
                  error={
                    nameValidation !== SUCCESS_VALIDATION &&
                    nameValidation !== NONE_VALIDATION
                  }
                  helperText={
                    nameValidation !== SUCCESS_VALIDATION
                      ? nameValidation
                      : null
                  }
                  fullWidth
                  value={name}
                  placeholder="Name"
                  onChange={handleNameChange}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel>Upload SVG</FormLabel>
                <Grid container direction="row" justifyContent="space-between">
                  <TextField
                    accept="image/svg+xml"
                    error={
                      logoSvgValidation !== SUCCESS_VALIDATION &&
                      logoSvgValidation !== NONE_VALIDATION
                    }
                    helperText={
                      logoSvgValidation !== SUCCESS_VALIDATION
                        ? logoSvgValidation
                        : null
                    }
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        let result = normalizeSvg(e.target.result);
                        setUploadedSvg(result);
                        setLogoSvg(result);
                      };
                      try {
                        reader.readAsText(file);
                      } catch (error) {
                        setUploadedSvg(null);
                        setLogoSvgValidation("Invalid SVG file");
                      }
                    }}
                  />
                  {isValidHtml(uploadedSvg) ? (
                    <div dangerouslySetInnerHTML={{ __html: uploadedSvg }} />
                  ) : (
                    <p>Select a file to preview</p>
                  )}
                </Grid>
              </FormGrid>
              <FormGrid item xs={12}>
                <FormLabel>Description</FormLabel>
                <TextField
                  error={
                    descriptionValidation !== SUCCESS_VALIDATION &&
                    descriptionValidation !== NONE_VALIDATION
                  }
                  helperText={
                    descriptionValidation !== SUCCESS_VALIDATION
                      ? descriptionValidation
                      : null
                  }
                  fullWidth
                  value={description}
                  placeholder="Description"
                  onChange={handleDescriptionChange}
                  multiline
                  rows={4}
                />
              </FormGrid>
            </FormGrid>
          </Box>
        </AccordionDetails>
        <AccordionActions>
          {producer ? (
            <Button onClick={submitForm}>Update</Button>
          ) : (
            [
              <FormControlLabel
                key="autoClear"
                control={
                  <Checkbox
                    value="Auto clear"
                    color="primary"
                    onChange={(e) => {
                      setAutoClear(e.target.value);
                    }}
                  />
                }
                label="Auto clear"
                color="primary"
              ></FormControlLabel>,
              <Button key="reset" onClick={resetForm}>
                Reset
              </Button>,
              <Button key="add" onClick={submitForm}>
                Add{" "}
              </Button>,
            ]
          )}
        </AccordionActions>
      </Accordion>
    </div>
  );
}

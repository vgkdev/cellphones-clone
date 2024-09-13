import * as React from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MUIDataTable from "mui-datatables";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Alert, Modal, Snackbar } from "@mui/material";
import ProducerForm from "./ProducerForm";
import { FormActionResult } from "./ProducerForm";

import { useEffect } from "react";
import { useState } from "react";
import { PRODUCER_COLLECTION, getAllProducers } from "../../../db/dbProducer";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { onSnapshot } from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TableEditButton({ producer, handleOpen, setCurProducer }) {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          setCurProducer(producer);
          handleOpen();
        }}
        startIcon={<BorderColorIcon />}
      >
        Edit
      </Button>
    </>
  );
}

function ProducerDataTable() {
  const [data, setData] = useState([]);
  const [curProducer, setCurProducer] = React.useState({});

  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //utils
  const { showSnackbar } = useSnackbarUtils;

  const [formActionResult, setFormActionResult] = React.useState(
    FormActionResult.NONE
  );

  // const fetchProducersList = async () => {
  //   try {
  //     getAllProducers(
  //       (producers) => {
  //         setProducers(producers);
  //       },
  //       (error) => {
  //         showSnackbar(error, "error");
  //       }
  //     );
  //   } catch (error) {
  //     showSnackbar(error, "error");
  //   }
  // };

  useEffect(() => {
    const unsubscribe = onSnapshot(PRODUCER_COLLECTION, (snapshot) => {
      const producers = [];
      snapshot.forEach((doc) => {
        producers.push({ ...doc.data(), id: doc.id });
      });
      setProducers(producers);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // React.useEffect(() => {
  //   if (lastAction !== LastProducersActionType.UPDATED) {
  //     return;
  //   }

  //   if (formResultLoading) {
  //     return;
  //   }

  //   if (formError === null) {
  //     setFormActionResult(FormActionResult.SUCCESS);
  //     // fetch updated data
  //     dispatch(getAllProducers());
  //     // close our modal (since the data in the form is now outdated)
  //     handleClose();
  //   } else {
  //     setFormActionResult(FormActionResult.FAILURE);
  //   }
  // }, [lastAction, formResultLoading, formError, dispatch]);

  const handleCloseFromResultSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFormActionResult(FormActionResult.NONE);
  };

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

  const columns = [
    {
      name: "Name",
      options: {
        filter: true,
      },
    },
    {
      name: "Logo",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div
              dangerouslySetInnerHTML={{ __html: normalizeSvg(value) }}
            ></div>
          );
        },
      },
    },
    {
      name: "Description",
      options: {
        filter: true,
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <TableEditButton
              producer={value}
              handleOpen={handleOpen}
              setCurProducer={setCurProducer}
            />
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    draggableColumns: { enabled: true, transitionTime: 500 },
    expandableRowsHeader: true,
    storageKey: "producersDataTable",
    resizableColumns: true,
    selectableRows: "single",
  };

  useEffect(() => {
    // Map producers to the data format expected by MUIDataTable
    const newData = producers.map((producer) => [
      producer.name,
      producer.logoSvg,
      producer.description,
      producer,
    ]);
    setData(newData);
  }, [producers]);

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return <h4>Error: {error.message}</h4>;
  }

  return (
    <>
      <MUIDataTable
        title={"Phone manufactorer list"}
        data={data}
        columns={columns}
        options={options}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit
          </Typography>
          <ProducerForm producer={curProducer} />
        </Box>
      </Modal>

      <Snackbar
        open={formActionResult !== FormActionResult.NONE}
        autoHideDuration={2000}
        onClose={handleCloseFromResultSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFromResultSnackBar}
          {...(formActionResult !== FormActionResult.NONE && {
            severity:
              formActionResult === FormActionResult.SUCCESS
                ? "success"
                : "error",
          })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {FormActionResult.SUCCESS
            ? "Changes applied successfully"
            : "Action failed to execute. Please try again later"}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function ProducerAccordion({defaultExpanded = false}) {
  // const dispatch = useDispatch();
  const [formActionResult, setFormActionResult] = React.useState(
    FormActionResult.NONE
  );

  // // Check for adding result
  // const lastAction = useSelector((state) => state.producers.lastAction);
  // const formResultLoading = useSelector((state) => state.producers.loading);
  // const formError = useSelector((state) => state.producers.error);

  // React.useEffect(() => {
  //   if (lastAction !== LastProducersActionType.ADDED) {
  //     return;
  //   }

  //   if (formResultLoading) {
  //     return;
  //   }

  //   if (formError === null) {
  //     setFormActionResult(FormActionResult.SUCCESS);
  //     // fetch updated data
  //     dispatch(getAllProducers());
  //   } else {
  //     setFormActionResult(FormActionResult.FAILURE);
  //   }
  // }, [lastAction, formResultLoading, formError, dispatch]);

  const handleCloseFromResultSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFormActionResult(FormActionResult.NONE);
  };

  return (
    <>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography color="primary" variant="h4">
            Producers
          </Typography>
        </AccordionSummary>
        <AccordionActions
          sx={{
            justifyContent: "start",
          }}
        ></AccordionActions>
        <AccordionDetails>
          <ProducerForm producer={null} />
          <div style={{ height: 10, width: "100%" }}></div>
          <ProducerDataTable />
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={formActionResult !== FormActionResult.NONE}
        autoHideDuration={2000}
        onClose={handleCloseFromResultSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFromResultSnackBar}
          {...(formActionResult !== FormActionResult.NONE && {
            severity:
              formActionResult === FormActionResult.SUCCESS
                ? "success"
                : "error",
          })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {FormActionResult.SUCCESS
            ? "Added successfully"
            : "Action failed to execute. Please try again later"}
        </Alert>
      </Snackbar>
    </>
  );
}

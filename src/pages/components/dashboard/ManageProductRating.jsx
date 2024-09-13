import { Box, Button, Modal, TextField } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { RATING_COLLECTION, getAllProductRatings } from "../../../db/dbRating";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import MUIDataTable from "mui-datatables";
import PlusIcon from "@mui/icons-material/Add";
import { addRating } from "../../../db/dbRating";
import { Rating } from "../../../models/Rating";
import { useSelector } from "react-redux";
import { getProductById } from "../../../db/dbProduct";

export function ProductRatingTable({ productId }) {
  //utils
  const { showSnackbar } = useSnackbarUtils();

  const [tableData, setTableData] = useState([[]]);

  const getDataForTable = (ratings) => {
    let data = [];
    ratings.forEach((rating) => {
      data.push({
        id: rating.id,
        userId: rating.userId,
        score: rating.score,
        date: rating.date,
        lastUpdate: rating.lastUpdate,
      });
    });
    return data;
  };

  const fetchProductRating = async () => {
    try {
      getAllProductRatings(
        productId,
        (ratings) => {
          setTableData(getDataForTable(ratings));
        },
        (error) => {
          showSnackbar(error, "warning", true);
        }
      );
    } catch (error) {
      showSnackbar(error, "warning", true);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(RATING_COLLECTION, fetchProductRating);
    return unsubscribe;
  }, []);

  const columns = [
    {
      name: "id",
      options: {
        filter: false,
      },
    },
    {
      name: "userId",
      options: {
        filter: false,
      },
    },
    {
      name: "score",
      options: {
        filter: false,
      },
    },
    {
      name: "date",
      options: {
        filter: false,
      },
    },
    {
      name: "lastUpdate",
      options: {
        filter: false,
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    storageKey: "productDataTable",
    resizableColumns: true,
    selectableRows: "single",
  };

  return (
    <MUIDataTable
      title={"Product Rating"}
      data={tableData}
      columns={columns}
      options={options}
      width="100%"
    />
  );
}

export default function ManageProductRating({ productId }) {
  const { showSnackbar } = useSnackbarUtils();

  const [open, setOpen] = useState(false);
  const [ratingScore, setRating] = useState(0);
  const [product, setProduct] = useState(null);

  const userState = useSelector((state) => state.user);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRating(0);
  };

  const handleAddNewRating = () => {
    if (ratingScore < 0 || ratingScore > 5) {
      showSnackbar("Rating must be between 0 and 5", "error");
      return;
    }

    var rating = new Rating();
    rating.productId = productId;
    rating.userId = userState.user.id;
    rating.score = ratingScore;
    rating.isStaffRating = userState.isStaff;
    addRating(
      rating.data(),
      product,
      () => {
        showSnackbar("Rating added successfully", "success");
      },
      (error) => {
        showSnackbar("Error adding rating: " + error, "error");
      }
    );
    handleClose();
  };

  useEffect(() => {
    getProductById(
      productId,
      (product) => {
        setProduct(product);
      },
      (error) => {
        showSnackbar("Error getting product: " + error, "error");
      }
    );
  }, []);

  if (productId === null) {
    throw new Error("Product ID is null");
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
        }}
      >
        <Button
          startIcon={<PlusIcon />}
          variant="outlined"
          color="primary"
          sx={{ margin: "10px" }}
          onClick={handleOpen}
        >
          Add Rating
        </Button>
      </Box>
      <ProductRatingTable productId={productId} />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Add New Rating</h2>
          <TextField
            label="Score"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={ratingScore}
            onChange={(e) => setRating(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
              gap: "10px",
            }}
          >
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddNewRating()}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { storage } from "../../../config/firebase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { listAll, ref } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

function ImageSelector({ onImageSelectionChange = null, path = "" }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    // get a reference to the storage bucket
    const storageRef = ref(storage, path);

    // list all files in the bucket
    listAll(storageRef)
      .then((res) => {
        const urlPromises = res.items.map((itemRef) =>
            getDownloadURL(itemRef).then((url) => url)
            );
        Promise.all(urlPromises).then((urls) => {
            setImageUrls(urls);
            }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [path]);

  return (
    <Select
      onChange={
        (e) => {
          if(onImageSelectionChange!==null){
            onImageSelectionChange(e);
          }
          setSelectedItem(e.target.value);
        }
      }
      value={selectedItem}
    >
      <MenuItem value="">None</MenuItem>
      {imageUrls.map((url, index) => (
        <MenuItem key={index} value={url}>
          <img src={url} alt="Product" width="50" height="50" />
        </MenuItem>
      ))}
    </Select>
  );
}

export default ImageSelector;

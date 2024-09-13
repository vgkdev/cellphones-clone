import { storage } from "../config/firebase";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
  listAll,
  uploadBytes,
} from "firebase/storage";
import { updatePost } from "./dbPost";
import { DISPLAY_PARTS as EVENT_DISPLAY_PART } from "../models/Event";

// Limit the size of the file to 500KB
const MAX_SIZE = 500 * 1024;
const MAX_HIGH_QUALITY_SIZE = 1000 * 1024 * 2;

export const uploadStockImage = async (
  productId,
  stockId,
  file,
  onComplete = null,
  onError = null,
  onProgress = null
) => {
  if (file === null) {
    return;
  }

  if (file.size > MAX_SIZE) {
    if (onError) {
      onError("File is too large, max size = 50KB");
    }
    return;
  }

  console.log("uploadStockImage");
  console.log("productId:", productId);
  console.log("stockId:", stockId);
  console.log("file:", file);

  try {
    const storageRef = ref(
      storage,
      `products/${productId}/stocks/${stockId}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (snapshot.state === "running") {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onComplete) {
            onComplete(downloadURL, file.name);
          }
        });
      }
    );
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};

export const deleteImage = async (url, onSuccess = null, onFailure = null) => {
  console.log("deleteImage");
  const storageRef = ref(storage, url);
  try {
    deleteObject(storageRef)
      .then(() => {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("deleteImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

export const deleteStockImageBucket = async (
  productId,
  stockId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteStockImageBucket");
  // we need to delete all images in the folder
  const storageRef = ref(storage, `products/${productId}/stocks/${stockId}`);
  const res = await listAll(storageRef);
  await res.items.forEach((itemRef) => {
    deleteObject(itemRef).catch((error) => {
      if (onFailure) {
        console.error("deleteStockImageBucket error", error);
        onFailure(error);
      }
    });
  });
  if (onSuccess) {
    onSuccess();
  }
};

export const uploadProductImage = async (
  productId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  console.log("uploadProductImage");

  if (file.size > MAX_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  try {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadProductImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL, file.name);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadProductImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const uploadProductDisplayImage = async (
  productId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  console.log("uploadProductDisplayImage");

  if (file.size > MAX_HIGH_QUALITY_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  try {
    const storageRef = ref(storage, `products/${productId}/displayImage`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadProductDisplayImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadProductDisplayImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const deleteImageByUrl = async (
  url,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteImageByUrl");
  const storageRef = ref(storage, url);
  try {
    deleteObject(storageRef)
      .then(() => {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("deleteImageByUrl error", error);
        if (onFailure) {
          onFailure(error);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProductImageOnStorage = async (
  productId,
  imageName,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteProductImage");
  const storageRef = ref(storage, `products/${productId}/${imageName}`);
  try {
    deleteObject(storageRef)
      .then(() => {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("deleteProductImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

const getUniqueFileName = (names, fileName) => {
  if (names.indexOf(fileName) === -1) {
    return fileName;
  }

  let i = 1;
  let newFileName = fileName;

  while (names.indexOf(newFileName) !== -1) {
    const fileNameParts = fileName.split(".");
    const extension = fileNameParts.pop();
    const name = fileNameParts.join(".");
    newFileName = `${name}(${i}).${extension}`;
    i++;
  }

  return newFileName;
};

export const syncUploadPostImage = async (post, file) => {
  if (file === null) {
    return null;
  }

  console.log("syncUploadPostImage");

  if (file.size > MAX_SIZE) {
    return Promise.reject("File is too large, max size = 500KB");
  }

  if (post.id === "") {
    return Promise.reject("Post not created yet");
  }

  const fileName = getUniqueFileName(post.imageNames, file.name);

  const storageRef = ref(storage, `posts/${post.id}/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file);
  console.log("Uploaded a blob or file!");

  // Get the download URL
  const url = await getDownloadURL(snapshot.ref);
  post.imageUrls.push(url);
  post.imageNames.push(fileName);

  await updatePost(post);

  return url;
};

export const uploadReviewAttachedImage = async (
  userId,
  reviewId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  console.log("uploadReviewAttachedImage");

  if (file.size > MAX_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  try {
    const storageRef = ref(
      storage,
      `users/${userId}/reviews/${reviewId}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadReviewAttachedImage error", error);
        if (onFailure) {
          // debugger;

          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadReviewAttachedImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const getAllDefaultUserAvatars = (onSuccess, onFailure = null) => {
  const storageRef = ref(storage, "defaultUserAvatars");
  listAll(storageRef)
    .then((res) => {
      const urls = [];
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          urls.push(url);
          if (urls.length === res.items.length) {
            onSuccess(urls);
          }
        });
      });
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(error);
      }
    });
};

export const uploadUserAvatar = async (
  userId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  console.log("uploadUserAvatar");

  if (file.size > MAX_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  // Get the file extension
  const fileExtension = file.name.split(".").pop();

  // Create a new Blob object with the same type as the file
  const newFile = new Blob([file], { type: file.type });

  // Create a new File object with the new name and the same type as the file
  const renamedFile = new File([newFile], `avatar.${fileExtension}`, {
    type: file.type,
  });

  try {
    const storageRef = ref(storage, `users/${userId}/avatar.${fileExtension}`);
    const uploadTask = uploadBytesResumable(storageRef, renamedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadUserAvatar error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadUserAvatar error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const setVoucherIconImage = async (
  voucherId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  if (voucherId === "" || voucherId === null || voucherId === undefined) {
    console.error("voucherId is empty");
    if (onFailure) {
      onFailure("voucherId is empty");
    }
    return;
  }

  console.log("uploadVoucherIconImage");

  if (file.size > MAX_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  // Get the file extension
  const fileExtension = file.name.split(".").pop();

  // Create a new Blob object with the same type as the file
  const newFile = new Blob([file], { type: file.type });

  // Create a new File object with the new name and the same type as the file
  const renamedFile = new File([newFile], `icon.${fileExtension}`, {
    type: file.type,
  });

  try {
    const storageRef = ref(
      storage,
      `vouchers/${voucherId}/icon.${fileExtension}`
    );
    const uploadTask = uploadBytesResumable(storageRef, renamedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadVoucherIconImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadVoucherIconImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const setVoucherDisplayImage = async (
  voucherId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    return;
  }

  if (voucherId === "" || voucherId === null || voucherId === undefined) {
    console.error("voucherId is empty");
    if (onFailure) {
      onFailure("voucherId is empty");
    }
    return;
  }

  console.log("uploadVoucherDisplayImage");

  if (file.size > MAX_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 500KB");
    }
    return;
  }

  // Get the file extension
  const fileExtension = file.name.split(".").pop();

  // Create a new Blob object with the same type as the file
  const newFile = new Blob([file], { type: file.type });

  // Create a new File object with the new name and the same type as the file
  const renamedFile = new File([newFile], `display.${fileExtension}`, {
    type: file.type,
  });

  try {
    const storageRef = ref(
      storage,
      `vouchers/${voucherId}/display.${fileExtension}`
    );
    const uploadTask = uploadBytesResumable(storageRef, renamedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.error("uploadVoucherDisplayImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadVoucherDisplayImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const getAllVoucherDefaultIcons = (onSuccess, onFailure = null) => {
  const storageRef = ref(storage, "defaultVoucherIcons");
  listAll(storageRef)
    .then((res) => {
      const urls = [];
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          urls.push(url);
          if (urls.length === res.items.length) {
            onSuccess(urls);
          }
        });
      });
    })
    .catch((error) => {
      console.error("getAllVoucherDefaultIcons error", error);
      if (onFailure) {
        onFailure(error);
      }
    });
};

export const uploadEventDisplayImage = async (
  eventId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (file === null) {
    console.error("file is null");
    if (onFailure) {
      onFailure("file is null");
    }
    return;
  }

  if (eventId === "" || eventId === null || eventId === undefined) {
    console.error("eventId is empty");
    if (onFailure) {
      onFailure("eventId is empty");
    }
    return;
  }

  console.log("uploadEventDisplayImage");
  if (file.size > MAX_HIGH_QUALITY_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 1000KB");
    }
    return;
  }
  try {
    // Get the file extension
    const fileExtension = file.name.split(".").pop();

    // Create a new Blob object with the same type as the file
    const newFile = new Blob([file], { type: file.type });

    // Create a new File object with the new name and the same type as the file
    const renamedFile = new File([newFile], `displayName.${fileExtension}`, {
      type: file.type,
    });

    const storageRef = ref(
      storage,
      `events/${eventId}/displayImage.${fileExtension}`
    );
    const uploadTask = uploadBytesResumable(storageRef, renamedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("uploadEventDisplayImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const uploadEventDisplayPart = (
  eventId,
  partName,
  file,
  onSuccess = null,
  onFailure = null
) => {
  if (!Object.values(EVENT_DISPLAY_PART).includes(partName)) {
    console.error("Invalid partName " + partName);
    if (onFailure) {
      onFailure("Invalid partName " + partName);
    }
    return;
  }

  if (eventId === "" || eventId === null || eventId === undefined) {
    console.error("eventId is empty");
    if (onFailure) {
      onFailure("eventId is empty");
    }
    return;
  }

  try {
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${partName}.${fileExtension}`;
    const storageRef = ref(storage, `events/${eventId}/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("uploadEventDisplayPart error", error);
        if (onFailure) {
          onFailure(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onSuccess) {
            onSuccess(partName, downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.error("uploadEventDisplayPart error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const handleUploadEventCarouselImage = async (
  eventId,
  file,
  onSuccess = null,
  onFailure = null
) => {
  console.log("handleUploadEventCarouselImage");
  if (file === null) {
    console.error("file is null");
    if (onFailure) {
      onFailure("file is null");
    }
    return;
  }

  if (eventId === "" || eventId === null || eventId === undefined) {
    console.error("eventId is empty");
    if (onFailure) {
      onFailure("eventId is empty");
    }
    return;
  }

  console.log("uploadEventCarouselImage");
  if (file.size > MAX_HIGH_QUALITY_SIZE) {
    if (onFailure) {
      onFailure("File is too large, max size = 1000KB");
    }
    return;
  }
  try {
    const storageRef = ref(storage, `events/${eventId}/images/${file.name}`);

    // check if file is already existed
    getDownloadURL(storageRef)
      .then((url) => {
        if (onFailure) {
          onFailure("File is already existed " + file.name);
        }
      })
      .catch((error) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            if (onFailure) {
              onFailure(error);
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              if (onSuccess) {
                onSuccess(downloadURL);
              }
            });
          }
        );
      });
  } catch (error) {
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const deleteEventCarouselImage = async (
  imageUrl,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteEventCarouselImage");
  const storageRef = ref(storage, imageUrl);
  try {
    deleteObject(storageRef)
      .then(() => {
        if (onSuccess) {
          onSuccess(imageUrl);
        }
      })
      .catch((error) => {
        console.error("deleteEventCarouselImage error", error);
        if (onFailure) {
          onFailure(error);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

export const getAllDefaultNotificationIcons = (
  onSuccess = null,
  onFailure = null
) => {
  const storageRef = ref(storage, "defaultNotificationIcons");
  listAll(storageRef)
    .then((res) => {
      const urls = [];
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          urls.push(url);
          if (urls.length === res.items.length) {
            if (onSuccess) {
              onSuccess(urls);
            }
          }
        });
      });
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(error);
      }
    });
};

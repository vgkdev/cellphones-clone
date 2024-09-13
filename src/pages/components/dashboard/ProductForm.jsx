import * as React from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import FormGrid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from "@mui/icons-material";

import { PRODUCT_TYPES, Product } from "../../../models/Product";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../../db/dbProduct";
import { toNumArray } from "../../../utils/num";
import { toSimpleDateString } from "../../../utils/date";

import SetupProduct from "./SetupProduct";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import BasicModal from "./BasicModal";
import { onSnapshot } from "firebase/firestore";
import { PRODUCER_COLLECTION } from "../../../db/dbProducer";
import { set } from "firebase/database";
import { isValidHtml, normalizeSvg, priceFormatter } from "../../../utils/stringHelper";
import { LoadingMessage } from "../../../components/miscellaneous/SimpleLoadingDisplay";

//================================================
// Constants
//================================================
const FormValidation = {
  SUCCESS: "success",
  NONE: "",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
//================================================
//================================================

//================================================
// Utility functions
//================================================

function hasError(validation) {
  return (
    validation !== FormValidation.SUCCESS && validation !== FormValidation.NONE
  );
}

function getDataUnitArray(stringArr) {
  return stringArr.map((str) => {
    const unit = str.match(/[a-zA-Z]+/g)[0];
    return unit;
  });
}
//================================================
//================================================

//================================================
// Hardcoded stuffs, probably should be fetched
//================================================
const SCREEN_TECHS = [
  "IPS LCD",
  "TFT",
  "AMOLED",
  "OLED",
  "Super AMOLED",
  "Dynamic AMOLED 2X",
  "Super Retina XDR",
  "Super Retina XDR OLED",
  "Retina IPS LCD",
];

const SCREEN_OUTLOOKS = [
  "Bunny ears",
  "Waterdrop notch",
  "Punch hole",
  "Pop-up camera",
  "Under-display camera",
  "Dynamic Island",
  "Dynamic Notch",
];

const CHARGER_CONNECTORS = [
  "USB-C",
  "Micro USB",
  "Lightning",
  "MagSafe",
  "Wireless",
];

const NETWORKS = ["2G", "3G", "4G", "5G"];

const NFC = ["Yes", "No"];

const GPS = ["GPS", "GLONASS", "BDS", "GALILEO", "QZSS", "NavIC", "SBAS"];

const SENSORS = [
  "Fingerprint",
  "Accelerometer",
  "Gyroscope",
  "Proximity",
  "Compass",
  "Barometer",
  "SpO2",
  "Heart rate",
  "UV",
  "Pedometer",
  "Thermometer",
  "Hygrometer",
  "Altimeter",
  "Gas",
  "CO2",
  "CO",
];

const DATA_UNITS = ["GB", "TB", "MB"];

const USAGES = [
  "Study",
  "Work",
  "Gaming",
  "Video editing",
  "Music production",
  "Photography",
  "Social media",
  "Entertainment",
  "Fitness",
  "Travel",
  "Business",
  "Casual",
  "Fashion",
  "Outdoor",
  "Indoor",
  "Professional",
  "Personal",
  "Family",
  "Health",
  "Productivity",
  "Art",
  "Design",
  "Development",
  "Programming",
  "Engineering",
  "Science",
  "Research",
  "Education",
];

//================================================
//================================================

export default function ProductForm({ productId = null }) {
  // +========+
  // | states |
  // +========+
  const [autoReset, setAutoReset] = useState(true);
  const [producerList, setProducerList] = useState([]);
  const [product, setProduct] = useState(null);
  const [shouldOpenProductSetupModal, setShouldOpenProductSetupModal] =
    useState(false);
  const [targetProduct, setTargetProduct] = useState(null);

  // Basic info
  const [productName, setProductName] = useState(product ? product.name : "");
  const [producer, setProducer] = useState(product ? product.manufacturer : "");
  const [overview, setOverview] = useState(product ? product.overview : "");
  // Variant
  const [variantsIndices, setVariantsIndices] = useState(
    product ? Array.from({ length: product.variantCount }, (_, i) => i) : [0]
  );
  const [variantCount, setVariantCount] = useState(
    product ? product.variantCount : 1
  );
  const [newVariantIndex, setNewVariantIndex] = useState(
    product ? product.variantCount : 1
  );
  const [variantName, setVariantName] = useState(
    product ? product.variantName : [""]
  );
  const [variantMemory, setVariantMemory] = useState(
    product ? product.variantMemory : [0]
  );
  const [variantMemoryDataUnit, setVariantMemoryDataUnit] = useState(
    product ? getDataUnitArray(product.variantMemoryDataUnit) : ["GB"]
  );
  const [variantStorage, setVariantStorage] = useState(
    product ? product.variantStorage : [0]
  );
  const [variantStorageDataUnit, setVariantStorageDataUnit] = useState(
    product ? getDataUnitArray(product.variantStorageDataUnit) : ["GB"]
  );
  const [variantPrice, setVariantPrice] = useState(
    product ? product.variantPrice : [0]
  );
  // Screen
  const [screenTech, setScreenTech] = useState(
    product ? product.screenTech : ""
  );
  const [screenWidth, setScreenWidth] = useState(
    product ? product.screenWidth : 0
  );
  const [screenHeight, setScreenHeight] = useState(
    product ? product.screenHeight : 0
  );
  const [screenSize, setScreenSize] = useState(
    product ? product.screenSize : 0
  );
  const [refreshRate, setRefreshRate] = useState(
    product ? product.refreshRate : 0
  );
  const [screenFeatures, setScreenFeatures] = useState(
    product ? product.screenFeatures : ""
  );
  const [screenOutlook, setScreenOutlook] = useState(
    product ? product.screenOutlook : ""
  );
  const [backCamera, setBackCamera] = useState(
    product ? product.backCamera : ""
  );
  const [backCamResolution, setBackCamResolution] = useState(
    product ? product.backCamResolution : ""
  );
  const [backCameraVideo, setBackCameraVideo] = useState(
    product ? product.backCameraVideo : ""
  );
  const [backCameraFeatures, setBackCameraFeatures] = useState(
    product ? product.backCameraFeatures : ""
  );
  const [frontCamera, setFrontCamera] = useState(
    product ? product.frontCamera : ""
  );
  const [frontCamResolution, setFrontCamResolution] = useState(
    product ? product.frontCamResolution : ""
  );
  const [frontCameraVideo, setFrontCameraVideo] = useState(
    product ? product.frontCameraVideo : ""
  );
  const [chipset, setChipset] = useState(product ? product.chipset : "");
  const [cpu, setCpu] = useState(product ? product.cpu : "");
  const [cpuName, setCpuName] = useState(product ? product.cpuName : "");
  const [coresNumber, setCoresNumber] = useState(
    product ? product.coresNumber : 0
  );
  const [gpu, setGpu] = useState(product ? product.gpu : "");
  const [battery, setBattery] = useState(product ? product.battery : "");
  const [chargerTech, setChargerTech] = useState(
    product ? product.chargerTech : ""
  );
  const [chargerConnector, setChargerConnector] = useState(
    product ? product.chargerConnector : ""
  );
  const [simCard, setSimCard] = useState(product ? product.simCard : "");
  const [os, setOs] = useState(product ? product.os : "");
  const [jack_3_5mm, setJack_3_5mm] = useState(
    product ? product.jack_3_5mm : ""
  );
  const [nfc, setNfc] = useState(product ? product.nfc : "");
  const [network, setNetwork] = useState(product ? product.network : "");
  const [bluetooth, setBluetooth] = useState(product ? product.bluetooth : "");
  const [wifi, setWifi] = useState(product ? product.wifi : "");
  const [gps, setGps] = useState(product ? product.gps : []);
  const [phoneWidth, setPhoneWidth] = useState(
    product ? product.phoneWidth : 0
  );
  const [phoneHeight, setPhoneHeight] = useState(
    product ? product.phoneHeight : 0
  );
  const [phoneDepth, setPhoneDepth] = useState(
    product ? product.phoneDepth : 0
  );
  const [weight, setWeight] = useState(product ? product.weight : 0);
  const [backMaterial, setBackMaterial] = useState(
    product ? product.backMaterial : ""
  );
  const [frameMaterial, setFrameMaterial] = useState(
    product ? product.frameMaterial : ""
  );
  // Others
  const [compatibility, setCompatibility] = useState(
    product ? product.compatibility : ""
  );
  const [waterAndDustProof, setWaterAndDustProof] = useState(
    product ? product.waterAndDustProof : ""
  );
  const [additionalFeatures, setAdditionalFeatures] = useState(
    product ? product.additionalFeatures : ""
  );
  const [otherUtilities, setOtherUtilities] = useState(
    product ? product.otherUtilities : ""
  );
  const [soundTech, setSoundTech] = useState(product ? product.soundTech : "");
  // Utility features
  const [fingerPrintTech, setFingerPrintTech] = useState(
    product ? product.fingerPrintTech : ""
  );
  const [sensors, setSensors] = useState(product ? product.sensors : []);
  const [specialFeatures, setSpecialFeatures] = useState(
    product ? product.specialFeatures : ""
  );
  // Common
  const [usages, setUsages] = useState(product ? product.usages : []);
  const [publishedAt, setPublishedAt] = useState(
    product ? toSimpleDateString(product.publishedAt) : ""
  );

  // +======================+
  // | validation states    |
  // +======================+
  const [productNameValidation, setProductNameValidation] = useState(
    FormValidation.NONE
  );
  const [manufacturerValidation, setManufacturerValidation] = useState(
    FormValidation.NONE
  );
  const [overviewValidation, setOverviewValidation] = useState(
    FormValidation.NONE
  );
  // Screen specs
  const [screenSizeValidation, setScreenSizeValidation] = useState(
    FormValidation.NONE
  );
  const [refreshRateValidation, setRefreshRateValidation] = useState(
    FormValidation.NONE
  );
  const [screenWidthValidation, setScreenWidthValidation] = useState(
    FormValidation.NONE
  );
  const [screenHeightValidation, setScreenHeightValidation] = useState(
    FormValidation.NONE
  );
  const [screenTechValidation, setScreenTechValidation] = useState(
    FormValidation.NONE
  );
  const [screenFeaturesValidation, setScreenFeaturesValidation] = useState(
    FormValidation.NONE
  );
  const [screenOutlookValidation, setScreenOutlookValidation] = useState(
    FormValidation.NONE
  );
  const [backCameraValidation, setBackCameraValidation] = useState(
    FormValidation.NONE
  );
  const [backCameraResolutionValidation, setBackCameraResolutionValidation] =
    useState(FormValidation.NONE);
  const [backCameraVideoValidation, setBackCameraVideoValidation] = useState(
    FormValidation.NONE
  );
  const [backCameraFeaturesValidation, setBackCameraFeaturesValidation] =
    useState(FormValidation.NONE);
  const [frontCameraValidation, setFrontCameraValidation] = useState(
    FormValidation.NONE
  );
  const [frontCameraVideoValidation, setFrontCameraVideoValidation] = useState(
    FormValidation.NONE
  );
  const [frontCameraResolutionValidation, setFrontCameraResolutionValidation] =
    useState(FormValidation.NONE);
  const [chipsetValidation, setChipsetValidation] = useState(
    FormValidation.NONE
  );
  const [cpuNameValidation, setCpuNameValidation] = useState(
    FormValidation.NONE
  );
  const [coresNumberValidation, setCoresNumberValidation] = useState(
    FormValidation.NONE
  );
  const [cpuValidation, setCpuValidation] = useState(FormValidation.NONE);
  const [gpuValidation, setGpuValidation] = useState(FormValidation.NONE);
  const [batteryValidation, setBatteryValidation] = useState(
    FormValidation.NONE
  );
  const [chargerTechValidation, setChargerTechValidation] = useState(
    FormValidation.NONE
  );
  const [chargerConnectorValidation, setChargerConnectorValidation] = useState(
    FormValidation.NONE
  );
  const [simCardValidation, setSimCardValidation] = useState(
    FormValidation.NONE
  );
  const [osValidation, setOsValidation] = useState(FormValidation.NONE);
  const [jack_3_5mmValidation, setJack_3_5mmValidation] = useState(
    FormValidation.NONE
  );
  const [nfcValidation, setNfcValidation] = useState(FormValidation.NONE);
  const [networkValidation, setNetworkValidation] = useState(
    FormValidation.NONE
  );
  const [bluetoothValidation, setBluetoothValidation] = useState(
    FormValidation.NONE
  );
  const [wifiValidation, setWifiValidation] = useState(FormValidation.NONE);
  const [gpsValidation, setGpsValidation] = useState(FormValidation.NONE);
  const [phoneWidthValidation, setPhoneWidthValidation] = useState(
    FormValidation.NONE
  );
  const [phoneHeightValidation, setPhoneHeightValidation] = useState(
    FormValidation.NONE
  );
  const [phoneDepthValidation, setPhoneDepthValidation] = useState(
    FormValidation.NONE
  );
  const [weightValidation, setWeightValidation] = useState(FormValidation.NONE);
  const [backMaterialValidation, setBackMaterialValidation] = useState(
    FormValidation.NONE
  );
  const [frameMaterialValidation, setFrameMaterialValidation] = useState(
    FormValidation.NONE
  );
  // Others
  const [compatibilityValidation, setCompatibilityValidation] = useState(
    FormValidation.NONE
  );
  const [waterAndDustProofValidation, setWaterAndDustProofValidation] =
    useState(FormValidation.NONE);
  const [additionalFeaturesValidation, setAdditionalFeaturesValidation] =
    useState(FormValidation.NONE);
  const [otherUtilitiesValidation, setOtherUtilitiesValidation] = useState(
    FormValidation.NONE
  );
  const [soundTechValidation, setSoundTechValidation] = useState(
    FormValidation.NONE
  );
  // Utility features
  const [fingerPrintTechValidation, setfingerPrintTechValidation] = useState(
    FormValidation.NONE
  );
  const [sensorsValidation, setSensorsValidation] = useState(
    FormValidation.NONE
  );
  const [specialFeaturesValidation, setSpecialFeaturesValidation] = useState(
    FormValidation.NONE
  );

  // Common
  const [usagesValidation, setUsagesValidation] = useState(FormValidation.NONE);
  const [publishedAtValidation, setPublishedAtValidation] = useState(
    FormValidation.NONE
  );
  // +======================+
  // | validation functions |
  // +======================+
  const validateProductName = (value) => {
    // doh't use state value because it's async, use dependency value instead
    if (value === "") {
      setProductNameValidation("Product name is required");
      return false;
    } else if (value.length < 3) {
      setProductNameValidation("Product name must be at least 3 characters");
      return false;
    }
    setProductNameValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateManufacturer = (val) => {
    if (val === "") {
      setManufacturerValidation("Manufacturer is required");
      return false;
    }
    setManufacturerValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateOverview = (val) => {
    setOverviewValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateScreenTech = (val) => {
    setScreenTechValidation(FormValidation.SUCCESS);
    return true;
  };
  // Screen specs
  const validateScreenSize = (val) => {
    if (val < 0) {
      setScreenSizeValidation("Screen size must be a positive number");
      return false;
    }
    setScreenSizeValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateRefreshRate = (val) => {
    if (val < 0) {
      setRefreshRateValidation("Refresh rate must be a positive number");
      return false;
    }
    setRefreshRateValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateScreenWidth = (val) => {
    if (val < 0) {
      setScreenWidthValidation("Screen width must be a positive number");
      return false;
    }
    setScreenWidthValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateScreenHeight = (val) => {
    if (val < 0) {
      setScreenHeightValidation("Screen height must be a positive number");
      return false;
    }
    setScreenHeightValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateScreenFeatures = (val) => {
    setScreenFeaturesValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateScreenOutlook = (val) => {
    setScreenOutlookValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBackCamera = (val) => {
    setBackCameraValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBackCameraResolution = (val) => {
    if (val.length > 16) {
      setBackCameraResolutionValidation(
        "Back camera resolution must be less than 16 characters"
      );
      return false;
    } else if (!val.includes("MP")) {
      setBackCameraResolutionValidation(
        "Back camera resolution must contain 'MP'"
      );
      return false;
    }
    setBackCameraResolutionValidation(FormValidation.SUCCESS);
    return true;
  };

  const validateBackCameraVideo = (val) => {
    setBackCameraVideoValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBackCameraFeatures = (val) => {
    setBackCameraFeaturesValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateFrontCamera = (val) => {
    setFrontCameraValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateFrontCameraResolution = (val) => {
    if (val.length > 16) {
      setFrontCameraResolutionValidation(
        "Front camera resolution must be less than 16 characters"
      );
      return false;
    } else if (!val.includes("MP")) {
      setFrontCameraResolutionValidation(
        "Front camera resolution must contain 'MP'"
      );
      return false;
    }
    setFrontCameraResolutionValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateFrontCameraVideo = (val) => {
    setFrontCameraVideoValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateChipset = (val) => {
    if (val === "") {
      setChipsetValidation("Chipset is required");
      return false;
    }

    setChipsetValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateCpuName = (val) => {
    if (val === "") {
      setCpuNameValidation("CPU name is required");
      return false;
    }

    setCpuNameValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateCoresNumber = (val) => {
    if (isNaN(val)) {
      setCoresNumberValidation("Cores number must be a number");
      return false;
    } else if (val === "") {
      // console.log("2");
      setCoresNumberValidation("Cores number is required");
      return false;
    } else if (val < 0) {
      // console.log("3");
      setCoresNumberValidation("Cores number must be a positive number");
      return false;
    }
    setCoresNumberValidation(FormValidation.SUCCESS);
    // console.log("4");
    return true;
  };
  const validateCpu = (val) => {
    if (val === "") {
      setCpuValidation("CPU is required");
      return false;
    }

    setCpuValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateGpu = (val) => {
    if (val === "") {
      setGpuValidation("GPU is required");
      return false;
    }

    setGpuValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBattery = (val) => {
    if (val === "") {
      setBatteryValidation("Battery capacity is required");
      return false;
    } else if (val < 0) {
      setBatteryValidation("Battery capacity must be a positive number");
      return false;
    }
    setBatteryValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateChargerTech = (val) => {
    if (val === "") {
      setChargerTechValidation("Charger tech is required");
      return false;
    }
    setChargerTechValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateChargerConnector = (val) => {
    if (val === "") {
      setChargerConnectorValidation("Charger connector is required");
      return false;
    }
    setChargerConnectorValidation(FormValidation.SUCCESS);
    return true;
  };
  // Connectities
  const validateSimCard = (val) => {
    if (val === "") {
      setSimCardValidation("Sim card is required");
      return false;
    }
    setSimCardValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateOs = (val) => {
    if (val === "") {
      setOsValidation("Operating system is required");
      return false;
    }
    setOsValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateJack_3_5mm = (val) => {
    if (val === "") {
      setJack_3_5mmValidation("Jack 3.5mm is required");
      return false;
    }
    setJack_3_5mmValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateNfc = (val) => {
    if (val === "") {
      setNfcValidation("NFC is required");
      return false;
    }
    setNfcValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateNetwork = (val) => {
    if (val === "") {
      setNetworkValidation("Network is required");
      return false;
    }
    setNetworkValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBluetooth = (val) => {
    if (val === "") {
      setBluetoothValidation("Bluetooth is required");
      return false;
    }
    setBluetoothValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateWifi = (val) => {
    if (val === "") {
      setWifiValidation("Wifi is required");
      return false;
    }
    setWifiValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateGps = (val) => {
    if (val === "") {
      setGpsValidation("GPS is required");
      return false;
    }
    setGpsValidation(FormValidation.SUCCESS);
    return true;
  };
  // Phone dimensions
  const validatePhoneWidth = (val) => {
    if (val === "") {
      setPhoneWidthValidation("Phone width is required");
      return false;
    } else if (val < 0) {
      setPhoneWidthValidation("Phone width must be a positive number");
      return false;
    }
    setPhoneWidthValidation(FormValidation.SUCCESS);
    return true;
  };
  const validatePhoneHeight = (val) => {
    if (val === "") {
      setPhoneHeightValidation("Phone height is required");
      return false;
    } else if (val < 0) {
      setPhoneHeightValidation("Phone height must be a positive number");
      return false;
    }
    setPhoneHeightValidation(FormValidation.SUCCESS);
    return true;
  };
  const validatePhoneDepth = (val) => {
    if (val === "") {
      setPhoneDepthValidation("Phone depth is required");
      return false;
    } else if (val < 0) {
      setPhoneDepthValidation("Phone depth must be a positive number");
      return false;
    }
    setPhoneDepthValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateWeight = (val) => {
    if (val < 0) {
      setWeightValidation("Weight must be a positive number");
      return false;
    }
    setWeightValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateBackMaterial = (val) => {
    setBackMaterialValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateFrameMaterial = (val) => {
    setFrameMaterialValidation(FormValidation.SUCCESS);
    return true;
  };
  // Others
  const validateCompatibility = (val) => {
    setCompatibilityValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateWaterAndDustProof = (val) => {
    setWaterAndDustProofValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateAdditionalFeatures = (val) => {
    setAdditionalFeaturesValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateOtherUtilities = (val) => {
    setOtherUtilitiesValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateSoundTech = (val) => {
    setSoundTechValidation(FormValidation.SUCCESS);
    return true;
  };
  // Utility features
  const validateFingerPrintTech = (val) => {
    setfingerPrintTechValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateSensors = (val) => {
    setSensorsValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateSpecialFeatures = (val) => {
    setSpecialFeaturesValidation(FormValidation.SUCCESS);
    return true;
  };
  // Common
  const validateUsages = (val) => {
    if (val.length === 0) {
      setUsagesValidation("Usages is required");
      return false;
    }
    setUsagesValidation(FormValidation.SUCCESS);
    return true;
  };
  const validatePublishedAt = (val) => {
    if (val === "") {
      setPublishedAtValidation("Published date is required");
      return false;
    }
    setPublishedAtValidation(FormValidation.SUCCESS);
    return true;
  };

  const { showSnackbar } = useSnackbarUtils();

  // +======================+
  // | event handlers       |
  // +======================+
  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
    validateProductName(event.target.value);
  };
  const handleSelectManufacturerChange = (event) => {
    setProducer(event.target.value);
    validateManufacturer(event.target.value);
  };
  const handleOverviewChange = (event) => {
    setOverview(event.target.value);
    validateOverview(event.target.value);
  };
  const handleScreenSizeChange = (event) => {
    setScreenSize(event.target.value);
    validateScreenSize(event.target.value);
  };
  const handleRefreshRateChange = (event) => {
    setRefreshRate(event.target.value);
    validateRefreshRate(event.target.value);
  };
  const handleScreenWidthChange = (event) => {
    setScreenWidth(event.target.value);
    validateScreenWidth(event.target.value);
  };
  const handleScreenHeightChange = (event) => {
    setScreenHeight(event.target.value);
    validateScreenHeight(event.target.value);
  };
  const handleSelectScreenTechChange = (event) => {
    setScreenTech(event.target.value);
    validateScreenTech(event.target.value);
  };
  const handleScreenFeaturesChange = (event) => {
    setScreenFeatures(event.target.value);
    validateScreenFeatures(event.target.value);
  };
  const handleSelectScreenOutlookChange = (event) => {
    setScreenOutlook(event.target.value);
    validateScreenOutlook(event.target.value);
  };
  const handleBackCameraChange = (event) => {
    setBackCamera(event.target.value);
    validateBackCamera(event.target.value);
  };
  const handleBackCameraVideoChange = (event) => {
    setBackCameraVideo(event.target.value);
    validateBackCameraVideo(event.target.value);
  };
  const handleBackCameraFeaturesChange = (event) => {
    setBackCameraFeatures(event.target.value);
    validateBackCameraFeatures(event.target.value);
  };
  const handleBackCameraResolutionChange = (event) => {
    setBackCamResolution(event.target.value);
    validateBackCameraResolution(event.target.value);
  };
  const handleFrontCameraChange = (event) => {
    setFrontCamera(event.target.value);
    validateFrontCamera(event.target.value);
  };
  const handleFrontCameraVideoChange = (event) => {
    setFrontCameraVideo(event.target.value);
    validateFrontCameraVideo(event.target.value);
  };
  const handleFrontCameraResolutionChange = (event) => {
    setFrontCamResolution(event.target.value);
    validateFrontCameraResolution(event.target.value);
  };
  const handleChipsetChange = (event) => {
    setChipset(event.target.value);
    validateChipset(event.target.value);
  };
  const handleCpuNameChange = (event) => {
    setCpuName(event.target.value);
    validateCpuName(event.target.value);
  };
  const handleCoresNumberChange = (event) => {
    setCoresNumber(event.target.value);
    validateCoresNumber(event.target.value);
  };
  const handleCpuChange = (event) => {
    setCpu(event.target.value);
    validateCpu(event.target.value);
  };
  const handleGpuChange = (event) => {
    setGpu(event.target.value);
    validateGpu(event.target.value);
  };
  const handleBatteryChange = (event) => {
    setBattery(event.target.value);
    validateBattery(event.target.value);
  };
  const handleChargerTechChange = (event) => {
    setChargerTech(event.target.value);
    validateChargerTech(event.target.value);
  };
  const handleChargerConnectorChange = (event) => {
    setChargerConnector(event.target.value);
    validateChargerConnector(event.target.value);
  };
  const handleSimCardChange = (event) => {
    setSimCard(event.target.value);
    validateSimCard(event.target.value);
  };
  const handleOsChange = (event) => {
    setOs(event.target.value);
    validateOs(event.target.value);
  };
  const handleJack_3_5mmChange = (event) => {
    setJack_3_5mm(event.target.value);
    validateJack_3_5mm(event.target.value);
  };
  const handleNfcChange = (event) => {
    setNfc(event.target.value);
    validateNfc(event.target.value);
  };
  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
    validateNetwork(event.target.value);
  };
  const handleBluetoothChange = (event) => {
    setBluetooth(event.target.value);
    validateBluetooth(event.target.value);
  };
  const handleWifiChange = (event) => {
    setWifi(event.target.value);
    validateWifi(event.target.value);
  };
  const handleGpsChange = (event) => {
    const {
      target: { value },
    } = event;
    setGps(value);
    validateGps(event.target.value);
  };
  const handlePhoneWidthChange = (event) => {
    setPhoneWidth(event.target.value);
    validatePhoneWidth(event.target.value);
  };
  const handlePhoneHeightChange = (event) => {
    setPhoneHeight(event.target.value);
    validatePhoneHeight(event.target.value);
  };
  const handlePhoneDepthChange = (event) => {
    setPhoneDepth(event.target.value);
    validatePhoneDepth(event.target.value);
  };
  const handleWeightChange = (event) => {
    setWeight(event.target.value);
    validateWeight(event.target.value);
  };
  const handleBackMaterialChange = (event) => {
    setBackMaterial(event.target.value);
    validateBackMaterial(event.target.value);
  };
  const handleFrameMaterialChange = (event) => {
    setFrameMaterial(event.target.value);
    validateFrameMaterial(event.target.value);
  };
  // Others
  const handleCompatibilityChange = (event) => {
    setCompatibility(event.target.value);
    validateCompatibility(event.target.value);
  };
  const handleWaterAndDustProofChange = (event) => {
    setWaterAndDustProof(event.target.value);
    validateWaterAndDustProof(event.target.value);
  };
  const handleAdditionalFeaturesChange = (event) => {
    setAdditionalFeatures(event.target.value);
    validateAdditionalFeatures(event.target.value);
  };
  const handleOtherUtilitiesChange = (event) => {
    setOtherUtilities(event.target.value);
    validateOtherUtilities(event.target.value);
  };
  const handleSoundTechChange = (event) => {
    setSoundTech(event.target.value);
    validateSoundTech(event.target.value);
  };
  // Utility features
  const handleFingerPrintTechChange = (event) => {
    setFingerPrintTech(event.target.value);
    validateFingerPrintTech(event.target.value);
  };
  const handleSensorsChange = (event) => {
    setSensors(event.target.value);
    validateSensors(event.target.value);
  };
  const handleSpecialFeaturesChange = (event) => {
    setSpecialFeatures(event.target.value);
    validateSpecialFeatures(event.target.value);
  };
  // Common
  const handleUsagesChange = (event) => {
    setUsages(event.target.value);
    validateUsages(event.target.value);
  };
  const handlePublishedAtChange = (event) => {
    setPublishedAt(event.target.value);
    validatePublishedAt(event.target.value);
  };

  // Button handlers
  const handleNewVariant = () => {
    setVariantCount((prevCount) => {
      const newCount = prevCount + 1;
      setNewVariantIndex((prevIndex) => {
        setVariantsIndices((prevIndices) => [...prevIndices, prevIndex]);
        return prevIndex + 1;
      });
      return newCount;
    });
    setVariantMemory([...variantMemory, 0]);
    setVariantMemoryDataUnit([...variantMemoryDataUnit, "GB"]);
    setVariantStorage([...variantStorage, 0]);
    setVariantStorageDataUnit([...variantStorageDataUnit, "GB"]);
    setVariantPrice([...variantPrice, 0]);
  };

  const handleDeleteVariant = (index) => {
    if (variantCount === 1) {
      return;
    }
    setVariantCount((prevCount) => {
      const newCount = prevCount - 1;
      setVariantsIndices((prevIndices) => {
        const newIndices = [...prevIndices];
        newIndices.splice(index, 1);
        return newIndices;
      });
      return newCount;
    });
    setVariantName((prevNames) => {
      const newNames = [...prevNames];
      newNames.splice(index, 1);
      return newNames;
    });
    setVariantMemory((prevMemory) => {
      const newMemory = [...prevMemory];
      newMemory.splice(index, 1);
      return newMemory;
    });
    setVariantMemoryDataUnit((prevUnit) => {
      const newUnit = [...prevUnit];
      newUnit.splice(index, 1);
      return newUnit;
    });
    setVariantStorage((prevStorage) => {
      const newStorage = [...prevStorage];
      newStorage.splice(index, 1);
      return newStorage;
    });
    setVariantStorageDataUnit((prevUnit) => {
      const newUnit = [...prevUnit];
      newUnit.splice(index, 1);
      return newUnit;
    });
    setVariantPrice((prevPrice) => {
      const newPrice = [...prevPrice];
      newPrice.splice(index, 1);
      return newPrice;
    });
  };

  const handleVariantNameChange = (event, index) => {
    const { value } = event.target;
    setVariantName((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleVariantMemoryChange = (event, index) => {
    const { value } = event.target;
    setVariantMemory((prevMemory) => {
      const newMemory = [...prevMemory];
      newMemory[index] = value;
      return newMemory;
    });
  };

  const handleVariantStorageChange = (event, index) => {
    const { value } = event.target;
    setVariantStorage((prevStorage) => {
      const newStorage = [...prevStorage];
      newStorage[index] = value;
      return newStorage;
    });
  };

  const handleVariantPriceChange = (event, index) => {
    const { value } = event.target;
    setVariantPrice((prevPrice) => {
      const newPrice = [...prevPrice];
      newPrice[index] = value;
      return newPrice;
    });
  };

  const handleVariantMemoryUnitChange = (event, index) => {
    const { value } = event.target;
    setVariantMemoryDataUnit((prevUnit) => {
      const newUnit = [...prevUnit];
      newUnit[index] = value;
      return newUnit;
    });
  };

  const handleVariantStorageUnitChange = (event, index) => {
    const { value } = event.target;
    setVariantStorageDataUnit((prevUnit) => {
      const newUnit = [...prevUnit];
      newUnit[index] = value;
      return newUnit;
    });
  };

  // +=======================+
  // | fetching manufacturers|
  // +=======================+
  const [isFetchingManufacturers, setIsFetchingManufacturers] = useState(true);
  useEffect(() => {
    const unsubscribe = onSnapshot(PRODUCER_COLLECTION, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setProducerList(data);
      setIsFetchingManufacturers(false);
    });

    return unsubscribe;
  }, []);

  // +=========================================+
  // | fetching product if this is an edit form|
  // +=========================================+

  useEffect(() => {
    if (productId) {
      getProductById(
        productId,
        (product) => {
          setProduct(product);
        },
        (error) => {
          showSnackbar(error.message, "error");
        }
      );
    }
  }, []);

  // +===================================+
  // | update product field if is editing|
  // +===================================+
  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProducer(product.manufacturer);
      setOverview(product.overview);
      setScreenSize(product.screenSize);
      setRefreshRate(product.refreshRate);
      setScreenWidth(product.screenWidth);
      setScreenHeight(product.screenHeight);
      setScreenTech(product.screenTech);
      setScreenFeatures(product.screenFeatures);
      setScreenOutlook(product.screenOutlook);
      setBackCamera(product.backCamera);
      setBackCamResolution(product.backCameraResolution);
      setBackCameraVideo(product.backCameraVideo);
      setBackCameraFeatures(product.backCameraFeatures);
      setFrontCamera(product.frontCamera);
      setFrontCamResolution(product.frontCameraResolution);
      setFrontCameraVideo(product.frontCameraVideo);
      setChipset(product.chipset);
      setCpuName(product.cpuName);
      setCoresNumber(product.coresNumber);
      setCpu(product.cpu);
      setGpu(product.gpu);
      setBattery(product.battery);
      setChargerTech(product.chargerTech);
      setChargerConnector(product.chargerConnector);
      setSimCard(product.simCard);
      setOs(product.os);
      setJack_3_5mm(product.jack_3_5mm);
      setNfc(product.nfc);
      setNetwork(product.network);
      setBluetooth(product.bluetooth);
      setWifi(product.wifi);
      setGps(product.gps);
      setPhoneWidth(product.phoneWidth);
      setPhoneHeight(product.phoneHeight);
      setPhoneDepth(product.phoneDepth);
      setWeight(product.weight);
      setBackMaterial(product.backMaterial);
      setFrameMaterial(product.frameMaterial);
      setCompatibility(product.compatibility);
      setWaterAndDustProof(product.waterAndDustProof);
      setAdditionalFeatures(product.additionalFeatures);
      setOtherUtilities(product.otherUtilities);
      setSoundTech(product.soundTech);
      setFingerPrintTech(product.fingerPrintTech);
      setSensors(product.sensors);
      setSpecialFeatures(product.specialFeatures);
      setUsages(product.usages);
      setPublishedAt(toSimpleDateString(product.publishedAt));
      setVariantCount(product.variantCount);
      setVariantsIndices(Array.from({ length: product.variantCount }, (_, i) => i));
      setVariantName(product.variantName);
      setVariantMemory(product.variantMemory);
      setVariantMemoryDataUnit(product.variantMemoryDataUnit);
      setVariantStorage(product.variantStorage);
      setVariantStorageDataUnit(product.variantStorageDataUnit);
      setVariantPrice(product.variantPrice);

    }
  }, [product]);

  if (isFetchingManufacturers) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (product === null && productId) {
    return <LoadingMessage />;
  }

  // Form Actions
  const validateAll = () => {
    let result = true;
    if (!validateProductName(productName)) result = false;
    if (!validateManufacturer(producer)) result = false;
    if (!validateOverview(overview)) result = false;
    if (!validateScreenSize(screenSize)) result = false;
    if (!validateRefreshRate(refreshRate)) result = false;
    if (!validateScreenWidth(screenWidth)) result = false;
    if (!validateScreenHeight(screenHeight)) result = false;
    if (!validateScreenTech(screenTech)) result = false;
    if (!validateScreenFeatures(screenFeatures)) result = false;
    if (!validateScreenOutlook(screenOutlook)) result = false;
    if (!validateBackCamera(backCamera)) result = false;
    if (!validateBackCameraResolution(backCamResolution)) result = false;
    if (!validateBackCameraVideo(backCameraVideo)) result = false;
    if (!validateBackCameraFeatures(backCameraFeatures)) result = false;
    if (!validateFrontCamera(frontCamera)) result = false;
    if (!validateFrontCameraResolution(frontCamResolution)) result = false;
    if (!validateFrontCameraVideo(frontCameraVideo)) result = false;
    if (!validateChipset(chipset)) result = false;
    if (!validateCpu(cpu)) result = false;
    if (!validateGpu(gpu)) result = false;
    if (!validateBattery(battery)) result = false;
    if (!validateChargerTech(chargerTech)) result = false;
    if (!validateChargerConnector(chargerConnector)) result = false;
    if (!validateSimCard(simCard)) result = false;
    if (!validateOs(os)) result = false;
    if (!validateJack_3_5mm(jack_3_5mm)) result = false;
    if (!validateNfc(nfc)) result = false;
    if (!validateNetwork(network)) result = false;
    if (!validateBluetooth(bluetooth)) result = false;
    if (!validateWifi(wifi)) result = false;
    if (!validateGps(gps)) result = false;
    if (!validatePhoneWidth(phoneWidth)) result = false;
    if (!validatePhoneHeight(phoneHeight)) result = false;
    if (!validatePhoneDepth(phoneDepth)) result = false;
    if (!validateWeight(weight)) result = false;
    if (!validateBackMaterial(backMaterial)) result = false;
    if (!validateFrameMaterial(frameMaterial)) result = false;
    if (!validateCompatibility(compatibility)) result = false;
    if (!validateWaterAndDustProof(waterAndDustProof)) result = false;
    if (!validateAdditionalFeatures(additionalFeatures)) result = false;
    if (!validateOtherUtilities(otherUtilities)) result = false;
    if (!validateSoundTech(soundTech)) result = false;
    if (!validateFingerPrintTech(fingerPrintTech)) result = false;
    if (!validateSensors(sensors)) result = false;
    if (!validateSpecialFeatures(specialFeatures)) result = false;
    if (!validateUsages(usages)) result = false;
    if (!validatePublishedAt(publishedAt)) result = false;
    if(!validateCpuName(cpuName)) result = false;
    if(!validateCoresNumber(coresNumber)) result = false;
    return result;
  };

  const validateForm = () => {
    return (
      validateProductName(productName) &&
      validateManufacturer(producer) &&
      validateOverview(overview) &&
      validateScreenSize(screenSize) &&
      validateRefreshRate(refreshRate) &&
      validateScreenWidth(screenWidth) &&
      validateScreenHeight(screenHeight) &&
      validateScreenTech(screenTech) &&
      validateScreenFeatures(screenFeatures) &&
      validateScreenOutlook(screenOutlook) &&
      validateBackCamera(backCamera) &&
      validateBackCameraResolution(backCamResolution) &&
      validateBackCameraVideo(backCameraVideo) &&
      validateBackCameraFeatures(backCameraFeatures) &&
      validateFrontCamera(frontCamera) &&
      validateFrontCameraResolution(frontCamResolution) &&
      validateFrontCameraVideo(frontCameraVideo) &&
      validateChipset(chipset) &&
      validateCpuName(cpuName) &&
      validateCoresNumber(coresNumber) &&
      validateCpu(cpu) &&
      validateGpu(gpu) &&
      validateBattery(battery) &&
      validateChargerTech(chargerTech) &&
      validateChargerConnector(chargerConnector) &&
      validateSimCard(simCard) &&
      validateOs(os) &&
      validateJack_3_5mm(jack_3_5mm) &&
      validateNfc(nfc) &&
      validateNetwork(network) &&
      validateBluetooth(bluetooth) &&
      validateWifi(wifi) &&
      validateGps(gps) &&
      validatePhoneWidth(phoneWidth) &&
      validatePhoneHeight(phoneHeight) &&
      validatePhoneDepth(phoneDepth) &&
      validateWeight(weight) &&
      validateBackMaterial(backMaterial) &&
      validateFrameMaterial(frameMaterial) &&
      validateCompatibility(compatibility) &&
      validateWaterAndDustProof(waterAndDustProof) &&
      validateAdditionalFeatures(additionalFeatures) &&
      validateOtherUtilities(otherUtilities) &&
      validateSoundTech(soundTech) &&
      validateFingerPrintTech(fingerPrintTech) &&
      validateSensors(sensors) &&
      validateSpecialFeatures(specialFeatures) &&
      validateUsages(usages) &&
      validatePublishedAt(publishedAt)
    );
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("submitting form");

    if (!validateAll()) {
      showSnackbar("The form contains errors", "warning", true);
      return;
    }

    const targetProduct = new Product();
    targetProduct.name = productName;
    targetProduct.manufacturer = producer;
    targetProduct.overview = overview;
    targetProduct.variantCount = Number(variantCount);
    targetProduct.variantName = variantName;
    targetProduct.variantMemory = toNumArray(variantMemory);
    targetProduct.variantMemoryDataUnit = variantMemoryDataUnit;
    targetProduct.variantStorage = toNumArray(variantStorage);
    targetProduct.variantStorageDataUnit = variantStorageDataUnit;
    targetProduct.variantPrice = toNumArray(variantPrice);
    targetProduct.screenTech = screenTech;
    targetProduct.screenWidth = Number(screenWidth);
    targetProduct.screenHeight = Number(screenHeight);
    targetProduct.screenSize = Number(screenSize);
    targetProduct.refreshRate = Number(refreshRate);
    targetProduct.screenFeatures = screenFeatures;
    targetProduct.screenOutlook = screenOutlook;
    targetProduct.backCamera = backCamera;
    targetProduct.backCameraVideo = backCameraVideo;
    targetProduct.backCameraFeatures = backCameraFeatures;
    targetProduct.frontCamera = frontCamera;
    targetProduct.frontCameraVideo = frontCameraVideo;
    targetProduct.chipset = chipset;
    targetProduct.cpu = cpu;
    targetProduct.gpu = gpu;
    targetProduct.battery = Number(battery);
    targetProduct.chargerTech = chargerTech;
    targetProduct.chargerConnector = chargerConnector;
    targetProduct.simCard = simCard;
    targetProduct.os = os;
    targetProduct.jack_3_5mm = jack_3_5mm;
    targetProduct.nfc = nfc;
    targetProduct.network = network;
    targetProduct.bluetooth = bluetooth;
    targetProduct.wifi = wifi;
    targetProduct.gps = gps;
    targetProduct.phoneWidth = Number(phoneWidth);
    targetProduct.phoneHeight = Number(phoneHeight);
    targetProduct.phoneDepth = Number(phoneDepth);
    targetProduct.weight = Number(weight);
    targetProduct.backMaterial = backMaterial;
    targetProduct.frameMaterial = frameMaterial;
    targetProduct.compatibility = compatibility;
    targetProduct.waterAndDustProof = waterAndDustProof;
    targetProduct.additionalFeatures = additionalFeatures;
    targetProduct.otherUtilities = otherUtilities;
    targetProduct.soundTech = soundTech;
    targetProduct.fingerPrintTech = fingerPrintTech;
    targetProduct.sensors = sensors;
    targetProduct.specialFeatures = specialFeatures;
    targetProduct.usages = usages;
    targetProduct.publishedAt = new Date(publishedAt).getTime();
    targetProduct.frontCameraResolution = frontCamResolution;
    targetProduct.backCameraResolution = backCamResolution;
    targetProduct.cpuName = cpuName;
    targetProduct.coresNumber = Number(coresNumber);
    targetProduct.productType = PRODUCT_TYPES.PHONE;

    if (product === null) {
      console.log("adding product");

      createProduct(
        targetProduct.data(),
        (returnProduct) => {
          showSnackbar("Product added successfully", "success");
          if (autoReset) resetForm();
          setTargetProduct(returnProduct);
          setShouldOpenProductSetupModal(true);
        },
        (error) => {
          console.log("error adding product", error);
          showSnackbar("Error adding product" + error, "error", true);
        }
      );
      // console.log("Skipped adding product to firestore");
      // // for debugging purposes
      // getProductById(
      //   "sJScT4iTawW8mdJUUp2C",
      //   (resultProduct) => {
      //     console.log(resultProduct);
      //     showSnackbar("Product added successfully", "success");
      //     if(autoReset)
      //       resetForm();
      //     setTargetProduct(resultProduct);
      //     setShouldOpenProductSetupModal(true);
      //   },
      //   (error) => {
      //     console.log("error adding product", error);
      //   }
      // );
    } else {
      // update product
      console.log("updating product");
      product.name = productName;
      product.manufacturer = producer;
      product.overview = overview;
      product.variantCount = Number(variantCount);
      product.variantName = variantName;
      product.variantMemory = toNumArray(variantMemory);
      product.variantMemoryDataUnit = variantMemoryDataUnit;
      product.variantStorage = toNumArray(variantStorage);
      product.variantStorageDataUnit = variantStorageDataUnit;
      product.variantPrice = toNumArray(variantPrice);
      product.screenTech = screenTech;
      product.screenWidth = Number(screenWidth);
      product.screenHeight = Number(screenHeight);
      product.screenSize = Number(screenSize);
      product.refreshRate = Number(refreshRate);
      product.screenFeatures = screenFeatures;
      product.screenOutlook = screenOutlook;
      product.backCamera = backCamera;
      product.backCameraVideo = backCameraVideo;
      product.backCameraFeatures = backCameraFeatures;
      product.frontCamera = frontCamera;
      product.frontCameraVideo = frontCameraVideo;
      product.chipset = chipset;
      product.cpu = cpu;
      product.gpu = gpu;
      product.battery = Number(battery);
      product.chargerTech = chargerTech;
      product.chargerConnector = chargerConnector;
      product.simCard = simCard;
      product.os = os;
      product.jack_3_5mm = jack_3_5mm;
      product.nfc = nfc;
      product.network = network;
      product.bluetooth = bluetooth;
      product.wifi = wifi;
      product.gps = gps;
      product.phoneWidth = Number(phoneWidth);
      product.phoneHeight = Number(phoneHeight);
      product.phoneDepth = Number(phoneDepth);
      product.weight = Number(weight);
      product.backMaterial = backMaterial;
      product.frameMaterial = frameMaterial;
      product.compatibility = compatibility;
      product.waterAndDustProof = waterAndDustProof;
      product.additionalFeatures = additionalFeatures;
      product.otherUtilities = otherUtilities;
      product.soundTech = soundTech;
      product.fingerPrintTech = fingerPrintTech;
      product.sensors = sensors;
      product.specialFeatures = specialFeatures;
      product.usages = usages;
      product.publishedAt = new Date(publishedAt).getTime();
      product.frontCameraResolution = frontCamResolution;
      product.backCameraResolution = backCamResolution;
      product.cpuName = cpuName;
      product.coresNumber = Number(coresNumber);

      updateProduct(
        product,
        product.id,
        () => {
          showSnackbar("Product updated successfully", "success");
        },
        (error) => {
          console.log("error updating product", error);
          showSnackbar("Error updating product" + error, "error", true);
        }
      );
    }
  };

  const resetForm = () => {
    setProductName("");
    setProducer("");
    setOverview("");
    setVariantsIndices([0]);
    setVariantCount(1);
    setNewVariantIndex(1);
    setVariantName([""]);
    setVariantMemory([0]);
    setVariantStorage([0]);
    setVariantPrice([0]);
    setVariantMemoryDataUnit(["GB"]);
    setVariantStorageDataUnit(["GB"]);
    setScreenTech("");
    setScreenWidth(0);
    setScreenHeight(0);
    setScreenSize(0);
    setRefreshRate(0);
    setScreenFeatures("");
    setScreenOutlook("");
    setBackCamera("");
    setBackCamResolution("");
    setBackCameraVideo("");
    setBackCameraFeatures("");
    setFrontCamera("");
    setFrontCamResolution("");
    setFrontCameraVideo("");
    setChipset("");
    setCpuName("");
    setCoresNumber(0);
    setCpu("");
    setGpu("");
    setBattery("");
    setChargerTech("");
    setChargerConnector("");
    setSimCard("");
    setOs("");
    setJack_3_5mm("");
    setNfc("");
    setNetwork("");
    setBluetooth("");
    setWifi("");
    setGps([]);
    setPhoneWidth(0);
    setPhoneHeight(0);
    setPhoneDepth(0);
    setWeight(0);
    setBackMaterial("");
    setFrameMaterial("");
    setCompatibility("");
    setWaterAndDustProof("");
    setAdditionalFeatures("");
    setOtherUtilities("");
    setSoundTech("");
    setFingerPrintTech("");
    setSensors([]);
    setSpecialFeatures("");
    setUsages([]);
    setPublishedAt("");

    // reset all validation states
    setProductNameValidation("");
    setManufacturerValidation("");
    setOverviewValidation("");
    setScreenSizeValidation("");
    setRefreshRateValidation("");
    setScreenWidthValidation("");
    setScreenHeightValidation("");
    setScreenTechValidation("");
    setScreenFeaturesValidation("");
    setScreenOutlookValidation("");
    setBackCameraValidation("");
    setBackCameraResolutionValidation("");
    setBackCameraVideoValidation("");
    setBackCameraFeaturesValidation("");
    setFrontCameraValidation("");
    setFrontCameraResolutionValidation("");
    setFrontCameraVideoValidation("");
    setChipsetValidation("");
    setCpuNameValidation("");
    setCoresNumberValidation("");
    setCpuValidation("");
    setGpuValidation("");
    setBatteryValidation("");
    setChargerTechValidation("");
    setChargerConnectorValidation("");
    setSimCardValidation("");
    setOsValidation("");
    setJack_3_5mmValidation("");
    setNfcValidation("");
    setNetworkValidation("");
    setBluetoothValidation("");
    setWifiValidation("");
    setGpsValidation("");
    setPhoneWidthValidation("");
    setPhoneHeightValidation("");
    setPhoneDepthValidation("");
    setWeightValidation("");
    setBackMaterialValidation("");
    setFrameMaterialValidation("");
    setCompatibilityValidation("");
    setWaterAndDustProofValidation("");
    setAdditionalFeaturesValidation("");
    setOtherUtilitiesValidation("");
    setSoundTechValidation("");
    setfingerPrintTechValidation("");
    setSensorsValidation("");
    setSpecialFeaturesValidation("");
    setUsagesValidation("");
    setPublishedAtValidation("");
  };

  return (
    <>
      <Typography variant="subtitle1">
        {product ? "Editing" : "Adding"}
      </Typography>
      {/* form body */}
      <Box sx={{ width: "100%" }}>
        <FormGrid container spacing={2}>
          {/* Rudimentary information */}
          <FormGrid item xs={12} md={6}>
            <FormLabel>Name</FormLabel>
            <TextField
              required
              id="name"
              name="name"
              label="Product Name"
              fullWidth
              autoComplete="Product Name"
              value={productName}
              onChange={(e) => handleProductNameChange(e)}
              error={hasError(productNameValidation)}
              helperText={
                hasError(productNameValidation) ? productNameValidation : null
              }
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel id="manufacturer-label">Manufacturer</FormLabel>
            <Select
              labelId="manufacturer-label"
              id="manufacturer"
              value={producer}
              onChange={handleSelectManufacturerChange}
              fullWidth
              required
              name="manufacturer"
              error={hasError(manufacturerValidation)}
              autoComplete="Manufacturer"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {producerList.map((m, index) => (
                <MenuItem value={m.name} key={m.id + index}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {isValidHtml(m.logoSvg) ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: normalizeSvg(m.logoSvg),
                        }}
                      />
                    ) : null}

                    {m.name}
                  </Grid>
                </MenuItem>
              ))}
            </Select>
            {/* because Select doesn't supppoert helperText we have to work around it */}
            <FormHelperText error={hasError(manufacturerValidation)}>
              {hasError(manufacturerValidation) ? manufacturerValidation : null}
            </FormHelperText>
          </FormGrid>
          <FormGrid item xs={12} md={12}>
            <FormLabel>Overview</FormLabel>
            <TextField
              id="overview"
              name="Product overview"
              label="Overview"
              fullWidth
              autoComplete="Overview"
              value={overview}
              multiline
              rows={4}
              onChange={(e) => handleOverviewChange(e)}
              error={hasError(overviewValidation)}
              helperText={
                hasError(overviewValidation) ? overviewValidation : null
              }
            />
          </FormGrid>
          {/* Variants */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="memory-storage-header"
                id="memory-storage-header"
              >
                <Typography variant="caption">Variants</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {variantsIndices.map((index) => (
                    <Grid
                      item
                      md={2}
                      xs={2}
                      key={index}
                      sx={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "100%",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormGrid container spacing={2}>
                        <FormGrid item xs={11} md={11} container>
                          <FormGrid item xs={12} md={12} container spacing={2}>
                            <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Name</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={10} md={10}>
                                <TextField
                                  required
                                  id={"variant-name" + index}
                                  name={"variant-name" + index}
                                  label="Variant name"
                                  fullWidth
                                  autoComplete="Variant name"
                                  onChange={(e) =>
                                    handleVariantNameChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantName[
                                      variantsIndices.indexOf(index)
                                    ] || ""
                                  }
                                />
                              </FormGrid>
                            </FormGrid>
                            <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Memory</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={2} md={2}>
                                <TextField
                                  required
                                  id={"memory" + index}
                                  name={"memory" + index}
                                  fullWidth
                                  autoComplete="Memory"
                                  type="number"
                                  onChange={(e) =>
                                    handleVariantMemoryChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantMemory[
                                      variantsIndices.indexOf(index)
                                    ] || 0
                                  }
                                  label={
                                    variantMemory[
                                      variantsIndices.indexOf(index)
                                    ] +
                                    " " +
                                    variantMemoryDataUnit[
                                      variantsIndices.indexOf(index)
                                    ]
                                  }
                                />
                              </FormGrid>
                              <FormGrid item xs={2} md={2}>
                                <Select
                                  id={"memory-data-unit" + index}
                                  value={
                                    variantMemoryDataUnit[
                                      variantsIndices.indexOf(index)
                                    ]
                                  }
                                  onChange={(e) =>
                                    handleVariantMemoryUnitChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  required
                                  name={"memory-data-unit" + index}
                                  fullWidth
                                >
                                  {DATA_UNITS.map((unit, index) => (
                                    <MenuItem value={unit} key={unit + index}>
                                      {unit}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormGrid>
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Storage</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={2} md={2}>
                                <TextField
                                  required
                                  id={"storage" + index}
                                  name={"storage" + index}
                                  fullWidth
                                  autoComplete="Storage"
                                  type="number"
                                  onChange={(e) =>
                                    handleVariantStorageChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantStorage[
                                      variantsIndices.indexOf(index)
                                    ]
                                  }
                                  label={
                                    variantStorage[
                                      variantsIndices.indexOf(index)
                                    ] +
                                    " " +
                                    variantStorageDataUnit[
                                      variantsIndices.indexOf(index)
                                    ]
                                  }
                                />
                              </FormGrid>
                              <FormGrid item xs={2} md={2}>
                                <Select
                                  id={"storage-data-unit" + index}
                                  value={
                                    variantStorageDataUnit[
                                      variantsIndices.indexOf(index)
                                    ]
                                  }
                                  onChange={(e) =>
                                    handleVariantStorageUnitChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  required
                                  name={"storage-data-unit" + index}
                                  fullWidth
                                >
                                  {DATA_UNITS.map((unit, index) => (
                                    <MenuItem value={unit} key={unit + index}>
                                      {unit}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormGrid>
                            </FormGrid>
                            {/* Color */}
                            {/* <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Color</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={10} md={10}>
                                <TextField
                                  required
                                  id={"color" + index}
                                  name="color"
                                  label="Color"
                                  fullWidth
                                  autoComplete="Color"
                                  onChange={(e) =>
                                    handleVariantColorChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantColor[
                                      variantsIndices.indexOf(index)
                                    ] || ""
                                  }
                                />
                              </FormGrid>
                            </FormGrid> */}
                            <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Price</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={10} md={10}>
                                <TextField
                                  required
                                  id={"price" + index}
                                  name={"price" + index}
                                  label={priceFormatter.format(
                                    variantPrice[
                                      variantsIndices.indexOf(index)
                                    ] || 0
                                  )}
                                  fullWidth
                                  autoComplete="Price"
                                  type="number"
                                  onChange={(e) =>
                                    handleVariantPriceChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantPrice[
                                      variantsIndices.indexOf(index)
                                    ] || 0
                                  }
                                />
                              </FormGrid>
                            </FormGrid>
                          </FormGrid>
                        </FormGrid>
                        <FormGrid
                          item
                          xs={1}
                          md={1}
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {/* Delete button with icon */}
                          {!productId && variantCount > 1 && (
                            <IconButton
                              onClick={() =>
                                handleDeleteVariant(
                                  variantsIndices.indexOf(index)
                                )
                              }
                            >
                              <DeleteOutline color="primary" />
                            </IconButton>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
              <AccordionActions>
              <Button onClick={() => handleNewVariant()}>
                    New variant
                  </Button>
              </AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Screen */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="screen-specifications-header"
                id="screen-specifications-header"
              >
                <Typography variant="caption">Screen specifications</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    {/* Screen size */}
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Screen size</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            required
                            id="screen-size"
                            name="screen-size"
                            label="inches"
                            autoComplete="Screen size"
                            type="number"
                            fullWidth
                            onChange={(e) => handleScreenSizeChange(e)}
                            value={screenSize}
                            error={hasError(screenSizeValidation)}
                            helperText={
                              hasError(screenSizeValidation)
                                ? screenSizeValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    {/* Refresh rate */}
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Refresh rate</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            required
                            id="refresh-rate"
                            name="refresh-rate"
                            label="Hz"
                            fullWidth
                            autoComplete="Refresh rate"
                            type="number"
                            onChange={(e) => handleRefreshRateChange(e)}
                            value={refreshRate}
                            error={hasError(refreshRateValidation)}
                            helperText={
                              hasError(refreshRateValidation)
                                ? refreshRateValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={12} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>Resolution</FormLabel>
                      </FormGrid>

                      <FormGrid item xs={4} md={4}>
                        <TextField
                          required
                          id="resolution-width"
                          name="resolution"
                          label="width"
                          fullWidth
                          autoComplete="Screen size"
                          onChange={(e) => handleScreenWidthChange(e)}
                          type="number"
                          value={screenWidth}
                          error={hasError(screenWidthValidation)}
                          helperText={
                            hasError(screenWidthValidation)
                              ? screenWidthValidation
                              : null
                          }
                        />
                      </FormGrid>
                      <FormGrid item xs={4} md={4}>
                        <TextField
                          required
                          id="resolution-height"
                          name="resolution"
                          label="height"
                          fullWidth
                          autoComplete="Screen size"
                          type="number"
                          onChange={(e) => handleScreenHeightChange(e)}
                          value={screenHeight}
                          error={hasError(screenHeightValidation)}
                          helperText={
                            hasError(screenHeightValidation)
                              ? screenHeightValidation
                              : null
                          }
                        />
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={12} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>Screen technology</FormLabel>
                      </FormGrid>
                      <FormGrid item xs={8} md={8}>
                        <TextField
                          required
                          id="screen-tech"
                          name="screen-tech"
                          label=""
                          fullWidth
                          autoComplete="Screen Technology"
                          onChange={(e) => handleSelectScreenTechChange(e)}
                          value={screenTech}
                          error={hasError(screenTechValidation)}
                          helperText={
                            hasError(screenTechValidation)
                              ? screenTechValidation
                              : null
                          }
                        />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  {/* Screen features */}
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Screen features</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="screen-features"
                        name="screen-features"
                        label=""
                        fullWidth
                        autoComplete="Screen Features"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={screenFeatures}
                        onChange={(event) => {
                          handleScreenFeaturesChange(event);
                        }}
                        error={hasError(screenFeaturesValidation)}
                        helperText={
                          hasError(screenFeaturesValidation)
                            ? screenFeaturesValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  {/* Screen outlook */}
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Screen outlook</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="screen-outlook"
                        name="screen-outlook"
                        label=""
                        fullWidth
                        autoComplete="Screen Outlook"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={screenOutlook}
                        onChange={(event) => {
                          handleSelectScreenOutlookChange(event);
                        }}
                        error={hasError(screenOutlookValidation)}
                        helperText={
                          hasError(screenOutlookValidation)
                            ? screenOutlookValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Back Camera */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="back-camera-header"
                id="back-camera-header"
              >
                <Typography variant="caption">Back camera</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Back Camera</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="back-camera"
                        name="back-camera"
                        label=""
                        fullWidth
                        autoComplete="Back Camera"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={backCamera}
                        onChange={(event) => {
                          handleBackCameraChange(event);
                        }}
                        error={hasError(backCameraValidation)}
                        helperText={
                          hasError(backCameraValidation)
                            ? backCameraValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Back Cam Resolution</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="back-camera-resolution"
                        name="back-camera-resolution"
                        label=""
                        fullWidth
                        autoComplete="Back Camera Resolution"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={backCamResolution}
                        placeholder="48 - 12 - 12 MP"
                        onChange={(event) => {
                          handleBackCameraResolutionChange(event);
                        }}
                        error={hasError(backCameraResolutionValidation)}
                        helperText={
                          hasError(backCameraResolutionValidation)
                            ? backCameraResolutionValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Video</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="back-camera-video"
                        name="back-camera-video"
                        label=""
                        fullWidth
                        autoComplete="Back Camera Video"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={backCameraVideo}
                        onChange={(event) => {
                          handleBackCameraVideoChange(event);
                        }}
                        error={hasError(backCameraVideoValidation)}
                        helperText={
                          hasError(backCameraVideoValidation)
                            ? backCameraVideoValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Features</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="back-camera-features"
                        name="back-camera-features"
                        label=""
                        fullWidth
                        autoComplete="Back Camera Features"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={backCameraFeatures}
                        onChange={(event) => {
                          handleBackCameraFeaturesChange(event);
                        }}
                        error={hasError(backCameraFeaturesValidation)}
                        helperText={
                          hasError(backCameraFeaturesValidation)
                            ? backCameraFeaturesValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Front Camera */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="font-camera-header"
                id="font-camera-header"
              >
                <Typography variant="caption">Front camera</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Front Cam Resolution</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="front-camera-resolution"
                        name="front-camera-resolution"
                        label=""
                        fullWidth
                        autoComplete="Front Camera Resolution"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={frontCamResolution}
                        onChange={(event) => {
                          handleFrontCameraResolutionChange(event);
                        }}
                        error={hasError(frontCameraResolutionValidation)}
                        helperText={
                          hasError(frontCameraResolutionValidation)
                            ? frontCameraResolutionValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Front Camera</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="front-camera"
                        name="front-camera"
                        label=""
                        fullWidth
                        autoComplete="Front Camera"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={frontCamera}
                        onChange={(event) => {
                          handleFrontCameraChange(event);
                        }}
                        error={hasError(frontCameraValidation)}
                        helperText={
                          hasError(frontCameraValidation)
                            ? frontCameraValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Video</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="front-camera-video"
                        name="front-camera-video"
                        label=""
                        fullWidth
                        autoComplete="Front Camera Video"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={frontCameraVideo}
                        onChange={(event) => {
                          handleFrontCameraVideoChange(event);
                        }}
                        error={hasError(frontCameraVideoValidation)}
                        helperText={
                          hasError(frontCameraVideoValidation)
                            ? frontCameraVideoValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Chipset and Graphic */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="chipset-graphic-header"
                id="chipset-graphic-header"
              >
                <Typography variant="caption">Chipset and Graphic</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>Cpu name</FormLabel>
                      </FormGrid>
                      <FormGrid item xs={8} md={8}>
                        <TextField
                          id="cpuName"
                          name="cpuName"
                          label=""
                          fullWidth
                          autoComplete="cpuName"
                          multiline
                          rows={4}
                          value={cpuName}
                          placeholder="Apple A14 Bionic"
                          onChange={(event) => {
                            handleCpuNameChange(event);
                          }}
                          error={hasError(cpuNameValidation)}
                          helperText={
                            hasError(cpuNameValidation)
                              ? cpuNameValidation
                              : null
                          }
                        />{" "}
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>Cores number</FormLabel>
                      </FormGrid>
                      <FormGrid item xs={8} md={8}>
                        <TextField
                          id="coresNumber"
                          name="coresNumber"
                          label=""
                          fullWidth
                          autoComplete="coresNumber"
                          multiline
                          rows={4}
                          value={coresNumber}
                          type="number"
                          onChange={(event) => {
                            handleCoresNumberChange(event);
                          }}
                          error={hasError(coresNumberValidation)}
                          helperText={
                            hasError(coresNumberValidation)
                              ? coresNumberValidation
                              : null
                          }
                        />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>Chipset</FormLabel>
                      </FormGrid>
                      <FormGrid item xs={8} md={8}>
                        <TextField
                          id="chipset"
                          name="chipset"
                          label=""
                          fullWidth
                          autoComplete="Chipset"
                          multiline
                          rows={4}
                          value={chipset}
                          onChange={(event) => {
                            handleChipsetChange(event);
                          }}
                          error={hasError(chipsetValidation)}
                          helperText={
                            hasError(chipsetValidation)
                              ? chipsetValidation
                              : null
                          }
                        />{" "}
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6} container spacing={2}>
                      <FormGrid item xs={4} md={4}>
                        <FormLabel>CPU</FormLabel>
                      </FormGrid>
                      <FormGrid item xs={8} md={8}>
                        <TextField
                          id="cpu"
                          name="cpu"
                          label=""
                          fullWidth
                          autoComplete="CPU"
                          multiline
                          rows={4}
                          value={cpu}
                          onChange={(event) => {
                            handleCpuChange(event);
                          }}
                          error={hasError(cpuValidation)}
                          helperText={
                            hasError(cpuValidation) ? cpuValidation : null
                          }
                        />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>GPU</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="gpu"
                        name="gpu"
                        label=""
                        fullWidth
                        autoComplete="GPU"
                        multiline
                        rows={4}
                        value={gpu}
                        onChange={(event) => {
                          handleGpuChange(event);
                        }}
                        error={hasError(gpuValidation)}
                        helperText={
                          hasError(gpuValidation) ? gpuValidation : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Battery */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="battery-header"
                id="battery-header"
              >
                <Typography variant="caption">Battery</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Battery</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="battery"
                        name="battery"
                        label="mAh"
                        fullWidth
                        autoComplete="Battery"
                        type="number"
                        value={battery}
                        onChange={(event) => {
                          handleBatteryChange(event);
                        }}
                        error={hasError(batteryValidation)}
                        helperText={
                          hasError(batteryValidation) ? batteryValidation : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Charger tech</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="charger-tech"
                            name="charger-tech"
                            label=""
                            fullWidth
                            autoComplete="Charger tech"
                            value={chargerTech}
                            multiline
                            rows={4}
                            onChange={(event) => {
                              handleChargerTechChange(event);
                            }}
                            error={hasError(chargerTechValidation)}
                            helperText={
                              hasError(chargerTechValidation)
                                ? chargerTechValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={2} md={2}>
                          <FormLabel>Charger connector</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={10} md={10}>
                          <Select
                            fullWidth
                            value={chargerConnector}
                            onChange={(event) => {
                              handleChargerConnectorChange(event);
                            }}
                            error={hasError(chargerConnectorValidation)}
                          >
                            <MenuItem value="">None</MenuItem>
                            {CHARGER_CONNECTORS.map((connector, index) => (
                              <MenuItem
                                value={connector}
                                key={connector + index}
                              >
                                {connector}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText
                            error={hasError(chargerConnectorValidation)}
                          >
                            {hasError(chargerConnectorValidation)
                              ? chargerConnectorValidation
                              : null}
                          </FormHelperText>
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Connectivity */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="connectivity-header"
                id="connectivity-header"
              >
                <Typography variant="caption">OS & Connectivitives</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>SIM card</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="sim-card"
                            name="sim-card"
                            label=""
                            fullWidth
                            autoComplete="SIM card"
                            multiline
                            rows={4}
                            value={simCard}
                            onChange={(event) => {
                              handleSimCardChange(event);
                            }}
                            error={hasError(simCardValidation)}
                            helperText={
                              hasError(simCardValidation)
                                ? simCardValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>OS</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="os"
                            name="os"
                            label=""
                            fullWidth
                            autoComplete="OS"
                            multiline
                            rows={4}
                            value={os}
                            onChange={(event) => {
                              handleOsChange(event);
                            }}
                            error={hasError(osValidation)}
                            helperText={
                              hasError(osValidation) ? osValidation : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Jack 3.5mm</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <Select
                            fullWidth
                            value={jack_3_5mm}
                            onChange={(event) => {
                              handleJack_3_5mmChange(event);
                            }}
                            error={hasError(jack_3_5mmValidation)}
                          >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                          <FormHelperText
                            error={hasError(jack_3_5mmValidation)}
                          >
                            {hasError(jack_3_5mmValidation)
                              ? jack_3_5mmValidation
                              : null}
                          </FormHelperText>
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>NFC</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <Select
                            fullWidth
                            value={nfc}
                            onChange={(event) => {
                              handleNfcChange(event);
                            }}
                            error={hasError(nfcValidation)}
                          >
                            <MenuItem value="">None</MenuItem>
                            {NFC.map((nfc, index) => (
                              <MenuItem value={nfc} key={nfc + index}>
                                {nfc}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText error={hasError(nfcValidation)}>
                            {hasError(nfcValidation) ? nfcValidation : null}
                          </FormHelperText>
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Network</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <Select
                            fullWidth
                            value={network}
                            onChange={(event) => {
                              handleNetworkChange(event);
                            }}
                            error={hasError(networkValidation)}
                          >
                            <MenuItem value="">None</MenuItem>
                            {NETWORKS.map((network, index) => (
                              <MenuItem value={network} key={network + index}>
                                {network}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText error={hasError(networkValidation)}>
                            {hasError(networkValidation)
                              ? networkValidation
                              : null}
                          </FormHelperText>
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Bluetooth</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="bluetooth"
                            name="bluetooth"
                            label=""
                            fullWidth
                            autoComplete="Bluetooth"
                            multiline
                            rows={4}
                            value={bluetooth}
                            onChange={(event) => {
                              handleBluetoothChange(event);
                            }}
                            error={hasError(bluetoothValidation)}
                            helperText={
                              hasError(bluetoothValidation)
                                ? bluetoothValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Wifi</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="wifi"
                            name="wifi"
                            label=""
                            fullWidth
                            autoComplete="Wifi"
                            multiline
                            rows={4}
                            value={wifi}
                            onChange={(event) => {
                              handleWifiChange(event);
                            }}
                            error={hasError(wifiValidation)}
                            helperText={
                              hasError(wifiValidation) ? wifiValidation : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>GPS</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <Select
                            fullWidth
                            value={gps}
                            multiple
                            multiline
                            rows={4}
                            id="gps"
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Chip"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            onChange={(event) => {
                              handleGpsChange(event);
                            }}
                            error={hasError(gpsValidation)}
                          >
                            {GPS.map((gps, index) => (
                              <MenuItem key={gps + index} value={gps}>
                                {gps}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText error={hasError(gpsValidation)}>
                            {hasError(gpsValidation) ? gpsValidation : null}
                          </FormHelperText>
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Design & Weight */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="design-weight-header"
                id="design-weight-header"
              >
                <Typography variant="caption">Design & Weight</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormLabel>Demension</FormLabel>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={4} md={4}>
                      <TextField
                        id="width"
                        name="width"
                        label="Width"
                        fullWidth
                        autoComplete="Width"
                        type="number"
                        value={phoneWidth}
                        onChange={(e) => handlePhoneWidthChange(e)}
                        error={hasError(phoneWidthValidation)}
                        helperText={
                          hasError(phoneWidthValidation)
                            ? phoneWidthValidation
                            : null
                        }
                      />
                    </FormGrid>
                    <FormGrid item xs={4} md={4}>
                      <TextField
                        id="height"
                        name="height"
                        label="Height"
                        fullWidth
                        autoComplete="Height"
                        type="number"
                        value={phoneHeight}
                        onChange={(e) => handlePhoneHeightChange(e)}
                        error={hasError(phoneHeightValidation)}
                        helperText={
                          hasError(phoneHeightValidation)
                            ? phoneHeightValidation
                            : null
                        }
                      />
                    </FormGrid>
                    <FormGrid item xs={4} md={4}>
                      <TextField
                        id="depth"
                        name="depth"
                        label="Depth"
                        fullWidth
                        autoComplete="Depth"
                        type="number"
                        value={phoneDepth}
                        onChange={(e) => handlePhoneDepthChange(e)}
                        error={hasError(phoneDepthValidation)}
                        helperText={
                          hasError(phoneDepthValidation)
                            ? phoneDepthValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Weight</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={2} md={10}>
                      <TextField
                        id="weight"
                        name="weight"
                        label="gam"
                        fullWidth
                        autoComplete="Weight"
                        type="number"
                        value={weight}
                        onChange={(e) => handleWeightChange(e)}
                        error={hasError(weightValidation)}
                        helperText={
                          hasError(weightValidation) ? weightValidation : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormLabel>Material</FormLabel>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Back material</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="back-material"
                            name="back-material"
                            label=""
                            fullWidth
                            autoComplete="Back material"
                            multiline
                            rows={4}
                            value={backMaterial}
                            onChange={(e) => handleBackMaterialChange(e)}
                            error={hasError(backMaterialValidation)}
                            helperText={
                              hasError(backMaterialValidation)
                                ? backMaterialValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Frame material</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="frame-material"
                            name="frame-material"
                            label=""
                            fullWidth
                            autoComplete="Frame material"
                            multiline
                            rows={4}
                            value={frameMaterial}
                            onChange={(e) => handleFrameMaterialChange(e)}
                            error={hasError(frameMaterialValidation)}
                            helperText={
                              hasError(frameMaterialValidation)
                                ? frameMaterialValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Others */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="others-header"
                id="others-header"
              >
                <Typography variant="caption">Others</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Compatibility</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="compatibility"
                            name="compatibility"
                            label=""
                            fullWidth
                            autoComplete="Compatibility"
                            multiline
                            rows={4}
                            value={compatibility}
                            onChange={(event) => {
                              handleCompatibilityChange(event);
                            }}
                            error={hasError(compatibilityValidation)}
                            helperText={
                              hasError(compatibilityValidation)
                                ? compatibilityValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Water&Dust Proof</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="waterAndDustProof"
                            name="waterAndDustProof"
                            label=""
                            fullWidth
                            autoComplete="Water&Dust Proof"
                            multiline
                            rows={4}
                            value={waterAndDustProof}
                            onChange={(event) => {
                              handleWaterAndDustProofChange(event);
                            }}
                            error={hasError(waterAndDustProofValidation)}
                            helperText={
                              hasError(waterAndDustProofValidation)
                                ? waterAndDustProofValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Additional features</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="additional-features"
                            name="additional-features"
                            label=""
                            fullWidth
                            autoComplete="Additional features"
                            multiline
                            rows={4}
                            value={additionalFeatures}
                            onChange={(event) => {
                              handleAdditionalFeaturesChange(event);
                            }}
                            error={hasError(additionalFeaturesValidation)}
                            helperText={
                              hasError(additionalFeaturesValidation)
                                ? additionalFeaturesValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={6} md={6}>
                      <FormGrid item xs={12} md={12} container spacing={2}>
                        <FormGrid item xs={4} md={4}>
                          <FormLabel>Other utilities</FormLabel>
                        </FormGrid>
                        <FormGrid item xs={8} md={8}>
                          <TextField
                            id="other-utilities"
                            name="other-utilities"
                            label=""
                            fullWidth
                            autoComplete="Other utilities"
                            multiline
                            rows={4}
                            value={otherUtilities}
                            onChange={(event) => {
                              handleOtherUtilitiesChange(event);
                            }}
                            error={hasError(otherUtilitiesValidation)}
                            helperText={
                              hasError(otherUtilitiesValidation)
                                ? otherUtilitiesValidation
                                : null
                            }
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Sound tech</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="sound-tech"
                        name="sound-tech"
                        label=""
                        fullWidth
                        autoComplete="Sound tech"
                        multiline
                        rows={4}
                        value={soundTech}
                        onChange={(event) => {
                          handleSoundTechChange(event);
                        }}
                        error={hasError(soundTechValidation)}
                        helperText={
                          hasError(soundTechValidation)
                            ? soundTechValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* Features */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="features-header"
                id="features-header"
              >
                <Typography variant="caption">Other utilities</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Fingerprint tech</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="fingerprint tech"
                        name="fingerprint tech"
                        label=""
                        fullWidth
                        autoComplete="Fingerprint tech"
                        multiline
                        rows={4}
                        value={fingerPrintTech}
                        onChange={(event) => {
                          handleFingerPrintTechChange(event);
                        }}
                        error={hasError(fingerPrintTechValidation)}
                        helperText={
                          hasError(fingerPrintTechValidation)
                            ? fingerPrintTechValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Sensors</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <Select
                        multiple
                        multiline
                        rows={4}
                        id="sensors"
                        value={sensors}
                        fullWidth
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Chip"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        onChange={(event) => {
                          handleSensorsChange(event);
                        }}
                        error={hasError(sensorsValidation)}
                      >
                        {SENSORS.map((sensor, index) => (
                          <MenuItem key={sensor + index} value={sensor}>
                            {sensor}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={hasError(sensorsValidation)}>
                        {hasError(sensorsValidation) ? sensorsValidation : null}
                      </FormHelperText>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Special features</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="features"
                        name="features"
                        label=""
                        fullWidth
                        autoComplete="Features"
                        multiline
                        rows={4}
                        value={specialFeatures}
                        onChange={(event) => {
                          handleSpecialFeaturesChange(event);
                        }}
                        error={hasError(specialFeaturesValidation)}
                        helperText={
                          hasError(specialFeaturesValidation)
                            ? specialFeaturesValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions></AccordionActions>
            </Accordion>
          </FormGrid>
          {/* General */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="general-header"
                id="general-header"
              >
                <Typography variant="caption">General</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Pushlished day</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <TextField
                        id="published day"
                        name="published day"
                        label=""
                        fullWidth
                        autoComplete="Published day"
                        type="date"
                        value={publishedAt}
                        onChange={(event) => {
                          handlePublishedAtChange(event);
                        }}
                        error={hasError(publishedAtValidation)}
                        helperText={
                          hasError(publishedAtValidation)
                            ? publishedAtValidation
                            : null
                        }
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} md={12} container spacing={2}>
                    <FormGrid item xs={2} md={2}>
                      <FormLabel>Usages</FormLabel>
                    </FormGrid>
                    <FormGrid item xs={10} md={10}>
                      <Select
                        multiple
                        multiline
                        rows={4}
                        id="usage"
                        value={usages}
                        fullWidth
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Chip"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        onChange={(event) => {
                          handleUsagesChange(event);
                        }}
                        error={hasError(usagesValidation)}
                      >
                        {USAGES.map((usage, index) => (
                          <MenuItem key={usage + index} value={usage}>
                            {usage}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={hasError(usagesValidation)}>
                        {hasError(usagesValidation) ? usagesValidation : null}
                      </FormHelperText>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </AccordionDetails>
              <AccordionActions>
                {product ? (
                  <Button onClick={(e) => submitForm(e)}>Update</Button>
                ) : (
                  [
                    <FormControlLabel
                      control={
                        <Checkbox
                          key="btn-auto-reset"
                          onChange={(e) => {
                            setAutoReset(e.target.checked);
                          }}
                          checked={autoReset}
                        />
                      }
                      label="Auto reset"
                      key="btn-auto-reset"
                    />,
                    <Button key="btn-reset" onClick={(e) => resetForm()}>
                      Reset
                    </Button>,
                    <Button key="btn-add" onClick={(e) => submitForm(e)}>
                      Add{" "}
                    </Button>,
                  ]
                )}
              </AccordionActions>
            </Accordion>
          </FormGrid>
        </FormGrid>
      </Box>

      {shouldOpenProductSetupModal && (
        <BasicModal
          childComponent={() => (
            <SetupProduct
              product={targetProduct}
              onFinished={() => setShouldOpenProductSetupModal(false)}
            />
          )}
        />
      )}
    </>
  );
}

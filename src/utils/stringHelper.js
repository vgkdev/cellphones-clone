import moment from "moment";

export const toBoolean = (str) => {
  let val = str.toLowerCase();

  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  return null;
};

export const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const getImageNameThroughUrl = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

export const getStringFromStringArray = (arr) => {
  return arr.join(", ");
};

export const toTruncatedFirstDecimal = (num) => {
  return num.toFixed(1);
};

export const toTruncatedString = (str, length) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};

export const formatDateTime = (dateTime) => {
  return moment(dateTime).format("DD-MM-YYYY HH:mm");
};

export function isValidHtml(htmlString) {
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

export const normalizeSvg = (svgContent, sz = "24") => {
  const obj = new DOMParser().parseFromString(svgContent, "image/svg+xml");
  const svg = obj.documentElement;

  // Get viewBox attribute
  // const viewBox = svg.getAttribute("viewBox");

  // Set width and height attributes
  svg.setAttribute("width", sz);
  svg.setAttribute("height", sz);

  return svg.outerHTML;
};

export const hashNameToRgba = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let c = (hash & 0x00ffffff).toString(16).toUpperCase();

  return "#" + "00000".substring(0, 6 - c.length) + c;
};

export const getMessagePosition = (msgList, index) => {
  if (msgList.length === 1) return "single";

  if (index === 0) {
    if (msgList[index].isFromStaff !== msgList[index + 1].isFromStaff) {
      return "single";
    } else {
      return "first";
    }
  } else if (index === msgList.length - 1) {
    if (msgList[index].isFromStaff !== msgList[index - 1].isFromStaff) {
      return "single";
    } else {
      return "last";
    }
  } else {
    if (
      msgList[index].isFromStaff !== msgList[index - 1].isFromStaff &&
      msgList[index].isFromStaff !== msgList[index + 1].isFromStaff
    ) {
      return "single";
    } else if (msgList[index].isFromStaff !== msgList[index - 1].isFromStaff) {
      return "first";
    } else if (msgList[index].isFromStaff !== msgList[index + 1].isFromStaff) {
      return "last";
    }
  }

  return "normal";
};

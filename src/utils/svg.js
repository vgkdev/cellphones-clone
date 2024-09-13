export const normalizeSvg = (svgContent, sz=50) => {
    const obj = new DOMParser().parseFromString(svgContent, "image/svg+xml");
    const svg = obj.documentElement;
  
    // Get viewBox attribute
    // const viewBox = svg.getAttribute("viewBox");
  
    // Set width and height attributes
    svg.setAttribute("width", sz.toString());
    svg.setAttribute("height", sz.toString());
  
    return svg.outerHTML;
  };
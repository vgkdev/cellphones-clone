export const toNumArray = (strArr) => {
    return strArr.map((str) => {
        return parseFloat(str);
    });
}
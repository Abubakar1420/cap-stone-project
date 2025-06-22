
export const getBackEndBaseUrl = () => {
    const url = process.env.REACT_APP_NODE_ENV === "development"? process.env.REACT_APP_BACKEND_BASE_URL_DEV: process.env.REACT_APP_BACKEND_BASE_URL_PROD;
    console.log(url);
    return url;
};
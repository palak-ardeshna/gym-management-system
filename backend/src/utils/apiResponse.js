export const sendSuccess = (res, dataOrOptions = null, message = "Success") => {
  let statusCode = 200;
  let data = dataOrOptions;
  let pagination = null;

  // Handle the old object-based signature
  if (
    dataOrOptions &&
    typeof dataOrOptions === "object" &&
    !Array.isArray(dataOrOptions) &&
    (dataOrOptions.statusCode || dataOrOptions.message || dataOrOptions.data || dataOrOptions.pagination)
  ) {
    statusCode = dataOrOptions.statusCode || 200;
    message = dataOrOptions.message || "Success";
    data = dataOrOptions.data !== undefined ? dataOrOptions.data : null;
    pagination = dataOrOptions.pagination || null;
  }

  const payload = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

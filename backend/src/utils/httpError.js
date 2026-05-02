import { ApiError } from "./apiError.js";

export const notFound = (resource = "Resource") => {
  return new ApiError(404, `${resource} not found`);
};

export const badRequest = (message = "Bad request") => {
  return new ApiError(400, message);
};

export const unauthorized = (message = "Unauthorized") => {
  return new ApiError(401, message);
};

export const forbidden = (message = "Forbidden") => {
  return new ApiError(403, message);
};

export const conflict = (message = "Conflict") => {
  return new ApiError(409, message);
};

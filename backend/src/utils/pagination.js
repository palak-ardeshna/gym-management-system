export const getPaginationParams = (query) => {
  const { page = 1, limit = 10, fetchAll } = query;
  const isFetchAll = fetchAll === "true" || fetchAll === true;

  return {
    page: Number(page),
    limit: Number(limit),
    isFetchAll,
    queryLimit: isFetchAll ? undefined : Number(limit),
    offset: isFetchAll ? undefined : (Number(page) - 1) * Number(limit),
  };
};

export const getPaginatedResponse = ({ rows, count, limit, page, isFetchAll }) => {
  return {
    items: rows,
    totalData: count,
    totalPages: isFetchAll ? 1 : Math.ceil(count / limit),
    currentPage: isFetchAll ? 1 : page,
    limit: isFetchAll ? count : limit,
    fetchAll: isFetchAll,
  };
};

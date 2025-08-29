export const buildQuery = (queryParams, userId) => {
  let query = { user: userId };

  if (queryParams.status) {
    query.status = queryParams.status;
  }

  if (queryParams.title) {
    query.title = { $regex: queryParams.title, $options: 'i' };
  }

  if (queryParams.startDate && queryParams.endDate) {
    query.createdAt = {
      $gte: new Date(queryParams.startDate),
      $lte: new Date(queryParams.endDate),
    };
  }

  let sort = {};
  if (queryParams.sortBy) {
    const order = queryParams.order === 'desc' ? -1 : 1;
    sort[queryParams.sortBy] = order;
  } else {
    sort = { createdAt: -1 };
  }

  return { query, sort };
};

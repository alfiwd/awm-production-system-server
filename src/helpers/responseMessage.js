module.exports = {
  response: (res, status, { ...props }) =>
    res.send({
      status,
      ...props,
    }),
};

module.exports = {
  getData: async (model, id) =>
    await model.findOne({
      where: {
        id,
      },
    }),
  getDatas: async (model) => await model.findAll(),
  createData: async (model, data) => model.create(data),
  updateData: async (model, id, data) =>
    await model.update(data, {
      where: {
        id,
      },
    }),
};

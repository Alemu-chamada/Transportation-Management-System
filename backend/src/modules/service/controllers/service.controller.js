const asyncHandler = require("../../../shared/utils/asyncHandler.js");
const { success } = require("../../../shared/utils/response.js");
const serviceService = require("../services/service.service.js");

const getNearbyServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getNearbyServices({
    latitude: req.query.latitude,
    longitude: req.query.longitude,
    radiusKm: req.query.radius_km ? Number(req.query.radius_km) : 50,
    type: req.query.type,
  });
  return success(res, { message: "Nearby services retrieved successfully", data: { services } });
});

const getAllServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServices();
  return success(res, { message: "Services retrieved successfully", data: { services } });
});

const getAllServicesAdmin = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServicesAdmin();
  return success(res, { message: "Services retrieved successfully", data: { services } });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  return success(res, { message: "Service retrieved successfully", data: { service } });
});

const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);
  return success(res, { message: "Service created successfully", data: { service } });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);
  return success(res, { message: "Service updated successfully", data: { service } });
});

const deleteService = asyncHandler(async (req, res) => {
  const result = await serviceService.deleteService(req.params.id);
  return success(res, { message: "Service deleted successfully", data: result });
});

module.exports = {
  getNearbyServices,
  getAllServices,
  getAllServicesAdmin,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

const db = require("../../../infrastructure/database/db.js");
const ApiError = require("../../../shared/utils/apiError.js");
const { mapService } = require("../repositories/service.model.js");

const getAllServices = async () => {
  const result = await db.query(
    `SELECT * FROM services WHERE is_active = TRUE ORDER BY name`
  );
  return result.rows.map(mapService);
};

const getAllServicesAdmin = async () => {
  const result = await db.query(`SELECT * FROM services ORDER BY created_at DESC`);
  return result.rows.map(mapService);
};

const getServiceById = async (id) => {
  const result = await db.query(`SELECT * FROM services WHERE id = $1`, [id]);
  if (!result.rows[0]) throw new ApiError(404, "Service not found.", "NOT_FOUND");
  return mapService(result.rows[0]);
};

const createService = async ({ type, name, address, latitude, longitude, phone, maps_link, image_url, description }) => {
  if (!type || !name) throw new ApiError(422, "Type and name are required.", "VALIDATION_ERROR");
  if (!latitude || !longitude) throw new ApiError(422, "Latitude and longitude are required.", "VALIDATION_ERROR");
  const result = await db.query(
    `INSERT INTO services (type, name, address, latitude, longitude, phone, maps_link, image_url, description, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE) RETURNING *`,
    [type, name, address || null, parseFloat(latitude), parseFloat(longitude),
     phone || null, maps_link || null, image_url || null, description || null]
  );
  return mapService(result.rows[0]);
};

const updateService = async (id, { type, name, address, latitude, longitude, phone, maps_link, image_url, description, is_active }) => {
  const existing = await getServiceById(id);
  const result = await db.query(
    `UPDATE services SET
       type        = COALESCE($1, type),
       name        = COALESCE($2, name),
       address     = COALESCE($3, address),
       latitude    = COALESCE($4, latitude),
       longitude   = COALESCE($5, longitude),
       phone       = COALESCE($6, phone),
       maps_link   = COALESCE($7, maps_link),
       image_url   = COALESCE($8, image_url),
       description = COALESCE($9, description),
       is_active   = COALESCE($10, is_active),
       updated_at  = now()
     WHERE id = $11 RETURNING *`,
    [
      type || null,
      name || null,
      address !== undefined ? address : null,
      latitude != null ? parseFloat(latitude) : null,
      longitude != null ? parseFloat(longitude) : null,
      phone !== undefined ? phone : null,
      maps_link !== undefined ? maps_link : null,
      image_url !== undefined ? image_url : null,
      description !== undefined ? description : null,
      is_active != null ? is_active : null,
      id,
    ]
  );
  return mapService(result.rows[0]);
};

const deleteService = async (id) => {
  await getServiceById(id);
  await db.query(`DELETE FROM services WHERE id = $1`, [id]);
  return { deleted: true };
};

const getNearbyServices = async ({ latitude, longitude, radiusKm = 50, type }) => {
  // Haversine distance in SQL — works without a PG function
  const params = [parseFloat(latitude), parseFloat(longitude), parseFloat(radiusKm)];
  let typeFilter = "";
  if (type) { params.push(type); typeFilter = `AND s.type = $${params.length}`; }

  const result = await db.query(
    `SELECT s.*,
       ROUND((
         6371 * acos(
           cos(radians($1)) * cos(radians(s.latitude)) *
           cos(radians(s.longitude) - radians($2)) +
           sin(radians($1)) * sin(radians(s.latitude))
         )
       )::numeric, 2) AS distance_km
     FROM services s
     WHERE s.is_active = TRUE
       ${typeFilter}
     HAVING ROUND((
         6371 * acos(
           cos(radians($1)) * cos(radians(s.latitude)) *
           cos(radians(s.longitude) - radians($2)) +
           sin(radians($1)) * sin(radians(s.latitude))
         )
       )::numeric, 2) <= $3
     ORDER BY distance_km ASC`,
    params
  );
  return result.rows.map((row) => ({
    ...mapService(row),
    distance_km: parseFloat(row.distance_km),
  }));
};

module.exports = {
  getAllServices,
  getAllServicesAdmin,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getNearbyServices,
};

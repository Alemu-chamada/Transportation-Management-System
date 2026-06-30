const mapService = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    address: row.address,
    latitude: row.latitude ? parseFloat(row.latitude) : null,
    longitude: row.longitude ? parseFloat(row.longitude) : null,
    phone: row.phone || null,
    maps_link: row.maps_link || null,
    image_url: row.image_url || null,
    description: row.description || null,
    is_active: row.is_active,
    distance_km: row.distance_km != null ? parseFloat(row.distance_km) : undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

module.exports = { mapService };

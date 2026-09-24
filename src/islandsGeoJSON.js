// GeoJSON ranh giới và vùng đảo Hoàng Sa & Trường Sa
export const islandsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Quần đảo Hoàng Sa (Đà Nẵng, Việt Nam)",
        shortName: "Quần đảo Hoàng Sa"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [111.0, 15.8],
            [113.0, 15.8],
            [113.0, 17.2],
            [111.0, 17.2],
            [111.0, 15.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Quần đảo Trường Sa (Khánh Hòa, Việt Nam)",
        shortName: "Quần đảo Trường Sa"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [111.5, 7.0],
            [117.5, 7.0],
            [117.5, 12.0],
            [111.5, 12.0],
            [111.5, 7.0]
          ]
        ]
      }
    }
  ]
};
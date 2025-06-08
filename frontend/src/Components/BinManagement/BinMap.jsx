import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Routing component
const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to, map]);

  return null;
};

// Resize fix
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

const BinMap = ({ bins, onAssignClick = () => {}, routeToBin, role = 'Operator' }) => {
  const mapRef = useRef(null);
  const operatorLocation = { lat: 6.715, lng: 80.787 };

  // 💡 This will re-center the map when a bin is selected
  useEffect(() => {
    if (routeToBin && mapRef.current) {
      const { lat, lng } = routeToBin.coordinates;
      mapRef.current.setView([lat, lng], 18);
    }
  }, [routeToBin]);

  return (
    <MapContainer
      center={[6.7146, 80.7875]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <ResizeMap />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {bins.map((bin) =>
        bin.coordinates?.lat && bin.coordinates?.lng ? (
          <Marker key={bin.id} position={[bin.coordinates.lat, bin.coordinates.lng]}>
            <Popup>
              <strong>{bin.id}</strong><br />
              {bin.location}<br />
              Waste: {bin.wasteLevel}%
              {role === 'Admin' && (
                <button
                  className="text-sm text-green-600 mt-2 underline"
                  onClick={() => onAssignClick(bin)}
                >
                  Assign Operator
                </button>
              )}
            </Popup>
          </Marker>
        ) : null
      )}

      {routeToBin && (
        <Routing from={operatorLocation} to={routeToBin.coordinates} />
      )}
    </MapContainer>
  );
};

export default BinMap;

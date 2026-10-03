import { Link } from 'react-router-dom';
import { Bed, Bath, Square, Camera, MapPin } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const {
    property_id, title, city, state, price, property_type, listing_type,
    bedrooms, bathrooms, area_sqft, has_virtual_tour,
    seller_name, media
  } = property;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  // Support both media array and direct image field
  const primaryImage =
    (media && media.length > 0 ? media.find(m => m.is_primary)?.url || media[0]?.url : null) ||
    property.image_url ||
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format`;

  const listingBadgeColor = listing_type === 'rent' ? 'bg-green-500' : 'bg-amber-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/properties/${property_id}`}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-200">
          <img
            src={primaryImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format';
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`${listingBadgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
              For {listing_type === 'rent' ? 'Rent' : 'Sale'}
            </span>
          </div>
          {has_virtual_tour === 1 || has_virtual_tour === true ? (
            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <Camera className="w-3 h-3" /> 360° Tour
            </div>
          ) : null}
          {/* Property type tag */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full capitalize">
              {property_type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs mb-1.5">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
            {city}{state ? `, ${state}` : ''}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{title}</h3>

          {/* Price */}
          <div className="text-xl font-extrabold text-blue-700 mb-3">
            {formattedPrice}
            {listing_type === 'rent' && <span className="text-sm font-normal text-gray-500"> /mo</span>}
          </div>

          {/* Details row */}
          {(bedrooms || bathrooms || area_sqft) && (
            <div className="flex items-center gap-4 text-gray-500 text-sm border-t border-gray-100 pt-3">
              {bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{bedrooms} Bed</span>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span>{bathrooms} Bath</span>
                </div>
              )}
              {area_sqft && (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4 text-gray-400" />
                  <span>{area_sqft} sqft</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;

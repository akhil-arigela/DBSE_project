-- ============================================================
--  SEED DATA — Real Estate Listing & Virtual Tour Portal
--  Run this AFTER schema.sql
-- ============================================================

USE realestate_db;

-- ─────────────────────────────────────────────
-- USERS (password for all = Test@1234)
-- bcrypt hash of "Test@1234"
-- ─────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, role, phone, profile_image) VALUES
('Rajesh Kumar',    'rajesh@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', '9876543210', NULL),
('Priya Sharma',    'priya@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  '9876543211', NULL),
('Arjun Mehta',     'arjun@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent',  '9876543212', NULL),
('Sunita Verma',    'sunita@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', '9876543213', NULL),
('Vikram Singh',    'vikram@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent',  '9876543214', NULL),
('Anjali Nair',     'anjali@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  '9876543215', NULL),
('Rohit Gupta',     'rohit@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', '9876543216', NULL),
('Meera Iyer',      'meera@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  '9876543217', NULL),
('Kiran Reddy',     'kiran@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent',  '9876543218', NULL),
('Deepa Pillai',    'deepa@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  '9876543219', NULL);

-- ─────────────────────────────────────────────
-- AGENTS
-- ─────────────────────────────────────────────
INSERT INTO agents (user_id, license_number, bio, agency_name, experience_years, avg_rating, total_reviews) VALUES
(3, 'MH-AGT-2019-001', 'Experienced real estate professional with over 8 years in Mumbai residential and commercial markets. Specializing in luxury apartments and villas.', 'Prime Properties Mumbai', 8, 4.80, 24),
(5, 'DL-AGT-2020-045', 'Delhi NCR expert with deep knowledge of Gurgaon and Noida corridors. Helped 200+ families find their dream homes.', 'Delhi Homes Realty', 6, 4.60, 18),
(9, 'KA-AGT-2018-012', 'Bangalore tech corridor specialist. Expert in premium apartments near Electronic City and Whitefield.', 'Bangalore Elite Realty', 9, 4.90, 31);

-- ─────────────────────────────────────────────
-- PROPERTIES
-- ─────────────────────────────────────────────
INSERT INTO properties (seller_id, agent_id, title, description, property_type, listing_type, price, address, city, state, country, pincode, bedrooms, bathrooms, area_sqft, has_virtual_tour, status) VALUES

-- Mumbai Properties
(1, 1, '3BHK Luxury Apartment in Bandra West',
 'Stunning sea-facing apartment with panoramic views of the Arabian Sea. This premium 3BHK features floor-to-ceiling windows, Italian marble flooring, modular kitchen with premium appliances, and a spacious balcony. Located in the heart of Bandra West, walking distance from Carter Road and Linking Road.',
 'apartment', 'sale', 18500000,
 '12, Sea Breeze CHS, Carter Road', 'Mumbai', 'Maharashtra', 'India', '400050', 3, 3, 1650, TRUE, 'available'),

(4, 1, '4BHK Villa in Powai',
 'Exclusive gated community villa with private garden and swimming pool. This magnificent property features a double-height living room, home theatre, servant quarters, and a 3-car garage. Surrounded by lush greenery near Powai Lake.',
 'villa', 'sale', 45000000,
 '7, Green Valley Estate, Hiranandani Gardens', 'Mumbai', 'Maharashtra', 'India', '400076', 4, 4, 4200, TRUE, 'available'),

(7, 1, '2BHK Apartment for Rent in Andheri East',
 'Modern 2BHK apartment in a premium society with 24/7 security, gym, and swimming pool. Fully furnished with branded furniture. Walking distance to Andheri Metro Station.',
 'apartment', 'rent', 55000,
 '304, Orchid Heights, Marol', 'Mumbai', 'Maharashtra', 'India', '400059', 2, 2, 980, FALSE, 'available'),

-- Delhi Properties
(1, 2, '3BHK Independent Floor in South Delhi',
 'Beautiful independent floor in a prime South Delhi locality. Features wooden flooring, premium fittings, and a terrace. Surrounded by parks and top schools. Easy connectivity to Metro.',
 'apartment', 'sale', 22000000,
 'B-45, First Floor, Greater Kailash-1', 'Delhi', 'Delhi', 'India', '110048', 3, 2, 1800, FALSE, 'available'),

(4, 2, 'Commercial Office Space in Connaught Place',
 'Premium fully furnished office space in the heart of Delhi. Ready-to-move with high-speed internet, 24/7 power backup, conference room, and reception area. Ideal for startups and MNCs.',
 'commercial', 'rent', 250000,
 '14, Barakhamba Road, Connaught Place', 'Delhi', 'Delhi', 'India', '110001', NULL, 2, 3200, FALSE, 'available'),

(7, 2, 'Plot in Dwarka Sector 22',
 'Residential plot in a well-developed sector of Dwarka. All utilities available. Ready for immediate construction. Good connectivity to IGI Airport and Metro.',
 'plot', 'sale', 12500000,
 'Plot 88, Sector 22', 'Delhi', 'Delhi', 'India', '110077', NULL, NULL, 2400, FALSE, 'available'),

-- Bangalore Properties
(1, 3, '3BHK Premium Apartment in Whitefield',
 'Tech park adjacent premium apartment perfect for IT professionals. Features smart home automation, solar panels, EV charging points, and a rooftop infinity pool. Walking distance to major IT parks.',
 'apartment', 'sale', 9500000,
 '501, Prestige Silicon City, Whitefield Road', 'Bangalore', 'Karnataka', 'India', '560066', 3, 3, 1420, TRUE, 'available'),

(4, 3, '2BHK Apartment for Rent in Electronic City',
 'Modern 2BHK in a gated community near Electronic City Phase 1. Amenities include gym, pool, badminton court, and kids play area. Semi-furnished with wardrobes and kitchen chimney.',
 'apartment', 'rent', 28000,
 '203, Sobha Silicon Oasis, Phase 1', 'Bangalore', 'Karnataka', 'India', '560100', 2, 2, 1050, FALSE, 'available'),

(7, 3, '4BHK Villa in North Bangalore',
 'Luxurious villa in a gated township near Devanahalli. Features private garden, home automation, solar heating, and club access. Close to Kempegowda International Airport.',
 'villa', 'sale', 28000000,
 '22, Cloud Nine Township, Devanahalli', 'Bangalore', 'Karnataka', 'India', '562110', 4, 4, 3800, TRUE, 'available'),

-- Hyderabad Properties
(1, NULL, '3BHK Apartment in Hitech City',
 'Spacious 3BHK in one of Hyderabad most sought-after locations. Premium finishes, modular kitchen, power backup, and club house. Close to major IT companies and malls.',
 'apartment', 'sale', 8500000,
 '1102, My Home Jewel, Madhapur', 'Hyderabad', 'Telangana', 'India', '500081', 3, 3, 1650, TRUE, 'available'),

(4, NULL, 'Luxury Penthouse in Banjara Hills',
 'Exclusive duplex penthouse with private terrace and 360-degree city views. Features jacuzzi, home theatre, premium imported fittings, and private elevator. Truly one of a kind.',
 'apartment', 'sale', 65000000,
 'PH-1, Boulevard Towers, Banjara Hills', 'Hyderabad', 'Telangana', 'India', '500034', 4, 5, 5500, TRUE, 'available'),

-- Pune Properties
(7, NULL, '2BHK Apartment in Kothrud',
 'Well-maintained 2BHK in a peaceful locality. Wooden flooring, modular kitchen, and a lovely garden view. Society has 24/7 security, gym, and children play area.',
 'apartment', 'sale', 7200000,
 '402, Sai Residency, Kothrud', 'Pune', 'Maharashtra', 'India', '411038', 2, 2, 1050, FALSE, 'available'),

(1, NULL, '3BHK Row House in Wakad',
 'Beautiful independent row house with private garden and parking for 2 cars. Modern architecture with traditional charm. Near to Wakad Bridge and highway access.',
 'house', 'sale', 11500000,
 '15, Rose Garden Row Houses, Wakad', 'Pune', 'Maharashtra', 'India', '411057', 3, 3, 1800, FALSE, 'available'),

-- Chennai Properties
(4, NULL, '3BHK Apartment in OMR',
 'Premium apartment in the IT corridor of Chennai. Features vitrified tiles, modular kitchen, covered parking, and 24/7 security. Close to major IT parks and schools.',
 'apartment', 'sale', 7800000,
 '805, VGN Stafford, OMR', 'Chennai', 'Tamil Nadu', 'India', '600119', 3, 2, 1350, FALSE, 'available'),

(7, NULL, '2BHK Apartment for Rent in Adyar',
 'Elegant 2BHK in a prime residential area. Fully furnished, near beach, schools, and hospitals. Society has power backup, security, and car parking.',
 'apartment', 'rent', 32000,
 '201, Sea View Apartments, Adyar', 'Chennai', 'Tamil Nadu', 'India', '600020', 2, 2, 1100, FALSE, 'available');

-- ─────────────────────────────────────────────
-- PROPERTY AMENITIES
-- ─────────────────────────────────────────────
-- Property 1 (Bandra Apt)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10);

-- Property 2 (Powai Villa)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(2,1),(2,2),(2,3),(2,5),(2,6),(2,7),(2,8),(2,9),(2,11),(2,14);

-- Property 3 (Andheri Rent)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(3,1),(3,2),(3,3),(3,4),(3,5),(3,8),(3,10);

-- Property 4 (South Delhi)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(4,3),(4,5),(4,7),(4,8),(4,9),(4,15);

-- Property 7 (Whitefield)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(7,1),(7,2),(7,3),(7,4),(7,5),(7,8),(7,10),(7,11),(7,13);

-- Property 8 (Electronic City Rent)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(8,1),(8,2),(8,3),(8,5),(8,7),(8,8);

-- Property 9 (Bangalore Villa)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(9,1),(9,2),(9,3),(9,5),(9,6),(9,8),(9,9),(9,11),(9,14);

-- Property 10 (Hitech City)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(10,1),(10,2),(10,3),(10,4),(10,5),(10,8),(10,10),(10,11);

-- ─────────────────────────────────────────────
-- MEDIA (Using public placeholder images)
-- ─────────────────────────────────────────────
INSERT INTO media (property_id, media_type, url, filename, is_primary, display_order) VALUES
-- Property 1 - Bandra Apartment
(1, 'photo', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'living-room.jpg', TRUE, 1),
(1, 'photo', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'bedroom.jpg', FALSE, 2),
(1, 'photo', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'kitchen.jpg', FALSE, 3),

-- Property 2 - Powai Villa
(2, 'photo', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'villa-front.jpg', TRUE, 1),
(2, 'photo', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'villa-pool.jpg', FALSE, 2),
(2, 'photo', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800', 'villa-living.jpg', FALSE, 3),

-- Property 3 - Andheri Rent
(3, 'photo', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'apartment.jpg', TRUE, 1),
(3, 'photo', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'bedroom2.jpg', FALSE, 2),

-- Property 4 - South Delhi
(4, 'photo', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'floor.jpg', TRUE, 1),
(4, 'photo', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', 'terrace.jpg', FALSE, 2),

-- Property 7 - Whitefield Bangalore
(7, 'photo', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800', 'tech-apt.jpg', TRUE, 1),
(7, 'photo', 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800', 'pool.jpg', FALSE, 2),

-- Property 8 - Electronic City Rent
(8, 'photo', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'apt-rent.jpg', TRUE, 1),

-- Property 9 - Bangalore Villa
(9, 'photo', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'luxury-villa.jpg', TRUE, 1),
(9, 'photo', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'garden.jpg', FALSE, 2),

-- Property 10 - Hitech City
(10, 'photo', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'hitech.jpg', TRUE, 1),
(10, 'photo', 'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800', 'amenities.jpg', FALSE, 2),

-- Property 11 - Banjara Hills Penthouse
(11, 'photo', 'https://images.unsplash.com/photo-1560185127-6a8e7a72f9c7?w=800', 'penthouse.jpg', TRUE, 1),
(11, 'photo', 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800', 'penthouse-view.jpg', FALSE, 2),

-- Property 12 - Pune Kothrud
(12, 'photo', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', 'pune-apt.jpg', TRUE, 1),

-- Property 13 - Pune Row House
(13, 'photo', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'row-house.jpg', TRUE, 1),

-- Property 14 - Chennai OMR
(14, 'photo', 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800', 'chennai-apt.jpg', TRUE, 1),

-- Property 15 - Chennai Adyar Rent
(15, 'photo', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'adyar-apt.jpg', TRUE, 1);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
INSERT INTO reviews (property_id, agent_id, reviewer_id, rating, comment) VALUES
-- Property reviews
(1, NULL, 2, 5, 'Absolutely stunning apartment! The sea view is breathtaking and the interiors are world class. Arjun helped us through the entire process smoothly.'),
(1, NULL, 6, 4, 'Great location and beautiful property. Slightly on the higher end of pricing but worth every rupee for the views and amenities.'),
(2, NULL, 8, 5, 'The Powai villa exceeded all our expectations. Spacious, well-maintained, and the gated community feels very safe for our family.'),
(7, NULL, 2, 5, 'Perfect for IT professionals! 10 minutes walk to office and the amenities are top notch. Highly recommend this property.'),
(9, NULL, 6, 4, 'Luxury villa at its finest. The garden and architecture are beautiful. The agent was very professional and helped us negotiate well.'),
(10, NULL, 8, 5, 'Fantastic apartment in Hitech City. Modern design, excellent connectivity, and the society management is very responsive.'),

-- Agent reviews
(NULL, 1, 2, 5, 'Arjun is an outstanding agent! Very knowledgeable about Mumbai market, responsive, and helped us find our dream home within budget.'),
(NULL, 1, 6, 5, 'Professional, honest, and extremely helpful. Arjun showed us 12 properties before we found the perfect one. Highly recommend!'),
(NULL, 1, 8, 4, 'Very good agent. Knows the Mumbai market very well. Sometimes took time to respond but overall a great experience.'),
(NULL, 2, 2, 5, 'Vikram is exceptional! Deep knowledge of Delhi NCR market, negotiated a great price for us. Will definitely use his services again.'),
(NULL, 2, 10, 4, 'Good agent, very professional. Showed us many options across Gurgaon and Noida. Helped us understand all legal aspects.'),
(NULL, 3, 6, 5, 'Kiran is the best real estate agent in Bangalore! Found us the perfect tech-park apartment in just 2 weeks. Amazing service!');

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
INSERT INTO bookings (property_id, buyer_id, agent_id, visit_date, visit_time, status, notes) VALUES
(1, 2, 1, '2026-09-15', '10:00:00', 'confirmed', 'Please keep the sea-facing balcony accessible during visit.'),
(2, 6, 1, '2026-09-16', '11:00:00', 'confirmed', 'Interested in the pool and garden area as well.'),
(7, 8, 3, '2026-09-14', '14:00:00', 'completed', 'Visit completed. Very happy with the property.'),
(9, 10, 3, '2026-09-17', '10:30:00', 'pending', 'First time visiting. Would like to see all rooms.'),
(10, 2, NULL, '2026-09-18', '16:00:00', 'pending', 'Please arrange for virtual tour if possible.'),
(3, 6, 1, '2026-09-13', '12:00:00', 'completed', 'Liked the property. Negotiating on rent.'),
(4, 8, 2, '2026-09-20', '11:00:00', 'confirmed', 'Want to check terrace and parking space.');

-- ─────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────
INSERT INTO transactions (property_id, buyer_id, seller_id, agent_id, amount, transaction_type, status, payment_method, reference_number, notes) VALUES
(7, 8, 1, 3, 9500000, 'sale', 'completed', 'Bank Transfer', 'TXN-BLR-2026-001', 'Sale completed. Registration done at sub-registrar office.'),
(3, 6, 7, 1, 55000, 'rent', 'completed', 'NEFT', 'TXN-MUM-2026-002', 'Rental agreement signed for 11 months. Security deposit collected.');

-- Update agent ratings based on reviews
UPDATE agents SET avg_rating = 4.67, total_reviews = 3 WHERE agent_id = 1;
UPDATE agents SET avg_rating = 4.50, total_reviews = 2 WHERE agent_id = 2;
UPDATE agents SET avg_rating = 5.00, total_reviews = 1 WHERE agent_id = 3;

SELECT 'SEED DATA INSERTED SUCCESSFULLY!' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_properties FROM properties;
SELECT COUNT(*) AS total_media FROM media;
SELECT COUNT(*) AS total_reviews FROM reviews;
SELECT COUNT(*) AS total_bookings FROM bookings;

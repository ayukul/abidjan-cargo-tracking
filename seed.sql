-- Seed data for demo/testing
-- Insert sample shipments

INSERT INTO shipments (tracking_code, customer_name, customer_phone, customer_email, origin, destination, current_status, estimated_arrival_date, notes) VALUES
('ACT-2024-001', 'Jean Kouamé', '+225 07 12 34 56', 'jean@example.com', 'Shanghai, China', 'Abidjan, Côte d''Ivoire', 'En transit', '2024-06-15', 'Electronics shipment - 5 boxes'),
('ACT-2024-002', 'Marie Assou', '+225 07 98 76 54', 'marie@example.com', 'Guangzhou, China', 'Abidjan, Côte d''Ivoire', 'Arrivé à Abidjan', '2024-06-10', 'Textiles - Urgent delivery'),
('ACT-2024-003', 'Ahmed Hassan', '+225 07 11 22 33', 'ahmed@example.com', 'Beijing, China', 'Abidjan, Côte d''Ivoire', 'En dédouanement', '2024-06-18', 'Industrial parts - Fragile'),
('ACT-2024-004', 'Fatou Diallo', '+225 07 55 66 77', 'fatou@example.com', 'Shenzhen, China', 'Abidjan, Côte d''Ivoire', 'Prêt pour livraison', '2024-06-05', 'Consumer goods'),
('ACT-2024-005', 'Kofi Mensah', '+225 07 44 33 22', 'kofi@example.com', 'Shanghai, China', 'Abidjan, Côte d''Ivoire', 'Livré', '2024-05-28', 'Office supplies - Delivered'),
('ACT-2024-006', 'Amina Diop', '+225 07 88 99 00', 'amina@example.com', 'Nanjing, China', 'Abidjan, Côte d''Ivoire', 'Expédié', '2024-06-20', 'Machinery components'),
('ACT-2024-007', 'Victor Moreau', '+225 07 77 88 99', 'victor@example.com', 'Xiamen, China', 'Abidjan, Côte d''Ivoire', 'En préparation', '2024-06-25', 'Raw materials - 10 pallets'),
('ACT-2024-008', 'Yvette Laurent', '+225 07 33 44 55', 'yvette@example.com', 'Hangzhou, China', 'Abidjan, Côte d''Ivoire', 'Retardé', '2024-06-12', 'Customs delay - Expected soon'),
('ACT-2024-009', 'Pierre Dubois', '+225 07 66 77 88', 'pierre@example.com', 'Dalian, China', 'Abidjan, Côte d''Ivoire', 'Reçu en Chine', '2024-07-01', 'Just received in warehouse'),
('ACT-2024-010', 'Sophia Chen', '+225 07 22 33 44', 'sophia@example.com', 'Chongqing, China', 'Abidjan, Côte d''Ivoire', 'En transit', '2024-06-22', 'Mixed goods shipment');

-- Insert status history for each shipment
INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Reçu en Chine', 'Shipment received and registered in Shanghai warehouse'
FROM shipments WHERE tracking_code = 'ACT-2024-001';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'En préparation', 'Items being packed and prepared for shipment'
FROM shipments WHERE tracking_code = 'ACT-2024-001';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Expédié', 'Shipment left Shanghai port'
FROM shipments WHERE tracking_code = 'ACT-2024-001';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'En transit', 'Currently in transit across sea'
FROM shipments WHERE tracking_code = 'ACT-2024-001';

-- Status history for ACT-2024-002
INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Reçu en Chine', 'Textiles received in Guangzhou'
FROM shipments WHERE tracking_code = 'ACT-2024-002';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Expédié', 'Left Guangzhou port'
FROM shipments WHERE tracking_code = 'ACT-2024-002';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'En transit', 'In transit via container ship'
FROM shipments WHERE tracking_code = 'ACT-2024-002';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Arrivé à Abidjan', 'Arrived at Port of Abidjan'
FROM shipments WHERE tracking_code = 'ACT-2024-002';

-- Status history for ACT-2024-005 (Already delivered)
INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Reçu en Chine', 'Office supplies received in Shanghai'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Expédié', 'Left Shanghai'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'En transit', 'Sea transit'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Arrivé à Abidjan', 'Arrived at Abidjan port'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'En dédouanement', 'Cleared customs'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Prêt pour livraison', 'Ready for final delivery'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

INSERT INTO shipment_status_history (shipment_id, status, note)
SELECT id, 'Livré', 'Successfully delivered to customer'
FROM shipments WHERE tracking_code = 'ACT-2024-005';

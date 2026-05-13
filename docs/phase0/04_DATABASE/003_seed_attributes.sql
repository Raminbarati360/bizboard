-- Bizboard Phase 0 Seed Attributes

INSERT INTO catalog.attributes (code, title, data_type, unit, is_filterable, is_comparable, is_required)
VALUES
  ('brand', 'برند', 'select', NULL, true, true, true),
  ('model', 'مدل', 'text', NULL, true, true, false),
  ('memory', 'حافظه داخلی', 'number', 'GB', true, true, false),
  ('ram', 'رم', 'number', 'GB', true, true, false),
  ('screen_size', 'اندازه صفحه‌نمایش', 'number', 'inch', true, true, false),
  ('battery_capacity', 'ظرفیت باتری', 'number', 'mAh', true, true, false),
  ('camera_main', 'دوربین اصلی', 'number', 'MP', true, true, false),
  ('network_5g', 'پشتیبانی 5G', 'boolean', NULL, true, true, false),
  ('cpu_model', 'مدل پردازنده', 'text', NULL, true, true, false),
  ('gpu_model', 'مدل کارت گرافیک', 'text', NULL, true, true, false),
  ('weight', 'وزن', 'number', 'kg', true, true, false),
  ('energy_class', 'رده مصرف انرژی', 'select', NULL, true, true, false),
  ('warranty_months', 'مدت گارانتی', 'number', 'month', true, true, false)
ON CONFLICT (code) DO NOTHING;

-- Example option seeds
INSERT INTO catalog.attribute_options (attribute_id, value, label, sort_order)
SELECT id, 'A', 'A', 1 FROM catalog.attributes WHERE code='energy_class'
ON CONFLICT (attribute_id, value) DO NOTHING;
INSERT INTO catalog.attribute_options (attribute_id, value, label, sort_order)
SELECT id, 'B', 'B', 2 FROM catalog.attributes WHERE code='energy_class'
ON CONFLICT (attribute_id, value) DO NOTHING;
INSERT INTO catalog.attribute_options (attribute_id, value, label, sort_order)
SELECT id, 'C', 'C', 3 FROM catalog.attributes WHERE code='energy_class'
ON CONFLICT (attribute_id, value) DO NOTHING;

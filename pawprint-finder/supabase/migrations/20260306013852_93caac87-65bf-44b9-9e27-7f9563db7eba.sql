-- Add server-side validation for reporter_meta message length
ALTER TABLE rescate_reports
  ADD CONSTRAINT reporter_meta_msg_length
  CHECK (
    reporter_meta IS NULL
    OR reporter_meta->>'message' IS NULL
    OR length(reporter_meta->>'message') <= 500
  );

-- Add lat/lon range validation
ALTER TABLE rescate_reports
  ADD CONSTRAINT rescate_reports_lat_range CHECK (lat BETWEEN -90 AND 90),
  ADD CONSTRAINT rescate_reports_lon_range CHECK (lon BETWEEN -180 AND 180);
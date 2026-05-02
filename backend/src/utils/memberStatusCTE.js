export const memberStatusCTE = `
  WITH latest_subs AS (
    SELECT DISTINCT ON (member_id)
      member_id,
      plan_id,
      plan_name,
      end_date,
      start_date
    FROM subscriptions
    ORDER BY member_id, end_date DESC, created_at DESC
  ),
  member_status AS (
    SELECT
      m.id AS member_id,
      COALESCE(BOOL_OR(CURRENT_DATE BETWEEN s.start_date AND s.end_date), FALSE) AS is_active,
      MAX(s.end_date) AS latest_end_date,
      (SELECT start_date FROM latest_subs ls WHERE ls.member_id = m.id) AS last_start_date,
      (SELECT plan_name FROM latest_subs ls WHERE ls.member_id = m.id) AS last_plan_name,
      (SELECT plan_id FROM latest_subs ls WHERE ls.member_id = m.id) AS last_plan_id
    FROM members m
    LEFT JOIN subscriptions s ON s.member_id = m.id
    GROUP BY m.id
  )
`;

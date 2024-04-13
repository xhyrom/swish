CREATE TABLE queue(
    id SERIAL NOT NULL,
    video_id varchar(11),
    from_user varchar(255),
    to_user varchar(255),
    PRIMARY KEY(id)
);

create or replace function notify_trigger() returns trigger as $$
declare
  payload json;
begin
  payload := json_build_object('table', TG_TABLE_NAME, 'id', NEW.id, 'action', TG_OP,  'data', row_to_json(new));
  perform pg_notify('table_changes', payload::text);
  return new;
end;
$$ language plpgsql;

create trigger queue_trigger
after insert or update or delete on queue
for each row execute function notify_trigger();
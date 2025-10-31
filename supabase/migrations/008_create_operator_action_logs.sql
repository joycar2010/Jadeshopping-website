-- 创建后台操作员操作日志表，用于记录对用户等资源的变更
-- 与后端 routes 中的写操作联动

create table if not exists public.operator_action_logs (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null,
  action text not null, -- e.g. 'user.enable' | 'user.disable' | 'user.update'
  target_type text not null, -- e.g. 'user'
  target_id uuid not null,
  detail jsonb, -- 保存变更前后、字段列表、请求来源等
  ip text,
  created_at timestamp with time zone default now()
);

-- 索引
create index if not exists idx_operator_action_logs_operator on public.operator_action_logs(operator_id);
create index if not exists idx_operator_action_logs_target on public.operator_action_logs(target_type, target_id);
create index if not exists idx_operator_action_logs_created_at on public.operator_action_logs(created_at desc);

-- RLS 策略（可按需调整；当前后台服务使用 service role 访问，可不严格限制）
alter table public.operator_action_logs enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'operator_action_logs' and policyname = 'allow_service_role_all'
  ) then
    create policy allow_service_role_all on public.operator_action_logs for all
    using (true) with check (true);
  end if;
end $$;
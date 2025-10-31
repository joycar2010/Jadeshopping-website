-- 收紧 operator_action_logs 的RLS策略：仅允许 service role 访问
-- 说明：Supabase 的 service role 默认可绕过 RLS；此策略用于显式限制非 service role 的访问

alter table public.operator_action_logs enable row level security;

-- 删除可能存在的“允许所有”的旧策略
do $$ begin
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'operator_action_logs' and policyname = 'allow_service_role_all'
  ) then
    drop policy allow_service_role_all on public.operator_action_logs;
  end if;
end $$;

-- 仅允许 service role 访问（auth.role() = 'service_role'）
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'operator_action_logs' and policyname = 'service_role_only_select'
  ) then
    create policy service_role_only_select on public.operator_action_logs
      for select using (auth.role() = 'service_role');
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'operator_action_logs' and policyname = 'service_role_only_modify'
  ) then
    create policy service_role_only_modify on public.operator_action_logs
      for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;
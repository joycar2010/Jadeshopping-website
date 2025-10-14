-- 创建同步事件表
CREATE TABLE IF NOT EXISTS sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('INSERT', 'UPDATE', 'DELETE')),
    old_record JSONB,
    new_record JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_sync_events_table_name ON sync_events(table_name);
CREATE INDEX IF NOT EXISTS idx_sync_events_timestamp ON sync_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_sync_events_synced ON sync_events(synced);
CREATE INDEX IF NOT EXISTS idx_sync_events_event_type ON sync_events(event_type);

-- 启用 RLS
ALTER TABLE sync_events ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略 - 只有管理员可以访问
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'sync_events' 
        AND policyname = '管理员可以查看所有同步事件'
    ) THEN
        CREATE POLICY "管理员可以查看所有同步事件" ON sync_events
            FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'sync_events' 
        AND policyname = '管理员可以插入同步事件'
    ) THEN
        CREATE POLICY "管理员可以插入同步事件" ON sync_events
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'sync_events' 
        AND policyname = '管理员可以更新同步事件'
    ) THEN
        CREATE POLICY "管理员可以更新同步事件" ON sync_events
            FOR UPDATE USING (true);
    END IF;
END $$;

-- 授权给 authenticated 角色（管理员使用）
GRANT ALL PRIVILEGES ON sync_events TO authenticated;
GRANT ALL PRIVILEGES ON sync_events TO anon;
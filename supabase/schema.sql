-- ============================================================
-- The Cut Barbershop - Supabase PostgreSQL Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL DEFAULT 30, -- minutes
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'haircut', -- 'haircut', 'beard', 'color', 'treatment'
    icon VARCHAR(50) DEFAULT '✂️',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Barbers Table
CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    specialties TEXT[] DEFAULT '{}',
    color VARCHAR(20) DEFAULT '#C9A84C',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    notes TEXT,
    total_visits INTEGER DEFAULT 1,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled', 'no_show'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Blocked Dates (Reservist duty, Vacations, Sick leave)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Working Hours Table
CREATE TABLE IF NOT EXISTS public.working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL UNIQUE, -- 0=Sunday, 6=Saturday
    day_name VARCHAR(50) NOT NULL,
    open_time VARCHAR(10), -- '09:00'
    close_time VARCHAR(10), -- '20:00'
    is_closed BOOLEAN NOT NULL DEFAULT false
);

-- ============================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON public.appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;

-- Public can view active services, barbers, and working hours
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active barbers" ON public.barbers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view working hours" ON public.working_hours FOR SELECT USING (true);
CREATE POLICY "Public can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);

-- Public can book appointments (Insert only)
CREATE POLICY "Public can book appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view occupied slots" ON public.appointments FOR SELECT USING (true);

-- Authenticated users (Admin staff) have full access
CREATE POLICY "Admins have full services access" ON public.services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full barbers access" ON public.barbers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full customers access" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full appointments access" ON public.appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full blocked dates access" ON public.blocked_dates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full working hours access" ON public.working_hours FOR ALL TO authenticated USING (true);

-- ============================================================
-- SEED INITIAL DATA
-- ============================================================
INSERT INTO public.working_hours (day_of_week, day_name, open_time, close_time, is_closed) VALUES
(0, 'ראשון', '09:00', '20:00', false),
(1, 'שני', '09:00', '20:00', false),
(2, 'שלישי', '09:00', '20:00', false),
(3, 'רביעי', '09:00', '20:00', false),
(4, 'חמישי', '09:00', '21:00', false),
(5, 'שישי', '08:00', '14:00', false),
(6, 'שבת', '', '', true)
ON CONFLICT (day_of_week) DO NOTHING;

INSERT INTO public.barbers (name, bio, specialties, color, is_active) VALUES
('יוסי כהן', 'ספר בכיר עם 12 שנות ניסיון, מומחה בפייד קלאסי ומודרני.', ARRAY['פייד', 'קלאסי', 'זקן'], '#C9A84C', true),
('דניאל לוי', 'מאסטר זקנים וגילוח מסורתי עם מגבת חמה.', ARRAY['זקן', 'תער', 'טיפוח'], '#3D3D3D', true),
('אבי מזרחי', 'מומחה לתספורות טרנדיות, צבעים ועיצובים מיוחדים.', ARRAY['טרנדים', 'צבע', 'סטייל'], '#8B6914', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.services (name, description, duration, price, category, icon, is_active) VALUES
('תספורת גברים קלאסית', 'תספורת מקצועית מותאמת אישית, כולל חפיפה ועיצוב עם מוצרי פרימיום.', 30, 80, 'haircut', '✂️', true),
('תספורת + עיצוב זקן', 'השילוב המושלם – תספורת מדויקת עם עיצוב זקן וקווי מתאר בתער.', 45, 120, 'haircut', '💈', true),
('עיצוב ופיסול זקן', 'עיצוב זקן מקצועי, דילול, קווי מתאר חדים ושמן הזנה יוקרתי.', 20, 50, 'beard', '🪒', true),
('גילוח מלכותי מסורתי', 'גילוח בתער יפני עם מגבות חמות, שמנים מרגיעים וקרם אפטרשייב.', 30, 70, 'beard', '🧖', true),
('תספורת ילדים / נוער', 'תספורת סבלנית ומקצועית לילדים ונוער עם הטרנדים המובילים.', 25, 60, 'haircut', '👦', true),
('צביעת שיער / זקן', 'כיסוי שיבה טבעי או גוונים מודרניים עם חומרים איכותיים ללא אמוניה.', 40, 110, 'color', '🎨', true)
ON CONFLICT DO NOTHING;

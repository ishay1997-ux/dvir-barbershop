'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import { format } from 'date-fns';
import type { AdminAppointment } from './types';

interface InteractiveScheduleXCalendarProps {
  appointments: AdminAppointment[];
  onAppointmentReschedule?: (id: string, newDate: string, newTime: string) => void;
  onAppointmentClick?: (appointment: AdminAppointment) => void;
}

export const InteractiveScheduleXCalendar: React.FC<InteractiveScheduleXCalendarProps> = ({
  appointments,
  onAppointmentReschedule,
  onAppointmentClick,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const plugins = useMemo(() => {
    return [
      createDragAndDropPlugin(15), // 15-minute drag steps
      createEventsServicePlugin(),
    ];
  }, []);

  // Map appointments to Schedule-X events
  const events = useMemo(() => {
    return appointments.map((app) => {
      const dateStr = format(app.date, 'yyyy-MM-dd');
      const startStr = `${dateStr} ${app.time}`;
      
      // Calculate 30-45 min end time
      const [h, m] = app.time.split(':').map(Number);
      const endMinute = (m + 30) % 60;
      const endHour = h + Math.floor((m + 30) / 60);
      const endStr = `${dateStr} ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      return {
        id: String(app.id),
        title: `${app.customerName} · ${app.service}`,
        start: startStr,
        end: endStr,
        description: `טלפון: ${app.phone || 'אין טלפון'} | סניף: ${app.branchName || 'סניף ראשי'} | מחיר: ₪${app.price}`,
        people: [app.customerName],
      };
    });
  }, [appointments]);

  const calendar = useNextCalendarApp({
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: 'week',
    locale: 'he-IL',
    firstDayOfWeek: 7, // Sunday in Schedule-X WeekDay enum
    isDark: true,
    callbacks: {
      onEventUpdate(updatedEvent) {
        if (onAppointmentReschedule) {
          const [datePart, timePart] = (updatedEvent.start || '').split(' ');
          if (datePart && timePart) {
            onAppointmentReschedule(String(updatedEvent.id), datePart, timePart);
          }
        }
      },
      onEventClick(calendarEvent) {
        const found = appointments.find((a) => String(a.id) === String(calendarEvent.id));
        if (found && onAppointmentClick) {
          onAppointmentClick(found);
        }
      },
    },
    plugins,
  });

  // Sync events dynamically when appointments change
  useEffect(() => {
    if (calendar && calendar.events) {
      calendar.events.set(events);
    }
  }, [events, calendar]);

  if (!mounted) {
    return (
      <div className="h-96 rounded-2xl bg-[#1C1C1C] border border-white/10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="sx-react-calendar-wrapper bg-[#1C1C1C] rounded-2xl border border-gold/30 p-4 shadow-2xl overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-3 px-2">
        <span className="text-xs font-bold text-gold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          יומן אינטראקטיבי חי (גרירת תורים פעילה עם העכבר · Drag & Drop)
        </span>
        <span className="text-[10px] text-zinc-400">Schedule-X Pro Engine</span>
      </div>
      <div className="calendar-container rounded-xl overflow-hidden" dir="ltr">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
};

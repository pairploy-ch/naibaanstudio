"use client";

import { Users, TrendingUp, Calendar, AlertCircle, ChefHat, Clock, Filter, Search, X } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

interface MenuAssignment {
  id: string;
  menuId: string;
  isMainCourse: boolean;
  isDessert: boolean;
  timeSlot: 'morning' | 'afternoon' | 'custom';
  customStart?: string;
  customEnd?: string;
}

interface DaySchedule {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  menus: MenuAssignment[];
  capacity: number;
  price: number;
}

interface GeneratedCourse {
  id: string;
  class_date: string;
  session: string;
  start_time: string;
  end_time: string;
  capacity: number;
  price: number;
  detail: string;
  tag?: string;
  currentBookings?: number;
}

const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

const DAY_OFFSETS = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6
};

const createSampleSchedule = (): DaySchedule[] => [
  {
    day: 'Mon',
    menus: [
      { id: '1', menuId: 'pad-thai', isMainCourse: true, isDessert: false, timeSlot: 'morning' },
      { id: '2', menuId: 'tom-yum', isMainCourse: false, isDessert: false, timeSlot: 'morning' }
    ],
    capacity: 12,
    price: 1800
  },
  {
    day: 'Tue',
    menus: [
      { id: '3', menuId: 'green-curry', isMainCourse: true, isDessert: false, timeSlot: 'afternoon' }
    ],
    capacity: 12,
    price: 1800
  },
  {
    day: 'Wed',
    menus: [
      { id: '4', menuId: 'mango-rice', isMainCourse: false, isDessert: true, timeSlot: 'morning' },
      { id: '5', menuId: 'papaya-salad', isMainCourse: false, isDessert: false, timeSlot: 'afternoon' }
    ],
    capacity: 10,
    price: 1900
  },
  {
    day: 'Thu',
    menus: [
      { id: '6', menuId: 'massaman', isMainCourse: true, isDessert: false, timeSlot: 'morning' }
    ],
    capacity: 12,
    price: 1800
  },
  {
    day: 'Fri',
    menus: [
      { id: '7', menuId: 'spring-rolls', isMainCourse: false, isDessert: false, timeSlot: 'morning' },
      { id: '8', menuId: 'pad-thai', isMainCourse: true, isDessert: false, timeSlot: 'afternoon' }
    ],
    capacity: 14,
    price: 1850
  },
  {
    day: 'Sat',
    menus: [
      { id: '9', menuId: 'full-day', isMainCourse: true, isDessert: true, timeSlot: 'morning' }
    ],
    capacity: 10,
    price: 2200
  },
  {
    day: 'Sun',
    menus: [
      { id: '10', menuId: 'thai-basics', isMainCourse: true, isDessert: false, timeSlot: 'morning' }
    ],
    capacity: 10,
    price: 1750
  }
];

const getUpcomingWeeks = (numWeeks: number = 4) => {
  const weeks: Date[] = [];
  const today = new Date();
  const day = today.getDay();
  const diff = (day + 6) % 7;
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() - diff);

  for (let i = 0; i < numWeeks; i++) {
    const monday = new Date(today);
    monday.setDate(today.getDate() + (i * 7));
    weeks.push(monday);
  }

  return weeks;
};

const getDateForDay = (monday: Date, day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun') => {
  const offset = DAY_OFFSETS[day] ?? 0;
  const target = new Date(monday);
  target.setDate(monday.getDate() + offset);
  return target.toISOString().split('T')[0];
};

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [modalCourse, setModalCourse] = useState<GeneratedCourse | null>(null);
  const schedule = useMemo(() => createSampleSchedule(), []);
  const upcomingWeeks = useMemo(() => getUpcomingWeeks(4), []);

  const generatedCourses: GeneratedCourse[] = useMemo(() => {
    const courses: GeneratedCourse[] = [];

    upcomingWeeks.forEach((monday) => {
      schedule.forEach((daySchedule) => {
        const classDate = getDateForDay(monday, daySchedule.day);
        const morningMenus = daySchedule.menus.filter(m => m.timeSlot === 'morning');
        const afternoonMenus = daySchedule.menus.filter(m => m.timeSlot === 'afternoon');
        const customMenus = daySchedule.menus.filter(m => m.timeSlot === 'custom');

        const randomBookings = Math.floor(Math.random() * daySchedule.capacity);

        if (morningMenus.length > 0) {
          const mainCourses = morningMenus.filter(m => m.isMainCourse);
          const desserts = morningMenus.filter(m => m.isDessert);
          const appetizers = morningMenus.filter(m => !m.isMainCourse && !m.isDessert);
          
          let detailHtml = '';
          if (mainCourses.length > 0) {
            detailHtml += '<strong>Main Course</strong><br/>';
            detailHtml += mainCourses.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }
          if (appetizers.length > 0) {
            if (detailHtml) detailHtml += '<br/><br/>';
            detailHtml += '<strong>Appetizers</strong><br/>';
            detailHtml += appetizers.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }
          if (desserts.length > 0) {
            if (detailHtml) detailHtml += '<br/><br/>';
            detailHtml += '<strong>Dessert</strong><br/>';
            detailHtml += desserts.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }

          courses.push({
            id: `${classDate}-morning`,
            class_date: classDate,
            session: `${DAY_NAMES[daySchedule.day]} Morning`,
            start_time: '09:00',
            end_time: '12:30',
            capacity: daySchedule.capacity,
            price: daySchedule.price,
            detail: detailHtml || `${morningMenus.length} dishes`,
            currentBookings: randomBookings
          });
        }

        if (afternoonMenus.length > 0) {
          const mainCourses = afternoonMenus.filter(m => m.isMainCourse);
          const desserts = afternoonMenus.filter(m => m.isDessert);
          const appetizers = afternoonMenus.filter(m => !m.isMainCourse && !m.isDessert);
          
          let detailHtml = '';
          if (mainCourses.length > 0) {
            detailHtml += '<strong>Main Course</strong><br/>';
            detailHtml += mainCourses.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }
          if (appetizers.length > 0) {
            if (detailHtml) detailHtml += '<br/><br/>';
            detailHtml += '<strong>Appetizers</strong><br/>';
            detailHtml += appetizers.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }
          if (desserts.length > 0) {
            if (detailHtml) detailHtml += '<br/><br/>';
            detailHtml += '<strong>Dessert</strong><br/>';
            detailHtml += desserts.map(m => `• ${m.menuId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('<br/>');
          }

          courses.push({
            id: `${classDate}-afternoon`,
            class_date: classDate,
            session: `${DAY_NAMES[daySchedule.day]} Afternoon`,
            start_time: '14:00',
            end_time: '17:30',
            capacity: daySchedule.capacity,
            price: daySchedule.price,
            detail: detailHtml || `${afternoonMenus.length} dishes`,
            currentBookings: Math.floor(Math.random() * daySchedule.capacity)
          });
        }

        customMenus.forEach((menu) => {
          courses.push({
            id: `${classDate}-${menu.id}`,
            class_date: classDate,
            session: `${DAY_NAMES[daySchedule.day]} Custom`,
            start_time: menu.customStart || '09:00',
            end_time: menu.customEnd || '12:00',
            capacity: daySchedule.capacity,
            price: daySchedule.price,
            detail: '<strong>Custom Menu</strong><br/>• Contact for details',
            tag: 'Custom',
            currentBookings: Math.floor(Math.random() * daySchedule.capacity)
          });
        });
      });
    });

    return courses.sort((a, b) => 
      new Date(a.class_date).getTime() - new Date(b.class_date).getTime()
    );
  }, [schedule, upcomingWeeks]);

  const stats = useMemo(() => {
    const filteredCourses = selectedMonth === 'all' 
      ? generatedCourses 
      : generatedCourses.filter(c => {
          const courseMonth = new Date(c.class_date).toISOString().slice(0, 7);
          return courseMonth === selectedMonth;
        });

    const totalCapacity = filteredCourses.reduce((sum, c) => sum + c.capacity, 0);
    const totalBookings = filteredCourses.reduce((sum, c) => sum + (c.currentBookings || 0), 0);
    const totalRevenue = filteredCourses.reduce((sum, c) => sum + (c.price * (c.currentBookings || 0)), 0);
    const nearlyFull = filteredCourses.filter(c => 
      ((c.currentBookings || 0) / c.capacity) >= 0.7
    ).length;

    return {
      totalCapacity,
      totalBookings,
      totalRevenue,
      nearlyFull,
      totalCourses: filteredCourses.length
    };
  }, [generatedCourses, selectedMonth]);

  const upcomingCourses = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = generatedCourses.filter(c => new Date(c.class_date) >= today);
    
    // Filter by month
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(c => {
        const courseMonth = new Date(c.class_date).toISOString().slice(0, 7);
        return courseMonth === selectedMonth;
      });
    }
    
    // Filter by specific date
    if (selectedDate) {
      filtered = filtered.filter(c => c.class_date === selectedDate);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => {
        const current = c.currentBookings || 0;
        const percentage = (current / c.capacity) * 100;
        
        if (selectedStatus === 'available') return percentage < 100;
        if (selectedStatus === 'full') return percentage >= 100;
        return true;
      });
    }
    
    // Search by ID
    if (searchId.trim()) {
      const query = searchId.trim().toLowerCase();
      filtered = filtered.filter(c => c.id.toLowerCase().includes(query));
    }
    
    return filtered;
  }, [generatedCourses, selectedMonth, selectedDate, selectedStatus, searchId]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedDate, selectedStatus, searchId]);

  const totalPages = Math.max(1, Math.ceil(upcomingCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = upcomingCourses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = upcomingCourses.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, upcomingCourses.length);

  const pageNumbers = useMemo(() => {
    const buttons: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) {
      buttons.push(i);
    }
    return buttons;
  }, [page, totalPages]);

  const handlePageChange = (next: number) => {
    setPage(Math.max(1, Math.min(totalPages, next)));
  };

  const handleClearFilters = () => {
    setSearchId('');
    setSelectedMonth('all');
    setSelectedDate('');
    setSelectedStatus('all');
  };

  const hasActiveFilters = searchId.trim() !== '' || selectedMonth !== 'all' || selectedDate !== '' || selectedStatus !== 'all';

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    generatedCourses.forEach(c => {
      const month = new Date(c.class_date).toISOString().slice(0, 7);
      months.add(month);
    });
    return Array.from(months).sort();
  }, [generatedCourses]);

  const formatMonthLabel = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCourseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return { label: 'Full', color: 'destructive' };
    return { label: 'Available', color: 'success' };
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="max-w-[90%] mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-light flex items-center gap-3" style={{ color: '#3d2817' }}>
              <ChefHat className="w-10 h-10" style={{ color: '#b29373' }} />
              Dashboard
            </h1>
            <p className="text-sm mt-2" style={{ color: '#8b6f47' }}>
              Overview of your Thai cooking class bookings and revenue
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow border" style={{ borderColor: '#e5dcd4' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>Total Bookings</p>
                <h3 className="text-3xl font-light mt-2" style={{ color: '#3d2817' }}>{stats.totalBookings}</h3>
                <p className="text-xs mt-1" style={{ color: '#b29373' }}>Out of {stats.totalCapacity} total seats</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f4f8' }}>
                <Users className="w-6 h-6" style={{ color: '#5ba4c7' }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow border" style={{ borderColor: '#e5dcd4' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>Expected Revenue</p>
                <h3 className="text-3xl font-light mt-2" style={{ color: '#3d2817' }}>{formatPrice(stats.totalRevenue)}</h3>
                <p className="text-xs mt-1" style={{ color: '#b29373' }}>From confirmed bookings</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#66bb6a' }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow border" style={{ borderColor: '#e5dcd4' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>Scheduled Courses</p>
                <h3 className="text-3xl font-light mt-2" style={{ color: '#3d2817' }}>{stats.totalCourses}</h3>
                <p className="text-xs mt-1" style={{ color: '#b29373' }}>Next 4 weeks</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3e5f5' }}>
                <Calendar className="w-6 h-6" style={{ color: '#ab47bc' }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow border" style={{ borderColor: '#e5dcd4' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>Total Customers</p>
                <h3 className="text-3xl font-light mt-2" style={{ color: '#3d2817' }}>{stats.totalBookings}</h3>
                <p className="text-xs mt-1 font-medium" style={{ color: '#e67700' }}>
                  {stats.nearlyFull} courses nearly full
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff4e6' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#e67700' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Courses Table */}
        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e5dcd4' }}>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-light" style={{ color: '#3d2817' }}>Upcoming Courses</h2>
                <p className="text-sm mt-1" style={{ color: '#8b6f47' }}>Next scheduled classes with booking status</p>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search ID */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Search by Course ID..."
                      className="w-full border pl-9 pr-4 py-2 text-sm"
                      style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa', color: '#3d2817' }}
                    />
                  </div>

                  {/* Month Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 flex-shrink-0" style={{ color: '#b29373' }} />
                    <select 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full border px-3 py-2 text-sm"
                      style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa', color: '#3d2817' }}
                    >
                      <option value="all">All Months</option>
                      {availableMonths.map(month => (
                        <option key={month} value={month}>
                          {formatMonthLabel(month)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#b29373' }} />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border px-3 py-2 text-sm"
                      style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa', color: '#3d2817' }}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#b29373' }} />
                    <select 
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full border px-3 py-2 text-sm"
                      style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa', color: '#3d2817' }}
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="filling">Filling Up</option>
                      <option value="almost-full">Almost Full</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs border hover:bg-[#f5f1ed] transition-colors"
                      style={{ borderColor: '#e5dcd4', color: '#8b6f47' }}
                    >
                      <X size={14} />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border" style={{ borderColor: '#f1e6db' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f9f5f0' }}>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Course ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Course Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Capacity
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]" style={{ color: '#8b6f47' }}>
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course) => {
                  const currentBookings = course.currentBookings || 0;
                  const status = getCapacityStatus(currentBookings, course.capacity);
                  const percentage = Math.round((currentBookings / course.capacity) * 100);

                  return (
                    <tr 
                      key={course.id} 
                      className="border-t hover:bg-[#fffaf4] cursor-pointer" 
                      style={{ borderColor: '#f1e6db' }}
                      onClick={() => setModalCourse(course)}
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="text-sm font-medium" style={{ color: '#3d2817' }}>{course.id}</div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium" style={{ color: '#3d2817' }}>{course.session}</div>
                            <div className="text-xs" style={{ color: '#8b6f47' }}>
                              {course.detail.replace(/<[^>]*>/g, '').replace(/•/g, '').trim().split('\n').filter(Boolean).join(', ')}
                            </div>
                          </div>
                          {course.tag && (
                            <span className="px-2 py-0.5 text-xs font-medium border rounded" style={{
                              backgroundColor: '#f3e5f5',
                              color: '#ab47bc',
                              borderColor: '#ce93d8'
                            }}>
                              {course.tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#3d2817' }}>
                            <Calendar className="w-4 h-4" style={{ color: '#b29373' }} />
                            {formatDate(course.class_date)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8b6f47' }}>
                            <Clock className="w-3 h-3" style={{ color: '#b29373' }} />
                            {course.start_time} - {course.end_time}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4" style={{ color: '#b29373' }} />
                          <span className="text-sm font-medium" style={{ color: '#3d2817' }}>
                            {currentBookings} / {course.capacity}
                          </span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#e5dcd4' }}>
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: '#5ba4c7'
                            }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#8b6f47' }}>{percentage}%</div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded border`} style={{
                          backgroundColor: status.color === 'destructive' ? '#fde8e4' : '#e8f5e9',
                          color: status.color === 'destructive' ? '#c1513b' : '#2e7d32',
                          borderColor: status.color === 'destructive' ? '#f5b8ad' : '#a5d6a7'
                        }}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <div className="text-sm font-medium" style={{ color: '#3d2817' }}>{formatPrice(course.price)}</div>
                        <div className="text-xs" style={{ color: '#8b6f47' }}>{formatPrice(course.price * currentBookings)} booked</div>
                      </td>
                    </tr>
                  );
                })}
                {upcomingCourses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                      <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#d3c5b6' }} />
                      No upcoming courses scheduled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs px-4 py-4" style={{ color: '#8b6f47' }}>
            <span>
              <p className="text-xs" style={{ color: '#8b6f47' }}>
                {upcomingCourses.length > 0
                  ? `Showing ${startItem}-${endItem} of ${upcomingCourses.length}`
                  : 'No matching courses'}
              </p>
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border text-xs"
                style={{ borderColor: '#f1e6db', color: page === 1 ? '#d3c5b6' : '#b6a188' }}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className="px-3 py-1 border text-xs"
                  style={{
                    borderColor: num === page ? '#3d2817' : '#f1e6db',
                    backgroundColor: num === page ? '#3d2817' : '#fff',
                    color: num === page ? '#fff' : '#3d2817'
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                className="px-3 py-1 border text-xs"
                style={{ borderColor: '#f1e6db', color: page === totalPages ? '#d3c5b6' : '#b6a188' }}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Course Detail Modal */}
      {modalCourse && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalCourse(null)}
        >
          <div 
            className="bg-white shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: '#e5dcd4' }}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between" style={{ borderColor: '#e5dcd4' }}>
              <div>
                <p className="text-xs uppercase tracking-[0.3em]" style={{ color: '#b29373' }}>
                  Course details
                </p>
                <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                  {formatCourseDate(modalCourse.class_date)}
                </h3>
              </div>
              <button
                onClick={() => setModalCourse(null)}
                className="p-2 hover:bg-[#f5f1ed] transition"
              >
                <X size={24} style={{ color: '#8b6f47' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div
                className="border p-5 space-y-4"
                style={{ borderColor: '#f1e6db', backgroundColor: '#fffdf8' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-medium" style={{ color: '#3d2817' }}>
                        {modalCourse.session}
                      </h4>
                      {modalCourse.tag && (
                        <span className="text-xs uppercase tracking-wide px-2 py-1" style={{ backgroundColor: '#f5d5d5', color: '#c1513b' }}>
                          {modalCourse.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#8b6f47' }}>
                      <Clock size={16} />
                      <span>{modalCourse.start_time} – {modalCourse.end_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 text-sm pt-2 border-t" style={{ borderColor: '#f1e6db', color: '#7a5f3d' }}>
                  <div>
                    <span className="text-xs uppercase tracking-wide block mb-1" style={{ color: '#b29373' }}>
                      Capacity
                    </span>
                    <span className="font-medium">{modalCourse.capacity} people</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide block mb-1" style={{ color: '#b29373' }}>
                      Price
                    </span>
                    <span className="font-medium">{formatPrice(modalCourse.price)}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide block mb-1" style={{ color: '#b29373' }}>
                      Current Bookings
                    </span>
                    <span className="font-medium">{modalCourse.currentBookings || 0} / {modalCourse.capacity}</span>
                  </div>
                </div>

                {modalCourse.detail && (
                  <div className="pt-2 border-t" style={{ borderColor: '#f1e6db' }}>
                    <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#b29373' }}>
                      Menu
                    </p>
                    <div
                      className="text-sm"
                      style={{ color: '#3d2817' }}
                      dangerouslySetInnerHTML={{ __html: modalCourse.detail }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end" style={{ borderColor: '#e5dcd4' }}>
              <button
                onClick={() => setModalCourse(null)}
                className="px-6 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: '#3d2817' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
module.exports = [
"[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ManageCourses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-ssr] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Downloads/thaicookingclasses/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
'use client';
;
;
;
const DAY_LABELS = {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun'
};
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
const SLOT_METADATA = {
    morning: {
        label: 'เช้า',
        start: '09:00',
        end: '12:30',
        description: 'รวมเวลาซื้อวัตถุดิบและเตรียมอุปกรณ์ร่วมกัน'
    },
    afternoon: {
        label: 'บ่าย',
        start: '14:00',
        end: '17:30',
        description: 'ปรุง-ชิม-ถ่ายภาพ พร้อมทานมื้อบ่ายร่วมกัน'
    }
};
const SECTION_LABEL = {
    main: 'จานหลัก',
    dessert: 'ของหวาน'
};
const createId = ()=>Math.random().toString(36).slice(2, 10);
const createInitialColumns = ()=>[
        {
            id: createId(),
            day: 'Mon',
            themeLabel: 'Veggi',
            accentColor: '#2b9348',
            capacity: 12,
            price: 1800,
            slots: {
                morning: {
                    main: [
                        'tom-yum-goong'
                    ],
                    dessert: [
                        'banana-coconut-milk'
                    ]
                },
                afternoon: {
                    main: [
                        'pad-thai'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                }
            }
        },
        {
            id: createId(),
            day: 'Tue',
            themeLabel: 'Veggi',
            accentColor: '#2b9348',
            capacity: 12,
            price: 1800,
            slots: {
                morning: {
                    main: [
                        'tom-kha-hed'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                },
                afternoon: {
                    main: [
                        'krapao-mushroom',
                        'crispy-tofu-tamarind'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                }
            }
        },
        {
            id: createId(),
            day: 'Wed',
            themeLabel: 'Zero waste',
            accentColor: '#55a630',
            capacity: 10,
            price: 1900,
            slots: {
                morning: {
                    main: [
                        'tom-yum-goong',
                        'green-curry-chicken'
                    ],
                    dessert: [
                        'fried-banana'
                    ]
                },
                afternoon: {
                    main: [
                        'grilled-chicken-sticky'
                    ],
                    dessert: [
                        'fried-banana'
                    ]
                }
            }
        },
        {
            id: createId(),
            day: 'Thu',
            themeLabel: 'Veggi',
            accentColor: '#2b9348',
            capacity: 12,
            price: 1800,
            slots: {
                morning: {
                    main: [
                        'pad-see-ew',
                        'tom-kha-chicken',
                        'fried-spring-roll'
                    ],
                    dessert: [
                        'banana-coconut-milk'
                    ]
                },
                afternoon: {
                    main: [
                        'pad-thai',
                        'tom-yum-goong',
                        'laab-chicken'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                }
            }
        },
        {
            id: createId(),
            day: 'Fri',
            themeLabel: 'Veggi',
            accentColor: '#2b9348',
            capacity: 14,
            price: 1850,
            slots: {
                morning: {
                    main: [
                        'krapao-chicken',
                        'green-curry-chicken',
                        'yum-woon-sen'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                },
                afternoon: {
                    main: [
                        'fried-rice',
                        'panang-chicken',
                        'fried-chicken-fish-sauce'
                    ],
                    dessert: [
                        'banana-coconut-milk'
                    ]
                }
            }
        },
        {
            id: createId(),
            day: 'Sun',
            themeLabel: 'Veggi',
            accentColor: '#2b9348',
            capacity: 10,
            price: 1750,
            slots: {
                morning: {
                    main: [
                        'pad-thai',
                        'tom-yum-chicken',
                        'krapao-chicken'
                    ],
                    dessert: [
                        'banana-coconut-milk'
                    ]
                },
                afternoon: {
                    main: [
                        'pad-see-ew',
                        'tom-yum-goong',
                        'fried-spring-roll'
                    ],
                    dessert: [
                        'sticky-mango'
                    ]
                }
            }
        }
    ];
const createInitialSmallEvents = ()=>[
        {
            id: createId(),
            start: '09:30',
            end: '11:00',
            dishes: [
                'ผัดไท',
                'ผัดซีอิ๊ว'
            ]
        },
        {
            id: createId(),
            start: '13:00',
            end: '14:30',
            dishes: [
                'แกงเขียวหวานไก่',
                'แพนงไก่'
            ]
        },
        {
            id: createId(),
            start: '16:30',
            end: '17:00',
            dishes: [
                'ต้มยำกุ้ง',
                'กระเพราไก่'
            ]
        }
    ];
const getCurrentWeekMonday = ()=>{
    const today = new Date();
    const day = today.getDay(); // 0 = Sun
    const diff = (day + 6) % 7;
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - diff);
    return today.toISOString().split('T')[0];
};
const formatDateRange = (start)=>{
    if (!start) return 'เลือกวันที่เริ่มต้น';
    const from = new Date(`${start}T00:00:00`);
    const to = new Date(from);
    to.setDate(to.getDate() + 6);
    const format = (date)=>date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short'
        });
    return `${format(from)} - ${format(to)}`;
};
const getDateForDay = (startDate, day)=>{
    if (!startDate) return '';
    const base = new Date(`${startDate}T00:00:00`);
    const offset = DAY_OFFSETS[day] ?? 0;
    const target = new Date(base);
    target.setDate(base.getDate() + offset);
    return target.toISOString().split('T')[0];
};
const getMenuNames = (ids, menuMap)=>ids.map((id)=>menuMap.get(id)?.nameTh || 'เมนูถูกลบ').filter((name)=>Boolean(name));
const joinMenusForCell = (ids, menuMap)=>{
    const names = getMenuNames(ids, menuMap);
    return names.length ? names.slice(0, 3).join(' • ') : '—';
};
const buildDetailHTML = (slot, menuMap)=>{
    const blocks = [];
    const mainNames = getMenuNames(slot.main, menuMap);
    const dessertNames = getMenuNames(slot.dessert, menuMap);
    if (mainNames.length) {
        blocks.push(`<strong>จานหลัก</strong><ul>${mainNames.map((item)=>`<li>${item}</li>`).join('')}</ul>`);
    }
    if (dessertNames.length) {
        blocks.push(`<strong>ของหวาน</strong><ul>${dessertNames.map((item)=>`<li>${item}</li>`).join('')}</ul>`);
    }
    return blocks.join('');
};
const buildEventDetail = (dishes)=>dishes.length ? `<ul>${dishes.map((dish)=>`<li>${dish}</li>`).join('')}</ul>` : '';
const linesFromItems = (items)=>items.join('\n');
const itemsFromLines = (value)=>value.split('\n').map((line)=>line.trim()).filter(Boolean);
const formatCourseDate = (dateStr)=>{
    if (!dateStr) return 'ยังไม่มีวันที่';
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('th-TH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
};
function ManageCourses() {
    const [weekAnchor, setWeekAnchor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getCurrentWeekMonday);
    const [dayColumns, setDayColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(createInitialColumns);
    const [smallEvents, setSmallEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(createInitialSmallEvents);
    const [selectedCell, setSelectedCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeColumnId, setActiveColumnId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const generatedCourses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!weekAnchor) return [];
        const slotOrder = [
            'morning',
            'afternoon'
        ];
        const gridCourses = dayColumns.flatMap((column)=>{
            return slotOrder.map((slotKey)=>{
                const slot = column.slots[slotKey];
                if (!slot.main.length && !slot.dessert.length) {
                    return null;
                }
                const classDate = getDateForDay(weekAnchor, column.day);
                return {
                    id: `${column.id}-${slotKey}`,
                    class_date: classDate,
                    session: `${column.themeLabel} ${DAY_NAMES[column.day]} (${SLOT_METADATA[slotKey].label})`,
                    start_time: SLOT_METADATA[slotKey].start,
                    end_time: SLOT_METADATA[slotKey].end,
                    capacity: column.capacity,
                    price: column.price,
                    detail: buildDetailHTML(slot)
                };
            }).filter(Boolean);
        });
        const saturdayDate = getDateForDay(weekAnchor, 'Sat');
        const saturdayCourses = smallEvents.map((event)=>{
            if (!event.dishes.length) return null;
            const detail = buildEventDetail(event.dishes);
            return {
                id: `sat-${event.id}`,
                class_date: saturdayDate,
                session: `Small class (${event.start} - ${event.end || event.start})`,
                start_time: event.start,
                end_time: event.end || event.start,
                capacity: 6,
                price: 2200,
                detail,
                tag: 'Small class'
            };
        }).filter(Boolean);
        return [
            ...gridCourses,
            ...saturdayCourses
        ];
    }, [
        dayColumns,
        smallEvents,
        weekAnchor
    ]);
    const selectedColumn = selectedCell ? dayColumns.find((col)=>col.id === selectedCell.columnId) : null;
    const activeColumn = activeColumnId ? dayColumns.find((col)=>col.id === activeColumnId) : null;
    const handleUpdateColumn = (columnId, next)=>{
        setDayColumns((prev)=>prev.map((col)=>col.id === columnId ? {
                    ...col,
                    ...next
                } : col));
    };
    const handleAddColumn = ()=>{
        const newColumn = {
            id: createId(),
            day: 'Mon',
            themeLabel: 'New program',
            accentColor: '#c47f47',
            capacity: 10,
            price: 1600,
            slots: {
                morning: {
                    main: [],
                    dessert: []
                },
                afternoon: {
                    main: [],
                    dessert: []
                }
            }
        };
        setDayColumns((prev)=>[
                ...prev,
                newColumn
            ]);
        setActiveColumnId(newColumn.id);
    };
    const handleRemoveColumn = (columnId)=>{
        setDayColumns((prev)=>prev.filter((col)=>col.id !== columnId));
        if (selectedCell?.columnId === columnId) {
            setSelectedCell(null);
        }
        if (activeColumnId === columnId) {
            setActiveColumnId(null);
        }
    };
    const updateMenusInCell = (nextMenus)=>{
        if (!selectedCell || !selectedColumn) return;
        setDayColumns((prev)=>prev.map((col)=>{
                if (col.id !== selectedColumn.id) return col;
                return {
                    ...col,
                    slots: {
                        ...col.slots,
                        [selectedCell.slotKey]: {
                            ...col.slots[selectedCell.slotKey],
                            [selectedCell.section]: nextMenus
                        }
                    }
                };
            }));
    };
    const handleClearCell = ()=>{
        updateMenusInCell([]);
    };
    const handleEventChange = (id, payload)=>{
        setSmallEvents((prev)=>prev.map((event)=>event.id === id ? {
                    ...event,
                    ...payload
                } : event));
    };
    const handleAddEvent = ()=>{
        const newEvent = {
            id: createId(),
            start: '09:30',
            end: '11:00',
            dishes: []
        };
        setSmallEvents((prev)=>[
                ...prev,
                newEvent
            ]);
    };
    const handleRemoveEvent = (id)=>{
        setSmallEvents((prev)=>prev.filter((event)=>event.id !== id));
    };
    const handleAddMenuToCell = (menuId)=>{
        if (!selectedCell || !selectedColumn || !menuId) return;
        const currentMenus = selectedColumn.slots[selectedCell.slotKey][selectedCell.section];
        if (currentMenus.includes(menuId)) return;
        updateMenusInCell([
            ...currentMenus,
            menuId
        ]);
    };
    const handleRemoveMenuFromCell = (menuId)=>{
        if (!selectedCell || !selectedColumn) return;
        const currentMenus = selectedColumn.slots[selectedCell.slotKey][selectedCell.section];
        updateMenusInCell(currentMenus.filter((id)=>id !== menuId));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen py-10",
        style: {
            backgroundColor: '#f5f1ed'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[95%] mx-auto space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "uppercase tracking-[0.3em] text-xs",
                                    style: {
                                        color: '#8b6f47'
                                    },
                                    children: "Thai cooking studio"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-light",
                                    style: {
                                        color: '#3d2817'
                                    },
                                    children: "Weekly course scheduler"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 497,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm mt-2 max-w-2xl",
                                    style: {
                                        color: '#7a5f3d'
                                    },
                                    children: "ปรับตารางตามช่วงเวลา/วัน/ประเภทอาหารได้อิสระ แล้วระบบจะสร้างรายวิชาที่ตรงกับตารางอัตโนมัติ"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 493,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex items-center gap-3 px-4 py-2 rounded-xl border bg-white shadow-sm",
                            style: {
                                borderColor: '#e5dcd4'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                    size: 18,
                                    style: {
                                        color: '#8b6f47'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 505,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs uppercase tracking-wide",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "วันที่เริ่มต้นสัปดาห์ (จันทร์)"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 507,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: weekAnchor,
                                            onChange: (e)=>setWeekAnchor(e.target.value),
                                            className: "text-base focus:outline-none",
                                            style: {
                                                color: '#3d2817'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 510,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 506,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 504,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 492,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-2xl shadow border",
                    style: {
                        borderColor: '#e5dcd4'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 px-6 py-5 border-b",
                            style: {
                                borderColor: '#e5dcd4'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs uppercase tracking-[0.3em]",
                                                    style: {
                                                        color: '#b29373'
                                                    },
                                                    children: "Veggi · Zero waste · Classics"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-light",
                                                    style: {
                                                        color: '#3d2817'
                                                    },
                                                    children: "ตารางหลัก (Mon–Sun)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 528,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 524,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleAddColumn,
                                            className: "inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition",
                                            style: {
                                                backgroundColor: '#3d2817',
                                                color: '#fff'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 17
                                                }, this),
                                                " เพิ่มคอลัมน์"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 532,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 523,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    style: {
                                        color: '#7a5f3d'
                                    },
                                    children: "กำหนดเมนูสำหรับแต่ละช่วงเวลาโดยคลิกที่ช่อง แล้วแก้ไขรายการได้ทันที"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 540,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 522,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                backgroundColor: '#f5f1ed',
                                                borderBottom: '1px solid #e5dcd4'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left font-light uppercase text-[11px]",
                                                    style: {
                                                        color: '#8b6f47'
                                                    },
                                                    children: "เวลาคลาส"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left font-light uppercase text-[11px]",
                                                    style: {
                                                        color: '#8b6f47'
                                                    },
                                                    children: "ประเภทอาหาร"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 19
                                                }, this),
                                                dayColumns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left font-light uppercase text-[11px]",
                                                        style: {
                                                            color: '#8b6f47'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] uppercase tracking-wide block",
                                                                            style: {
                                                                                color: column.accentColor
                                                                            },
                                                                            children: column.themeLabel
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 559,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-base font-normal",
                                                                            style: {
                                                                                color: '#3d2817'
                                                                            },
                                                                            children: DAY_LABELS[column.day]
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 562,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                    lineNumber: 558,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveColumnId((prev)=>prev === column.id ? null : column.id),
                                                                    className: "p-1 rounded hover:bg-[#efe4da]",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                        lineNumber: 574,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, column.id, false, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 548,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                        lineNumber: 547,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: Object.keys(SLOT_METADATA).map((slotKey)=>{
                                            const slotMeta = SLOT_METADATA[slotKey];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "border-t",
                                                        style: {
                                                            borderColor: '#f1e6db'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 align-top font-medium",
                                                                rowSpan: 2,
                                                                style: {
                                                                    color: '#3d2817',
                                                                    width: '160px'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-start gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                            size: 16,
                                                                            className: "mt-1",
                                                                            style: {
                                                                                color: '#b29373'
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 593,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-base font-light",
                                                                                    children: slotMeta.label
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                                    lineNumber: 595,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm",
                                                                                    style: {
                                                                                        color: '#8b6f47'
                                                                                    },
                                                                                    children: [
                                                                                        slotMeta.start,
                                                                                        " – ",
                                                                                        slotMeta.end
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                                    lineNumber: 596,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs mt-1",
                                                                                    style: {
                                                                                        color: '#b29373'
                                                                                    },
                                                                                    children: slotMeta.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                                    lineNumber: 599,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 594,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 587,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 font-medium",
                                                                style: {
                                                                    color: '#8b6f47',
                                                                    width: '120px'
                                                                },
                                                                children: SECTION_LABEL.main
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 605,
                                                                columnNumber: 25
                                                            }, this),
                                                            dayColumns.map((column)=>{
                                                                const slot = column.slots[slotKey];
                                                                const isSelected = selectedCell && selectedCell.columnId === column.id && selectedCell.slotKey === slotKey && selectedCell.section === 'main';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    onClick: ()=>setSelectedCell({
                                                                            columnId: column.id,
                                                                            slotKey,
                                                                            section: 'main'
                                                                        }),
                                                                    className: `align-top px-4 py-3 border-l cursor-pointer transition text-sm ${isSelected ? 'bg-[#fff7ef]' : 'hover:bg-[#fdf6ef]'}`,
                                                                    style: {
                                                                        borderColor: '#f1e6db'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            style: {
                                                                                color: '#3d2817'
                                                                            },
                                                                            children: joinForCell(slot.main)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 630,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] mt-1",
                                                                            style: {
                                                                                color: '#b29373'
                                                                            },
                                                                            children: [
                                                                                slot.main.length,
                                                                                " รายการ"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 633,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, `${column.id}-${slotKey}-main`, true, {
                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                    lineNumber: 616,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 586,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "border-t",
                                                        style: {
                                                            borderColor: '#f1e6db'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 font-medium",
                                                                style: {
                                                                    color: '#8b6f47'
                                                                },
                                                                children: SECTION_LABEL.dessert
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 25
                                                            }, this),
                                                            dayColumns.map((column)=>{
                                                                const slot = column.slots[slotKey];
                                                                const isSelected = selectedCell && selectedCell.columnId === column.id && selectedCell.slotKey === slotKey && selectedCell.section === 'dessert';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    onClick: ()=>setSelectedCell({
                                                                            columnId: column.id,
                                                                            slotKey,
                                                                            section: 'dessert'
                                                                        }),
                                                                    className: `align-top px-4 py-3 border-l cursor-pointer transition text-sm ${isSelected ? 'bg-[#fff7ef]' : 'hover:bg-[#fdf6ef]'}`,
                                                                    style: {
                                                                        borderColor: '#f1e6db'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            style: {
                                                                                color: '#3d2817'
                                                                            },
                                                                            children: joinForCell(slot.dessert)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 666,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] mt-1",
                                                                            style: {
                                                                                color: '#b29373'
                                                                            },
                                                                            children: [
                                                                                slot.dessert.length,
                                                                                " รายการ"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                            lineNumber: 669,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, `${column.id}-${slotKey}-dessert`, true, {
                                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                    lineNumber: 652,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 640,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, slotKey, true, {
                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                lineNumber: 585,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                lineNumber: 546,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 545,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 521,
                    columnNumber: 9
                }, this),
                activeColumn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-2xl shadow border px-6 py-6",
                    style: {
                        borderColor: '#e5dcd4'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-[0.3em]",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "ตั้งค่าคอลัมน์"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 688,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-light",
                                            style: {
                                                color: '#3d2817'
                                            },
                                            children: [
                                                activeColumn.themeLabel,
                                                " · ",
                                                DAY_NAMES[activeColumn.day]
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 691,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveColumnId(null),
                                    className: "text-sm underline",
                                    style: {
                                        color: '#8b6f47'
                                    },
                                    children: "ปิด"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 695,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 686,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 md:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs uppercase tracking-wide block mb-1",
                                            style: {
                                                color: '#8b6f47'
                                            },
                                            children: "Day"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 705,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: activeColumn.day,
                                            onChange: (e)=>handleUpdateColumn(activeColumn.id, {
                                                    day: e.target.value
                                                }),
                                            className: "w-full border rounded-lg px-3 py-2",
                                            style: {
                                                borderColor: '#e5dcd4'
                                            },
                                            children: [
                                                'Mon',
                                                'Tue',
                                                'Wed',
                                                'Thu',
                                                'Fri',
                                                'Sun'
                                            ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: day,
                                                    children: DAY_NAMES[day]
                                                }, day, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 719,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 708,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 704,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs uppercase tracking-wide block mb-1",
                                            style: {
                                                color: '#8b6f47'
                                            },
                                            children: "Theme label"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 726,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: activeColumn.themeLabel,
                                            onChange: (e)=>handleUpdateColumn(activeColumn.id, {
                                                    themeLabel: e.target.value
                                                }),
                                            className: "w-full border rounded-lg px-3 py-2",
                                            style: {
                                                borderColor: '#e5dcd4'
                                            },
                                            placeholder: "Veggi / Zero waste"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 729,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 725,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs uppercase tracking-wide block mb-1",
                                            style: {
                                                color: '#8b6f47'
                                            },
                                            children: "Accent color"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 741,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: activeColumn.accentColor,
                                            onChange: (e)=>handleUpdateColumn(activeColumn.id, {
                                                    accentColor: e.target.value
                                                }),
                                            className: "w-full h-10 border rounded-lg",
                                            style: {
                                                borderColor: '#e5dcd4'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 744,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 740,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs uppercase tracking-wide block mb-1",
                                                    style: {
                                                        color: '#8b6f47'
                                                    },
                                                    children: "Capacity"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 756,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: activeColumn.capacity,
                                                    onChange: (e)=>handleUpdateColumn(activeColumn.id, {
                                                            capacity: Number(e.target.value) || 0
                                                        }),
                                                    className: "w-full border rounded-lg px-3 py-2",
                                                    style: {
                                                        borderColor: '#e5dcd4'
                                                    },
                                                    min: 0
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 759,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs uppercase tracking-wide block mb-1",
                                                    style: {
                                                        color: '#8b6f47'
                                                    },
                                                    children: "Price (฿)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: activeColumn.price,
                                                    onChange: (e)=>handleUpdateColumn(activeColumn.id, {
                                                            price: Number(e.target.value) || 0
                                                        }),
                                                    className: "w-full border rounded-lg px-3 py-2",
                                                    style: {
                                                        borderColor: '#e5dcd4'
                                                    },
                                                    min: 0
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 772,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 754,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 703,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end mt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleRemoveColumn(activeColumn.id),
                                className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition",
                                style: {
                                    color: '#c1513b',
                                    border: '1px solid #f0c7bf'
                                },
                                disabled: dayColumns.length === 1,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                        lineNumber: 798,
                                        columnNumber: 17
                                    }, this),
                                    "ลบคอลัมน์นี้"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                lineNumber: 792,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 791,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 685,
                    columnNumber: 11
                }, this),
                selectedCell && selectedColumn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-2xl shadow border px-6 py-6",
                    style: {
                        borderColor: '#e5dcd4'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-[0.3em]",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "แก้ไขเมนู"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 809,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-light",
                                            style: {
                                                color: '#3d2817'
                                            },
                                            children: [
                                                selectedColumn.themeLabel,
                                                " · ",
                                                DAY_NAMES[selectedColumn.day],
                                                " ·",
                                                ' ',
                                                SLOT_METADATA[selectedCell.slotKey].label,
                                                " · ",
                                                SECTION_LABEL[selectedCell.section]
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 812,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 808,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCell(null),
                                    className: "text-sm underline",
                                    style: {
                                        color: '#8b6f47'
                                    },
                                    children: "ปิด"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 817,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 807,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: selectedValue,
                            onChange: (e)=>handleCellValueChange(e.target.value),
                            rows: 6,
                            className: "w-full border rounded-xl px-4 py-3 font-mono text-sm",
                            style: {
                                borderColor: '#e5dcd4',
                                backgroundColor: '#fffdfa'
                            },
                            placeholder: "พิมพ์ 1 รายการต่อบรรทัด เช่น ต้มยำกุ้ง ผัดไท"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 825,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mt-3 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#7a5f3d'
                                    },
                                    children: "เคล็ดลับ: ใช้ Enter แยกรายการ, เว้นว่างหากยังไม่กำหนดเมนู"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 834,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleClearCell,
                                            className: "px-3 py-1 rounded-md text-sm",
                                            style: {
                                                backgroundColor: '#f5f1ed',
                                                color: '#8b6f47'
                                            },
                                            children: "ลบข้อมูล"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 836,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedCell(null),
                                            className: "px-4 py-1 rounded-md text-sm text-white",
                                            style: {
                                                backgroundColor: '#3d2817'
                                            },
                                            children: "เสร็จสิ้น"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 843,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 835,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 833,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 806,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-2xl shadow border px-6 py-6",
                    style: {
                        borderColor: '#e5dcd4'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between flex-wrap gap-3 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-[0.3em]",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "Sat; small class event"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 858,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-light",
                                            style: {
                                                color: '#3d2817'
                                            },
                                            children: "ตารางพิเศษวันเสาร์ (small class)"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 861,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 857,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddEvent,
                                    className: "inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition",
                                    style: {
                                        backgroundColor: '#3d2817',
                                        color: '#fff'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 870,
                                            columnNumber: 15
                                        }, this),
                                        " เพิ่มช่วงเวลา"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 865,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 856,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                smallEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-2xl px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center",
                                        style: {
                                            borderColor: '#f1e6db',
                                            backgroundColor: '#fffdfa'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs uppercase tracking-wide block mb-1",
                                                                style: {
                                                                    color: '#8b6f47'
                                                                },
                                                                children: "Start"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 882,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: event.start,
                                                                onChange: (e)=>handleEventChange(event.id, {
                                                                        start: e.target.value
                                                                    }),
                                                                className: "border rounded-lg px-3 py-2",
                                                                style: {
                                                                    borderColor: '#e5dcd4'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 885,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs uppercase tracking-wide block mb-1",
                                                                style: {
                                                                    color: '#8b6f47'
                                                                },
                                                                children: "End"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 894,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: event.end,
                                                                onChange: (e)=>handleEventChange(event.id, {
                                                                        end: e.target.value
                                                                    }),
                                                                className: "border rounded-lg px-3 py-2",
                                                                style: {
                                                                    borderColor: '#e5dcd4'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                                lineNumber: 897,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 893,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleRemoveEvent(event.id),
                                                        className: "p-2 rounded-full hover:bg-[#f3dfd7] transition",
                                                        style: {
                                                            color: '#c1513b'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                            lineNumber: 910,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                lineNumber: 880,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs uppercase tracking-wide block mb-1",
                                                        style: {
                                                            color: '#8b6f47'
                                                        },
                                                        children: "เมนู (1 รายการ/บรรทัด)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 914,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        rows: 3,
                                                        value: linesFromItems(event.dishes),
                                                        onChange: (e)=>handleEventChange(event.id, {
                                                                dishes: itemsFromLines(e.target.value)
                                                            }),
                                                        className: "w-full border rounded-xl px-4 py-2 text-sm font-mono",
                                                        style: {
                                                            borderColor: '#e5dcd4',
                                                            backgroundColor: '#fff'
                                                        },
                                                        placeholder: "ผัดไท แกงเขียวหวานไก่"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                        lineNumber: 917,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                lineNumber: 913,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, event.id, true, {
                                        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                        lineNumber: 875,
                                        columnNumber: 15
                                    }, this)),
                                smallEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-6 text-center rounded-2xl border text-sm",
                                    style: {
                                        borderColor: '#f1e6db',
                                        color: '#8b6f47'
                                    },
                                    children: "ยังไม่มีช่วงเวลาพิเศษ เพิ่มช่วงเวลาสำหรับ small class ได้ตามต้องการ"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 931,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 873,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 855,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-2xl shadow border px-6 py-6",
                    style: {
                        borderColor: '#e5dcd4'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-[0.3em]",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "Auto generated"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 944,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-light",
                                            style: {
                                                color: '#3d2817'
                                            },
                                            children: "รายการคอร์สตามตาราง"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 947,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 943,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm flex items-center gap-2",
                                    style: {
                                        color: '#8b6f47'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 952,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatDateRange(weekAnchor)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 953,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 951,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 942,
                            columnNumber: 11
                        }, this),
                        generatedCourses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border rounded-2xl px-4 py-6 text-center text-sm",
                            style: {
                                borderColor: '#f1e6db',
                                color: '#8b6f47'
                            },
                            children: "กำหนดเมนูในตารางหลักหรือ small class เพื่อดูตัวอย่างคอร์สที่สร้างอัตโนมัติ"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 957,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 md:grid-cols-2",
                            children: generatedCourses.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-2xl px-4 py-4 flex flex-col gap-2",
                                    style: {
                                        borderColor: '#f1e6db',
                                        backgroundColor: '#fffdf8'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-base font-medium",
                                                    style: {
                                                        color: '#3d2817'
                                                    },
                                                    children: course.session
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 969,
                                                    columnNumber: 21
                                                }, this),
                                                course.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full",
                                                    style: {
                                                        backgroundColor: '#f5d5d5',
                                                        color: '#c1513b'
                                                    },
                                                    children: course.tag
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 968,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            style: {
                                                color: '#8b6f47'
                                            },
                                            children: [
                                                formatCourseDate(course.class_date),
                                                " · ",
                                                course.start_time,
                                                " – ",
                                                course.end_time
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 978,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4 text-sm",
                                            style: {
                                                color: '#7a5f3d'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Capacity: ",
                                                        course.capacity,
                                                        " คน"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 982,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "฿",
                                                        course.price
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                                    lineNumber: 983,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 981,
                                            columnNumber: 19
                                        }, this),
                                        course.detail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm space-y-1",
                                            style: {
                                                color: '#3d2817'
                                            },
                                            dangerouslySetInnerHTML: {
                                                __html: course.detail
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 986,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$thaicookingclasses$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm italic",
                                            style: {
                                                color: '#b29373'
                                            },
                                            children: "ยังไม่ระบุรายละเอียดเมนู"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                            lineNumber: 992,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, course.id, true, {
                                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                                    lineNumber: 963,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                            lineNumber: 961,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
                    lineNumber: 941,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
            lineNumber: 491,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/thaicookingclasses/app/admin/course/page.tsx",
        lineNumber: 490,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Downloads_thaicookingclasses_app_admin_course_page_tsx_a560ed3b._.js.map
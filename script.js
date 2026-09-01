// Data storage
let teachers = [];
let constraints = [];
let schedule = [];
let templateSlots = [];
let templateTeachers = [];
let currentMode = 'mode-select';

// DOM Elements - Manual Mode
const teacherNameInput = document.getElementById('teacherName');
const classNameInput = document.getElementById('className');
const durationInput = document.getElementById('duration');
const availStartInput = document.getElementById('availStart');
const availEndInput = document.getElementById('availEnd');
const addTeacherBtn = document.getElementById('addTeacherBtn');
const teachersList = document.getElementById('teachersList');

const constraintTeacherSelect = document.getElementById('constraintTeacher');
const constraintTypeSelect = document.getElementById('constraintType');
const constraintTimeInput = document.getElementById('constraintTime');
const addConstraintBtn = document.getElementById('addConstraintBtn');
const constraintsList = document.getElementById('constraintsList');

const generateScheduleBtn = document.getElementById('generateScheduleBtn');
const scheduleSection = document.getElementById('scheduleSection');
const scheduleOutput = document.getElementById('scheduleOutput');
const resetBtn = document.getElementById('resetBtn');

// DOM Elements - Template Mode
const slotNameInput = document.getElementById('slotName');
const slotStartInput = document.getElementById('slotStart');
const slotEndInput = document.getElementById('slotEnd');
const slotTypeSelect = document.getElementById('slotType');
const addSlotBtn = document.getElementById('addSlotBtn');
const templateSlotsList = document.getElementById('templateSlotsList');

const templateTeacherNameInput = document.getElementById('templateTeacherName');
const templateClassNameInput = document.getElementById('templateClassName');
const slotsChecklistDiv = document.getElementById('slotsChecklist');
const addTemplateTeacherBtn = document.getElementById('addTemplateTeacherBtn');
const templateTeachersList = document.getElementById('templateTeachersList');
const generateTemplateScheduleBtn = document.getElementById('generateTemplateScheduleBtn');

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Event Listeners - Manual Mode
addTeacherBtn.addEventListener('click', addTeacher);
addConstraintBtn.addEventListener('click', addConstraint);
generateScheduleBtn.addEventListener('click', generateSchedule);
resetBtn.addEventListener('click', resetScheduler);
constraintTypeSelect.addEventListener('change', updateConstraintForm);

// Event Listeners - Template Mode
addSlotBtn.addEventListener('click', addTemplateSlot);
addTemplateTeacherBtn.addEventListener('click', addTemplateTeacher);
generateTemplateScheduleBtn.addEventListener('click', generateTemplateSchedule);

// Tab Navigation Functions
function switchTab(tabName) {
    currentMode = tabName;
    
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from buttons
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Mark button as active
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function switchMode(mode) {
    // Reset all data when switching modes
    teachers = [];
    constraints = [];
    schedule = [];
    templateSlots = [];
    templateTeachers = [];
    
    switchTab(mode);
}

// ==================== MANUAL MODE FUNCTIONS ====================

function addTeacher() {
    const name = teacherNameInput.value.trim();
    const className = classNameInput.value.trim();
    const duration = parseFloat(durationInput.value);
    const availStart = availStartInput.value;
    const availEnd = availEndInput.value;
    
    // Validation
    if (!name || !className || !duration || !availStart || !availEnd) {
        alert('Please fill in all fields');
        return;
    }
    
    if (duration <= 0) {
        alert('Duration must be greater than 0');
        return;
    }
    
    if (availStart >= availEnd) {
        alert('Start time must be before end time');
        return;
    }
    
    // Create teacher object
    const teacher = {
        id: Date.now(),
        name,
        className,
        duration,
        availStart,
        availEnd,
        constraints: []
    };
    
    teachers.push(teacher);
    
    // Clear inputs
    teacherNameInput.value = '';
    classNameInput.value = '';
    durationInput.value = '1';
    availStartInput.value = '08:00';
    availEndInput.value = '17:00';
    
    // Update UI
    renderTeachers();
    updateConstraintTeacherSelect();
}

function renderTeachers() {
    if (teachers.length === 0) {
        teachersList.innerHTML = '<div class="empty-state">No teachers added yet</div>';
        return;
    }
    
    teachersList.innerHTML = teachers.map(teacher => `
        <div class="teacher-card">
            <h4>${teacher.name}</h4>
            <p><strong>Class:</strong> ${teacher.className}</p>
            <p><strong>Duration:</strong> ${teacher.duration} hours</p>
            <p><strong>Available:</strong> ${teacher.availStart} - ${teacher.availEnd}</p>
            <div class="badge">${teacher.constraints.length} constraint(s)</div>
            <button class="btn btn-danger btn-small" onclick="deleteTeacher(${teacher.id})" style="margin-top: 10px;">Remove</button>
        </div>
    `).join('');
}

function deleteTeacher(id) {
    teachers = teachers.filter(t => t.id !== id);
    constraints = constraints.filter(c => c.teacherId !== id);
    renderTeachers();
    renderConstraints();
    updateConstraintTeacherSelect();
}

function updateConstraintTeacherSelect() {
    const currentValue = constraintTeacherSelect.value;
    constraintTeacherSelect.innerHTML = '<option value="">-- Select a teacher --</option>';
    
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = `${teacher.name} (${teacher.className})`;
        constraintTeacherSelect.appendChild(option);
    });
    
    constraintTeacherSelect.value = currentValue;
}

function updateConstraintForm() {
    const type = constraintTypeSelect.value;
    const timeConstraintGroup = document.getElementById('timeConstraintGroup');
    
    if (type === 'unavailable') {
        timeConstraintGroup.style.display = 'none';
    } else {
        timeConstraintGroup.style.display = 'flex';
    }
}

function addConstraint() {
    const teacherId = constraintTeacherSelect.value;
    const type = constraintTypeSelect.value;
    const time = constraintTimeInput.value;
    
    if (!teacherId) {
        alert('Please select a teacher');
        return;
    }
    
    const teacher = teachers.find(t => t.id == teacherId);
    if (!teacher) return;
    
    // Validation for time-based constraints
    if (type !== 'unavailable' && !time) {
        alert('Please select a time');
        return;
    }
    
    const constraint = {
        id: Date.now(),
        teacherId: parseInt(teacherId),
        teacherName: teacher.name,
        type,
        time
    };
    
    constraints.push(constraint);
    renderConstraints();
}

function renderConstraints() {
    if (constraints.length === 0) {
        constraintsList.innerHTML = '<div class="empty-state">No constraints added yet</div>';
        return;
    }
    
    constraintsList.innerHTML = constraints.map(constraint => {
        let description = '';
        if (constraint.type === 'unavailable') {
            description = `${constraint.teacherName} is unavailable`;
        } else if (constraint.type === 'mustbefore') {
            description = `${constraint.teacherName}'s class must finish before ${constraint.time}`;
        } else if (constraint.type === 'mustafter') {
            description = `${constraint.teacherName}'s class must start after ${constraint.time}`;
        }
        
        return `
            <div class="constraint-item">
                <span>${description}</span>
                <button class="btn btn-danger btn-small" onclick="deleteConstraint(${constraint.id})">Remove</button>
            </div>
        `;
    }).join('');
}

function deleteConstraint(id) {
    constraints = constraints.filter(c => c.id !== id);
    renderConstraints();
}

// ==================== TEMPLATE MODE FUNCTIONS ====================

function addTemplateSlot() {
    const name = slotNameInput.value.trim();
    const startTime = slotStartInput.value;
    const endTime = slotEndInput.value;
    const type = slotTypeSelect.value;
    
    if (!name || !startTime || !endTime) {
        alert('Please fill in all fields');
        return;
    }
    
    if (startTime >= endTime) {
        alert('Start time must be before end time');
        return;
    }
    
    const slot = {
        id: Date.now(),
        name,
        startTime,
        endTime,
        type,
        assignedTeacher: null
    };
    
    templateSlots.push(slot);
    
    // Clear inputs
    slotNameInput.value = '';
    slotStartInput.value = '08:00';
    slotEndInput.value = '09:30';
    slotTypeSelect.value = 'class';
    
    renderTemplateSlots();
    updateSlotsChecklist();
}

function renderTemplateSlots() {
    if (templateSlots.length === 0) {
        templateSlotsList.innerHTML = '<div class="empty-state">No time slots added yet</div>';
        return;
    }
    
    // Sort by time
    const sorted = [...templateSlots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    templateSlotsList.innerHTML = sorted.map(slot => `
        <div class="template-slot-item ${slot.type}">
            <div class="slot-info">
                <span class="slot-time">${slot.startTime} - ${slot.endTime}</span>
                <span>${slot.name}</span>
                <span class="slot-type">${slot.type}</span>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteTemplateSlot(${slot.id})">Remove</button>
        </div>
    `).join('');
}

function deleteTemplateSlot(id) {
    templateSlots = templateSlots.filter(s => s.id !== id);
    renderTemplateSlots();
    updateSlotsChecklist();
}

function updateSlotsChecklist() {
    const classSlots = templateSlots.filter(s => s.type === 'class');
    
    if (classSlots.length === 0) {
        slotsChecklistDiv.innerHTML = '<div class="empty-state">Add class time slots first</div>';
        return;
    }
    
    slotsChecklistDiv.innerHTML = classSlots.map(slot => `
        <div class="slots-checklist-item">
            <label>
                <input type="checkbox" value="${slot.id}" class="slot-checkbox">
                ${slot.name} (${slot.startTime} - ${slot.endTime})
            </label>
        </div>
    `).join('');
}

function addTemplateTeacher() {
    const name = templateTeacherNameInput.value.trim();
    const className = templateClassNameInput.value.trim();
    
    if (!name || !className) {
        alert('Please fill in all fields');
        return;
    }
    
    const checkedBoxes = Array.from(document.querySelectorAll('.slot-checkbox:checked'));
    const availableSlotIds = checkedBoxes.map(box => parseInt(box.value));
    
    if (availableSlotIds.length === 0) {
        alert('Please select at least one available slot');
        return;
    }
    
    const teacher = {
        id: Date.now(),
        name,
        className,
        availableSlotIds
    };
    
    templateTeachers.push(teacher);
    
    // Clear inputs
    templateTeacherNameInput.value = '';
    templateClassNameInput.value = '';
    document.querySelectorAll('.slot-checkbox').forEach(box => box.checked = false);
    
    renderTemplateTeachers();
}

function renderTemplateTeachers() {
    if (templateTeachers.length === 0) {
        templateTeachersList.innerHTML = '<div class="empty-state">No teachers added yet</div>';
        return;
    }
    
    templateTeachersList.innerHTML = templateTeachers.map(teacher => {
        const slots = teacher.availableSlotIds.map(id => {
            const slot = templateSlots.find(s => s.id === id);
            return slot ? slot.name : '';
        }).join(', ');
        
        return `
            <div class="teacher-card">
                <h4>${teacher.name}</h4>
                <p><strong>Class:</strong> ${teacher.className}</p>
                <p><strong>Available Slots:</strong> ${slots}</p>
                <button class="btn btn-danger btn-small" onclick="deleteTemplateTeacher(${teacher.id})" style="margin-top: 10px;">Remove</button>
            </div>
        `;
    }).join('');
}

function deleteTemplateTeacher(id) {
    templateTeachers = templateTeachers.filter(t => t.id !== id);
    renderTemplateTeachers();
}

function generateTemplateSchedule() {
    if (templateSlots.length === 0 || templateTeachers.length === 0) {
        alert('Please add both time slots and teachers');
        return;
    }
    
    schedule = [];
    const classSlots = templateSlots.filter(s => s.type === 'class');
    const assignedSlots = new Set();
    
    // Try to assign each teacher to a slot
    for (let teacher of templateTeachers) {
        let assigned = false;
        
        // Find an available slot that this teacher can teach
        for (let slotId of teacher.availableSlotIds) {
            if (!assignedSlots.has(slotId)) {
                const slot = templateSlots.find(s => s.id === slotId);
                
                schedule.push({
                    slotId,
                    slotName: slot.name,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    teacherName: teacher.name,
                    className: teacher.className,
                    type: 'class'
                });
                
                assignedSlots.add(slotId);
                assigned = true;
                break;
            }
        }
        
        if (!assigned) {
            alert(`Warning: Could not find an available slot for ${teacher.name} (${teacher.className}). All their preferred slots are already assigned.`);
        }
    }
    
    // Add breaks and other non-class slots
    for (let slot of templateSlots) {
        if (slot.type !== 'class') {
            schedule.push({
                slotId: slot.id,
                slotName: slot.name,
                startTime: slot.startTime,
                endTime: slot.endTime,
                teacherName: '-',
                className: '-',
                type: slot.type
            });
        }
    }
    
    // Sort by start time
    schedule.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    displayTemplateSchedule();
}

function displayTemplateSchedule() {
    let html = `
        <div class="schedule-summary">
            <p><strong>Classes Assigned:</strong> ${schedule.filter(s => s.type === 'class').length} / ${templateTeachers.length}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    if (schedule.length === 0) {
        html += '<div class="error">No schedule could be generated.</div>';
    } else {
        html += `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Period</th>
                        <th>Teacher</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let item of schedule) {
            const rowClass = item.type === 'class' ? '' : 'break';
            html += `
                <tr>
                    <td class="time">${item.startTime} - ${item.endTime}</td>
                    <td>${item.slotName}</td>
                    <td class="teacher ${rowClass}">${item.type === 'class' ? item.teacherName : '-'}</td>
                    <td class="class ${rowClass}">${item.type === 'class' ? item.className : item.slotName}</td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
        `;
    }
    
    scheduleOutput.innerHTML = html;
    scheduleSection.style.display = 'block';
    scheduleSection.scrollIntoView({ behavior: 'smooth' });
}

// ==================== UTILITY FUNCTIONS ====================

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function canPlaceClass(teacher, startTime) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + (teacher.duration * 60);
    const availStartMinutes = timeToMinutes(teacher.availStart);
    const availEndMinutes = timeToMinutes(teacher.availEnd);
    
    // Check if within availability window
    if (startMinutes < availStartMinutes || endMinutes > availEndMinutes) {
        return false;
    }
    
    // Check constraints
    for (let constraint of constraints) {
        if (constraint.teacherId !== teacher.id) continue;
        
        if (constraint.type === 'unavailable') {
            return false;
        } else if (constraint.type === 'mustbefore') {
            const constraintMinutes = timeToMinutes(constraint.time);
            if (endMinutes > constraintMinutes) {
                return false;
            }
        } else if (constraint.type === 'mustafter') {
            const constraintMinutes = timeToMinutes(constraint.time);
            if (startMinutes < constraintMinutes) {
                return false;
            }
        }
    }
    
    // Check if teacher already has a class at this time
    for (let scheduled of schedule) {
        if (scheduled.teacherId !== teacher.id) continue;
        
        const scheduledStart = timeToMinutes(scheduled.startTime);
        const scheduledEnd = scheduledStart + (scheduled.duration * 60);
        
        // Check for overlap
        if ((startMinutes < scheduledEnd) && (endMinutes > scheduledStart)) {
            return false;
        }
    }
    
    return true;
}

function generateSchedule() {
    if (teachers.length === 0) {
        alert('Please add at least one teacher and class');
        return;
    }
    
    schedule = [];
    const schoolStart = 8 * 60; // 8:00 AM in minutes
    const schoolEnd = 17 * 60; // 5:00 PM in minutes
    
    // Try to place each class
    for (let teacher of teachers) {
        let placed = false;
        const availStartMinutes = timeToMinutes(teacher.availStart);
        const availEndMinutes = timeToMinutes(teacher.availEnd);
        const classDurationMinutes = teacher.duration * 60;
        
        // Try each 30-minute slot
        for (let timeSlot = Math.max(schoolStart, availStartMinutes); 
             timeSlot + classDurationMinutes <= Math.min(schoolEnd, availEndMinutes);
             timeSlot += 30) {
            
            const time = minutesToTime(timeSlot);
            if (canPlaceClass(teacher, time)) {
                schedule.push({
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    className: teacher.className,
                    startTime: time,
                    duration: teacher.duration
                });
                placed = true;
                break;
            }
        }
        
        if (!placed) {
            alert(`Warning: Could not place class for ${teacher.name} (${teacher.className}) due to constraints or conflicts.`);
        }
    }
    
    // Sort by start time
    schedule.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    displaySchedule();
}

function displaySchedule() {
    let html = `
        <div class="schedule-summary">
            <p><strong>Total Classes Scheduled:</strong> ${schedule.length} / ${teachers.length}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    if (schedule.length === 0) {
        html += '<div class="error">No classes could be scheduled with the current constraints.</div>';
    } else {
        html += `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>End Time</th>
                        <th>Teacher</th>
                        <th>Class</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let item of schedule) {
            const startMinutes = timeToMinutes(item.startTime);
            const endMinutes = startMinutes + (item.duration * 60);
            const endTime = minutesToTime(endMinutes);
            
            html += `
                <tr>
                    <td class="time">${item.startTime}</td>
                    <td class="time">${endTime}</td>
                    <td class="teacher">${item.teacherName}</td>
                    <td class="class">${item.className}</td>
                    <td>${item.duration} hours</td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
        `;
    }
    
    scheduleOutput.innerHTML = html;
    scheduleSection.style.display = 'block';
    scheduleSection.scrollIntoView({ behavior: 'smooth' });
}

function resetScheduler() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        teachers = [];
        constraints = [];
        schedule = [];
        templateSlots = [];
        templateTeachers = [];
        
        teacherNameInput.value = '';
        classNameInput.value = '';
        durationInput.value = '1';
        availStartInput.value = '08:00';
        availEndInput.value = '17:00';
        constraintTeacherSelect.value = '';
        constraintTimeInput.value = '12:00';
        
        renderTeachers();
        renderConstraints();
        updateConstraintTeacherSelect();
        scheduleSection.style.display = 'none';
        
        switchTab('mode-select');
    }
}

// Initial render
renderTeachers();
renderConstraints();
updateConstraintForm();
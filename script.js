// Data storage
let grades = [];
let classes = [];
let teachers = [];
let constraints = [];
let schedule = [];
let templateSlots = [];
let templateTeachers = [];
let currentMode = 'mode-select';

// Grade & Class Management
const gradeNameInput = document.getElementById('gradeName');
const gradeSelectInput = document.getElementById('gradeSelect');
const classNameInput = document.getElementById('className');
const addGradeBtn = document.getElementById('addGradeBtn');
const addClassBtn = document.getElementById('addClassBtn');
const gradesList = document.getElementById('gradesList');

// Teacher Management
const teacherGradeSelect = document.getElementById('teacherGradeSelect');
const teacherNameInput = document.getElementById('teacherName');
const durationInput = document.getElementById('duration');
const availStartInput = document.getElementById('availStart');
const availEndInput = document.getElementById('availEnd');
const addTeacherBtn = document.getElementById('addTeacherBtn');
const teachersList = document.getElementById('teachersList');

// Constraint Management
const constraintTeacherSelect = document.getElementById('constraintTeacher');
const constraintTypeSelect = document.getElementById('constraintType');
const constraintTimeInput = document.getElementById('constraintTime');
const addConstraintBtn = document.getElementById('addConstraintBtn');
const constraintsList = document.getElementById('constraintsList');

// Schedule Output
const generateScheduleBtn = document.getElementById('generateScheduleBtn');
const scheduleSection = document.getElementById('scheduleSection');
const scheduleOutput = document.getElementById('scheduleOutput');
const resetBtn = document.getElementById('resetBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const printBtn = document.getElementById('printBtn');

// Template Mode Elements
const slotNameInput = document.getElementById('slotName');
const slotStartInput = document.getElementById('slotStart');
const slotEndInput = document.getElementById('slotEnd');
const slotTypeSelect = document.getElementById('slotType');
const addSlotBtn = document.getElementById('addSlotBtn');
const templateSlotsList = document.getElementById('templateSlotsList');

const templateGradeNameInput = document.getElementById('templateGradeName');
const templateAddGradeBtn = document.getElementById('templateAddGradeBtn');
const templateGradesList = document.getElementById('templateGradesList');
const templateGradeSelect = document.getElementById('templateGradeSelect');
const templateNewClassNameInput = document.getElementById('templateNewClassName');
const templateAddClassBtn = document.getElementById('templateAddClassBtn');

const templateTeacherClassSelect = document.getElementById('templateTeacherClass');
const templateTeacherNameInput = document.getElementById('templateTeacherName');
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
addGradeBtn.addEventListener('click', addGrade);
addClassBtn.addEventListener('click', addClass);
addTeacherBtn.addEventListener('click', addTeacher);
addConstraintBtn.addEventListener('click', addConstraint);
generateScheduleBtn.addEventListener('click', generateSchedule);
resetBtn.addEventListener('click', resetScheduler);
constraintTypeSelect.addEventListener('change', updateConstraintForm);

// Event Listeners - Export
downloadPdfBtn.addEventListener('click', downloadPDF);
downloadCsvBtn.addEventListener('click', downloadCSV);
printBtn.addEventListener('click', printSchedule);

// Event Listeners - Template Mode
addSlotBtn.addEventListener('click', addTemplateSlot);
templateAddGradeBtn.addEventListener('click', addTemplateGrade);
templateAddClassBtn.addEventListener('click', addTemplateClass);
addTemplateTeacherBtn.addEventListener('click', addTemplateTeacher);
generateTemplateScheduleBtn.addEventListener('click', generateTemplateSchedule);

// ==================== TAB NAVIGATION ====================
function switchTab(tabName) {
    currentMode = tabName;
    
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function switchMode(mode) {
    grades = [];
    classes = [];
    teachers = [];
    constraints = [];
    schedule = [];
    templateSlots = [];
    templateTeachers = [];
    
    switchTab(mode);
}

// ==================== GRADES & CLASSES ====================

function addGrade() {
    const name = gradeNameInput.value.trim();
    
    if (!name) {
        alert('Please enter a grade name');
        return;
    }
    
    const grade = {
        id: Date.now(),
        name
    };
    
    grades.push(grade);
    gradeNameInput.value = '';
    
    renderGrades();
    updateGradeSelects();
}

function renderGrades() {
    if (grades.length === 0) {
        gradesList.innerHTML = '<div class="empty-state">No grades added yet</div>';
        return;
    }
    
    gradesList.innerHTML = grades.map(grade => {
        const gradeClasses = classes.filter(c => c.gradeId === grade.id);
        return `
            <div class="grade-card">
                <h4>${grade.name}</h4>
                ${gradeClasses.length > 0 ? `
                    <div class="class-list">
                        ${gradeClasses.map(cls => `
                            <div class="class-item">
                                <span>${cls.name}</span>
                                <button class="btn btn-danger btn-small" onclick="deleteClass(${cls.id})">Remove</button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="font-size: 13px; color: #7f8c8d;">No classes yet</p>'}
                <button class="btn btn-danger btn-small" onclick="deleteGrade(${grade.id})" style="margin-top: 10px;">Delete Grade</button>
            </div>
        `;
    }).join('');
}

function deleteGrade(id) {
    grades = grades.filter(g => g.id !== id);
    classes = classes.filter(c => c.gradeId !== id);
    teachers = teachers.filter(t => t.classId !== classes.find(c => c.gradeId === id)?.id);
    renderGrades();
    updateGradeSelects();
    updateTeacherGradeSelect();
}

function addClass() {
    const gradeId = parseInt(gradeSelectInput.value);
    const name = classNameInput.value.trim();
    
    if (!gradeId || !name) {
        alert('Please select a grade and enter a class name');
        return;
    }
    
    const cls = {
        id: Date.now(),
        gradeId,
        name
    };
    
    classes.push(cls);
    classNameInput.value = '';
    
    renderGrades();
    updateTeacherGradeSelect();
}

function deleteClass(id) {
    classes = classes.filter(c => c.id !== id);
    teachers = teachers.filter(t => t.classId !== id);
    renderGrades();
    updateTeacherGradeSelect();
}

function updateGradeSelects() {
    gradeSelectInput.innerHTML = '<option value="">-- Select a grade --</option>';
    templateGradeSelect.innerHTML = '<option value="">-- Select grade --</option>';
    
    grades.forEach(grade => {
        const option1 = document.createElement('option');
        option1.value = grade.id;
        option1.textContent = grade.name;
        gradeSelectInput.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = grade.id;
        option2.textContent = grade.name;
        templateGradeSelect.appendChild(option2);
    });
}

function updateTeacherGradeSelect() {
    teacherGradeSelect.innerHTML = '<option value="">-- Select a class --</option>';
    templateTeacherClassSelect.innerHTML = '<option value="">-- Select class --</option>';
    
    classes.forEach(cls => {
        const grade = grades.find(g => g.id === cls.gradeId);
        const gradePrefix = grade ? `${grade.name} - ` : '';
        
        const option1 = document.createElement('option');
        option1.value = cls.id;
        option1.textContent = `${gradePrefix}${cls.name}`;
        teacherGradeSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = cls.id;
        option2.textContent = `${gradePrefix}${cls.name}`;
        templateTeacherClassSelect.appendChild(option2);
    });
}

// ==================== MANUAL MODE - TEACHERS ====================

function addTeacher() {
    const classId = parseInt(teacherGradeSelect.value);
    const name = teacherNameInput.value.trim();
    const duration = parseFloat(durationInput.value);
    const availStart = availStartInput.value;
    const availEnd = availEndInput.value;
    
    if (!classId || !name || !duration || !availStart || !availEnd) {
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
    
    const teacher = {
        id: Date.now(),
        classId,
        name,
        duration,
        availStart,
        availEnd
    };
    
    teachers.push(teacher);
    
    teacherNameInput.value = '';
    durationInput.value = '1';
    availStartInput.value = '08:00';
    availEndInput.value = '17:00';
    
    renderTeachers();
    updateConstraintTeacherSelect();
}

function renderTeachers() {
    if (teachers.length === 0) {
        teachersList.innerHTML = '<div class="empty-state">No teachers added yet</div>';
        return;
    }
    
    teachersList.innerHTML = teachers.map(teacher => {
        const cls = classes.find(c => c.id === teacher.classId);
        const grade = cls ? grades.find(g => g.id === cls.gradeId) : null;
        const gradePrefix = grade ? `${grade.name} - ` : '';
        const className = cls ? `${gradePrefix}${cls.name}` : 'Unknown Class';
        
        return `
            <div class="teacher-card">
                <h4>${teacher.name}</h4>
                <p><strong>Class:</strong> ${className}</p>
                <p><strong>Duration:</strong> ${teacher.duration} hours</p>
                <p><strong>Available:</strong> ${teacher.availStart} - ${teacher.availEnd}</p>
                <button class="btn btn-danger btn-small" onclick="deleteTeacher(${teacher.id})" style="margin-top: 10px;">Remove</button>
            </div>
        `;
    }).join('');
}

function deleteTeacher(id) {
    teachers = teachers.filter(t => t.id !== id);
    constraints = constraints.filter(c => c.teacherId !== id);
    renderTeachers();
    renderConstraints();
    updateConstraintTeacherSelect();
}

// ==================== CONSTRAINTS ====================

function updateConstraintForm() {
    const type = constraintTypeSelect.value;
    const timeConstraintGroup = document.getElementById('timeConstraintGroup');
    
    if (type === 'unavailable') {
        timeConstraintGroup.style.display = 'none';
    } else {
        timeConstraintGroup.style.display = 'flex';
    }
}

function updateConstraintTeacherSelect() {
    const currentValue = constraintTeacherSelect.value;
    constraintTeacherSelect.innerHTML = '<option value="">-- Select a teacher --</option>';
    
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        constraintTeacherSelect.appendChild(option);
    });
    
    constraintTeacherSelect.value = currentValue;
}

function addConstraint() {
    const teacherId = parseInt(constraintTeacherSelect.value);
    const type = constraintTypeSelect.value;
    const time = constraintTimeInput.value;
    
    if (!teacherId) {
        alert('Please select a teacher');
        return;
    }
    
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    if (type !== 'unavailable' && !time) {
        alert('Please select a time');
        return;
    }
    
    const constraint = {
        id: Date.now(),
        teacherId,
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

// ==================== TEMPLATE MODE ====================

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
        type
    };
    
    templateSlots.push(slot);
    
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

function addTemplateGrade() {
    const name = templateGradeNameInput.value.trim();
    
    if (!name) {
        alert('Please enter a grade name');
        return;
    }
    
    const grade = {
        id: Date.now(),
        name
    };
    
    grades.push(grade);
    templateGradeNameInput.value = '';
    
    renderTemplateGrades();
    updateGradeSelects();
}

function renderTemplateGrades() {
    if (grades.length === 0) {
        templateGradesList.innerHTML = '<div class="empty-state">No grades added yet</div>';
        return;
    }
    
    templateGradesList.innerHTML = grades.map(grade => `
        <div class="template-slot-item">
            <div class="slot-info">
                <span>${grade.name}</span>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteGrade(${grade.id})">Remove</button>
        </div>
    `).join('');
}

function addTemplateClass() {
    const gradeId = parseInt(templateGradeSelect.value);
    const name = templateNewClassNameInput.value.trim();
    
    if (!gradeId || !name) {
        alert('Please select a grade and enter a class name');
        return;
    }
    
    const cls = {
        id: Date.now(),
        gradeId,
        name
    };
    
    classes.push(cls);
    templateNewClassNameInput.value = '';
    
    updateTeacherGradeSelect();
}

function addTemplateTeacher() {
    const classId = parseInt(templateTeacherClassSelect.value);
    const name = templateTeacherNameInput.value.trim();
    
    if (!classId || !name) {
        alert('Please select a class and enter teacher name');
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
        classId,
        name,
        availableSlotIds
    };
    
    templateTeachers.push(teacher);
    
    templateTeacherNameInput.value = '';
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

// ==================== SCHEDULE GENERATION ====================

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
    
    if (startMinutes < availStartMinutes || endMinutes > availEndMinutes) {
        return false;
    }
    
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
    
    for (let scheduled of schedule) {
        if (scheduled.teacherId !== teacher.id) continue;
        
        const scheduledStart = timeToMinutes(scheduled.startTime);
        const scheduledEnd = scheduledStart + (scheduled.duration * 60);
        
        if ((startMinutes < scheduledEnd) && (endMinutes > scheduledStart)) {
            return false;
        }
    }
    
    return true;
}

function generateSchedule() {
    if (teachers.length === 0) {
        alert('Please add at least one teacher');
        return;
    }
    
    schedule = [];
    const schoolStart = 8 * 60;
    const schoolEnd = 17 * 60;
    
    for (let teacher of teachers) {
        let placed = false;
        const availStartMinutes = timeToMinutes(teacher.availStart);
        const availEndMinutes = timeToMinutes(teacher.availEnd);
        const classDurationMinutes = teacher.duration * 60;
        
        for (let timeSlot = Math.max(schoolStart, availStartMinutes); 
             timeSlot + classDurationMinutes <= Math.min(schoolEnd, availEndMinutes);
             timeSlot += 30) {
            
            const time = minutesToTime(timeSlot);
            if (canPlaceClass(teacher, time)) {
                const cls = classes.find(c => c.id === teacher.classId);
                const grade = cls ? grades.find(g => g.id === cls.gradeId) : null;
                
                schedule.push({
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    className: cls?.name || 'Unknown',
                    gradeName: grade?.name || 'Unknown',
                    startTime: time,
                    duration: teacher.duration
                });
                placed = true;
                break;
            }
        }
        
        if (!placed) {
            alert(`Warning: Could not place class for ${teacher.name}`);
        }
    }
    
    schedule.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    displaySchedule();
}

function displaySchedule() {
    let html = `
        <div class="schedule-summary">
            <p><strong>Classes Scheduled:</strong> ${schedule.length} / ${teachers.length}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    if (schedule.length === 0) {
        html += '<div class="error">No schedule generated.</div>';
    } else {
        html += `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>End Time</th>
                        <th>Grade</th>
                        <th>Class</th>
                        <th>Teacher</th>
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
                    <td class="grade">${item.gradeName}</td>
                    <td class="class">${item.className}</td>
                    <td class="teacher">${item.teacherName}</td>
                </tr>
            `;
        }
        
        html += `</tbody></table>`;
    }
    
    scheduleOutput.innerHTML = html;
    scheduleSection.style.display = 'block';
    scheduleSection.scrollIntoView({ behavior: 'smooth' });
}

function generateTemplateSchedule() {
    if (templateSlots.length === 0 || templateTeachers.length === 0) {
        alert('Please add both time slots and teachers');
        return;
    }
    
    schedule = [];
    const assignedSlots = new Set();
    
    for (let teacher of templateTeachers) {
        let assigned = false;
        
        for (let slotId of teacher.availableSlotIds) {
            if (!assignedSlots.has(slotId)) {
                const slot = templateSlots.find(s => s.id === slotId);
                const cls = classes.find(c => c.id === teacher.classId);
                const grade = cls ? grades.find(g => g.id === cls.gradeId) : null;
                
                schedule.push({
                    slotId,
                    slotName: slot.name,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    teacherName: teacher.name,
                    className: cls?.name || 'Unknown',
                    gradeName: grade?.name || 'Unknown',
                    type: 'class'
                });
                
                assignedSlots.add(slotId);
                assigned = true;
                break;
            }
        }
        
        if (!assigned) {
            alert(`Warning: Could not find available slot for ${teacher.name}`);
        }
    }
    
    for (let slot of templateSlots) {
        if (slot.type !== 'class') {
            schedule.push({
                slotId: slot.id,
                slotName: slot.name,
                startTime: slot.startTime,
                endTime: slot.endTime,
                teacherName: '-',
                className: '-',
                gradeName: '-',
                type: slot.type
            });
        }
    }
    
    schedule.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    displayTemplateSchedule();
}

function displayTemplateSchedule() {
    let html = `
        <div class="schedule-summary">
            <p><strong>Classes Assigned:</strong> ${schedule.filter(s => s.type === 'class').length} / ${templateTeachers.length}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    if (schedule.length === 0) {
        html += '<div class="error">No schedule generated.</div>';
    } else {
        html += `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Period</th>
                        <th>Grade</th>
                        <th>Class</th>
                        <th>Teacher</th>
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
                    <td class="grade ${rowClass}">${item.type === 'class' ? item.gradeName : '-'}</td>
                    <td class="class ${rowClass}">${item.type === 'class' ? item.className : item.slotName}</td>
                    <td class="teacher ${rowClass}">${item.type === 'class' ? item.teacherName : '-'}</td>
                </tr>
            `;
        }
        
        html += `</tbody></table>`;
    }
    
    scheduleOutput.innerHTML = html;
    scheduleSection.style.display = 'block';
    scheduleSection.scrollIntoView({ behavior: 'smooth' });
}

// ==================== EXPORT FUNCTIONS ====================

function downloadPDF() {
    const element = document.getElementById('scheduleOutput');
    const opt = {
        margin: 10,
        filename: 'school_schedule.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
}

function downloadCSV() {
    let csv = 'Time,End Time,Grade,Class,Teacher\n';
    
    for (let item of schedule) {
        if (item.type === 'class' || item.gradeName === '-') {
            const startMinutes = item.duration ? timeToMinutes(item.startTime) : null;
            const endMinutes = startMinutes ? startMinutes + (item.duration * 60) : null;
            const endTime = endMinutes ? minutesToTime(endMinutes) : item.endTime;
            
            csv += `"${item.startTime}","${endTime}","${item.gradeName}","${item.className}","${item.teacherName}"\n`;
        }
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school_schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printSchedule() {
    window.print();
}

function resetScheduler() {
    if (confirm('Reset all data?')) {
        grades = [];
        classes = [];
        teachers = [];
        constraints = [];
        schedule = [];
        templateSlots = [];
        templateTeachers = [];
        
        scheduleSection.style.display = 'none';
        switchTab('mode-select');
    }
}

// Initial render
renderGrades();
renderTeachers();
renderConstraints();
updateConstraintForm();
updateGradeSelects();
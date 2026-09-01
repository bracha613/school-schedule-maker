// Data storage
let teachers = [];
let constraints = [];
let schedule = [];

// DOM Elements
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

// Event Listeners
addTeacherBtn.addEventListener('click', addTeacher);
addConstraintBtn.addEventListener('click', addConstraint);
generateScheduleBtn.addEventListener('click', generateSchedule);
resetBtn.addEventListener('click', resetScheduler);
constraintTypeSelect.addEventListener('change', updateConstraintForm);

// Functions
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
    }
}

// Initial render
renderTeachers();
renderConstraints();
updateConstraintForm();
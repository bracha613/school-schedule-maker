# School Schedule Maker

A professional web-based application that helps schools create daily schedules with support for multiple grades, multiple classes per grade, teacher availability constraints, and flexible scheduling modes.

**🌐 Live Demo:** https://bracha613.github.io/school-schedule-maker/

## ✨ Features

### 📚 Multi-Grade Support
- Create schedules for multiple school grades simultaneously
- Add multiple classes within each grade
- Organize classes by grade level (e.g., Grade 1, Grade 2, Grade 3)

### 🎯 Two Scheduling Modes

#### **Manual Mode**
- Teachers manage their own availability
- System automatically finds optimal time slots
- Add constraints (teacher unavailable times, start/end time requirements)
- Ideal for flexible scheduling scenarios

#### **Template Mode**
- Define fixed school day structure first
- Create fixed time slots (periods, breaks, lunch)
- Assign teachers to predefined slots
- Ensures all classes fit fixed school schedule
- Best for traditional school schedules

### 📋 Constraint Management
- **Teacher Unavailable**: Mark specific times when teachers can't teach
- **Class Must Finish Before**: Ensure class ends by specific time
- **Class Must Start After**: Ensure class starts after specific time

### 💾 Export & Save
- **Download as PDF**: Beautiful formatted schedule PDF
- **Download as CSV**: Excel-compatible format for further editing
- **Print-friendly**: Optimized print layout
- **Save Data**: Browser local storage auto-saves your work

### 📱 Fully Responsive
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Optimized layouts for all screen sizes

---

## 🚀 Getting Started

### Quick Start (No Installation Needed)
1. Visit: https://bracha613.github.io/school-schedule-maker/
2. Choose your mode (Manual or Template)
3. Add your grades and classes
4. Add teachers with availability
5. Generate and export your schedule

### Self-Hosted (GitHub Pages)
1. Fork this repository
2. Go to Settings → Pages
3. Set source to `main` branch, `/root` folder
4. Your site will be live at `https://yourusername.github.io/school-schedule-maker/`

---

## 📖 Detailed Usage Guide

### **Manual Mode Workflow**

#### Step 1: Add Grades
1. Enter grade name (e.g., "Grade 1", "Middle School A")
2. Click "Add Grade"

#### Step 2: Add Classes
1. Select a grade
2. Enter class name (e.g., "Class 1-A", "Mathematics Class")
3. Click "Add Class to Grade"

#### Step 3: Add Teachers
1. Select the class this teacher teaches
2. Enter teacher name
3. Set class duration (hours)
4. Set availability window (when they can teach)
5. Click "Add Teacher"

#### Step 4: Add Constraints (Optional)
1. Select a teacher
2. Choose constraint type:
   - **Teacher Unavailable**: Can't teach at all (e.g., on leave)
   - **Class Must Finish Before**: Class must end by this time
   - **Class Must Start After**: Class must start at/after this time
3. Click "Add Constraint"

#### Step 5: Generate Schedule
1. Click "Generate Schedule"
2. Review the generated timetable
3. Export or print as needed

---

### **Template Mode Workflow**

#### Step 1: Create Schedule Template
1. Define time slots for your school day:
   - **Period 1**: 8:00 AM - 9:30 AM (Class)
   - **Break**: 9:30 AM - 9:45 AM (Break)
   - **Period 2**: 9:45 AM - 11:15 AM (Class)
   - etc.
2. Mark each slot as: Class, Break, Lunch, or Free Period
3. Add all slots before proceeding

#### Step 2: Add Grades & Classes
1. Add all grades and classes
2. System will show available class slots

#### Step 3: Assign Teachers to Slots
1. Select a teacher
2. Select class time slots they can teach
3. Can select multiple slots per teacher
4. Click "Add Teacher"

#### Step 4: Generate Schedule
1. Click "Generate Final Schedule"
2. System assigns teachers to slots
3. No class times change - schedule respects your template
4. Export the final schedule

---

## 📊 Export Options

### **PDF Export**
- Professional formatted schedule
- Includes all grades and classes
- Ready to print and distribute
- Perfect for wall displays

### **CSV Export**
- Excel-compatible format
- Can be edited and customized further
- Import into other school management systems
- Great for data analysis

### **Print Layout**
- Optimized for standard paper sizes
- Color-coded by grade
- Printer-friendly formatting

---

## 🛠️ Technical Details

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage (data persists between sessions)
- **Export**: PDF generation with jsPDF, CSV string generation

### Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### No Server Required
- Completely client-side application
- All processing happens in your browser
- Your data never leaves your device
- Works offline after first load

---

## 💡 Use Cases

### **Primary Schools**
- Multiple grades (1-6)
- Multiple classes per grade (A, B, C sections)
- Different teachers per grade/class
- Include breaks and lunch times

### **Secondary Schools**
- High school grades (9-12)
- Subject-based classes
- Teacher constraints (planning periods, duty times)
- Room scheduling

### **Universities**
- Multiple departments/grades
- Lecture halls and lab sessions
- Instructor availability
- Course prerequisites and timing

### **Tutoring Centers**
- Multiple class levels
- Student groups
- Tutor availability
- Fixed time slot booking

---

## 🎨 Customization

### Modify School Hours
Edit the default times in the template mode to match your school:
- Default start: 8:00 AM
- Default end: 5:00 PM
- Adjust in the time input fields

### Add Your School Logo
Edit `index.html` and add your school logo in the header

### Change Colors
Edit `:root` variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;    /* Main blue */
    --secondary-color: #2ecc71;  /* Green */
    --danger-color: #e74c3c;     /* Red */
}
```

---

## 🔒 Privacy & Data

- ✅ **No data is sent to servers** - Everything stays on your device
- ✅ **No user tracking** - No analytics or cookies
- ✅ **Offline capable** - Works without internet after first load
- ✅ **Local storage** - Data persists in browser (cleared when cache is cleared)
- ✅ **No login required** - Completely anonymous usage

---

## 📋 Roadmap / Future Features

- [ ] Drag-and-drop interface for schedule editing
- [ ] Multiple room/location support
- [ ] Student group management
- [ ] Conflict detection with detailed reports
- [ ] Teacher workload balancing
- [ ] Cloud sync (optional Google Drive/OneDrive)
- [ ] Schedule templates library
- [ ] Email schedule distribution
- [ ] Real-time collaboration

---

## 🐛 Known Limitations

- Single day scheduling (not weekly/monthly yet)
- No automatic optimization algorithm (greedy approach)
- PDF export requires modern browser
- Local storage limited to ~5MB per site

---

## 📱 Mobile Tips

- Use **Manual Mode** for mobile - simpler workflow
- Landscape orientation works better for tables
- Tap and hold for longer menu on mobile
- Export to PDF/CSV for easier sharing on mobile

---

## 🤝 Contributing

Found a bug? Have a suggestion? Issues and pull requests welcome!

---

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

## ❓ FAQ

**Q: Will my data be saved if I close the browser?**
A: Yes! Your schedule data is saved in browser storage. It persists until you clear your browser cache.

**Q: Can I use this for a school with 100+ students?**
A: Yes! Add students as "classes" and teachers accordingly. The system can handle large schedules.

**Q: Can I edit the schedule after generating it?**
A: Currently, you need to regenerate. Manual editing in CSV export is recommended for small changes.

**Q: Does this work without internet?**
A: After first load, yes! It's a fully client-side application.

**Q: How do I backup my schedule?**
A: Export to CSV/PDF, or manually save browser storage data via developer tools.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation above

---

**Made with ❤️ for educators and school administrators**
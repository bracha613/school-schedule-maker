# School Schedule Maker

A web-based application that helps create school daily schedules by inputting teachers, their classes, availability times, and various constraints.

## Features

### Core Functionality
- **Add Teachers & Classes**: Input teacher names, class names, class duration, and their availability window
- **Generate Schedules**: Automatically create a non-conflicting daily schedule
- **Constraint Management**: Define conditions that must be followed when creating the schedule

### Constraint Types
1. **Teacher Unavailable**: Mark a teacher as completely unavailable (e.g., on break, out sick)
2. **Class Must Finish Before**: Ensure a teacher's class ends before a specific time
3. **Class Must Start After**: Ensure a teacher's class starts after a specific time

### Examples of Use Cases
- Teacher X cannot teach at 12:00 PM (lunch break)
- Class Y must finish before 3:00 PM (teacher needs to pick up students)
- Class Z must start after 9:00 AM (teacher arrives late)

## How to Use

1. **Add Teachers**:
   - Enter teacher name and class name
   - Specify class duration (in hours)
   - Set the time window they're available (e.g., 8:00 AM - 5:00 PM)
   - Click "Add Teacher & Class"

2. **Add Constraints** (Optional):
   - Select a teacher from the dropdown
   - Choose constraint type
   - Specify time if needed
   - Click "Add Constraint"

3. **Generate Schedule**:
   - Click "Generate Schedule" button
   - The application will create a schedule respecting all constraints and availability windows
   - If a teacher's class cannot be placed, you'll receive a warning

4. **Review Results**:
   - View the generated schedule in table format
   - Schedule shows start time, end time, teacher, class, and duration
   - Click "Create New Schedule" to start over

## Algorithm

The schedule generator uses a greedy algorithm that:
1. Iterates through each teacher and their class
2. Attempts to place each class in 30-minute time slots
3. Checks if placement is valid by verifying:
   - The class fits within the teacher's availability window
   - The class doesn't violate any constraints
   - The teacher doesn't have overlapping classes
4. Sorts the final schedule by start time

## Technical Stack

- **HTML5**: Structure and semantics
- **CSS3**: Styling with gradient backgrounds and responsive design
- **JavaScript (Vanilla)**: Schedule generation logic and DOM manipulation

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features for Future Enhancement

- [ ] Multiple rooms/locations
- [ ] Teacher preferences (preferred times)
- [ ] Student group management
- [ ] Schedule conflicts detection with detailed reports
- [ ] Schedule persistence (save/load)
- [ ] Export to PDF/CSV
- [ ] Advanced constraint types (teacher pairs, room requirements)
- [ ] Schedule optimization algorithms
- [ ] Undo/Redo functionality

## License

MIT License - feel free to use this project for educational purposes.

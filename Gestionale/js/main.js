document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        locale: 'it',
        editable: true,
        selectable: true,
        selectMirror: true,
        
        select: function(arg) {
            var title = prompt('Inserisci il nome del turno:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end,
                    allDay: arg.allDay
                });
            }
            calendar.unselect();
        },
        
        eventClick: function(info) {
            if (confirm('Sei sicuro di voler eliminare questo turno?')) {
                info.event.remove();
            }
        }
    });
    
    calendar.render();
}); 
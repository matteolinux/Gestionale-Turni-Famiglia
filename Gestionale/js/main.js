// Definiamo il dizionario come fonte primaria dei dati
let turni = {
    "32/21": { inizio: "15:15", fine: "23:15" },
    "33/32/46": { inizio: "12:15", fine: "20:30" },
    "41/46": { inizio: "10:00", fine: "18:30" },
    "611/610": { inizio: "12:45", fine: "19:20" },
    "232/14/33": { inizio: "04:50", fine: "14:30" },
    "233/232": { inizio: "13:20", fine: "23:59" },
    "rientro da 233/232": { inizio: "00:00", fine: "07:00" },
    "596/10/31": { inizio: "14:50", fine: "23:59" },
    "rientro da 596/10/31": { inizio: "00:00", fine: "15:00" },
    "770/771": { inizio: "14:20", fine: "23:59" },
    "rientro da 770/771": { inizio: "00:00", fine: "12:30" },
    "235/234": { inizio: "15:50", fine: "23:59" },
    "rientro da 235/234": { inizio: "00:00", fine: "16:30" },
    "Riposo": { inizio: "00:00", fine: "23:59" },
    "Intervallo": { inizio: "00:00", fine: "23:59" },
    "Ferie/Riposo/Intervallo": { inizio: "00:00", fine: "23:59" },
    "Ferie": { inizio: "00:00", fine: "23:59" },
    "Scuola": { inizio: "07:50", fine: "17:00" },
    "Visita": { inizio: "07:50", fine: "13:00" },
    "Malattia": { inizio: "00:00", fine: "23:59" },
    "Dispo": { inizio: "00:00", fine: "23:59" },
    "Parentale": { inizio: "00:00", fine: "23:59" }
};




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
        
        eventContent: function(arg) {
            return {
                html: `<div class="event-content">
                    <span class="event-turno">${arg.event.title}</span>
                    <span class="event-orario">${arg.event.extendedProps.orarioInizio} - ${arg.event.extendedProps.orarioFine}</span>
                </div>`
            };
        },
        
        select: function(arg) {
            // Creiamo il div contenitore per il modal
            const modalDiv = document.createElement('div');
            modalDiv.className = 'turno-modal';

            // Creiamo il select per il genitore
            const parentSelect = document.createElement('select');
            parentSelect.className = 'turno-select';
            
            // Aggiungiamo le opzioni per i genitori
            const defaultParentOption = document.createElement('option');
            defaultParentOption.text = 'Seleziona genitore';
            defaultParentOption.value = '';
            parentSelect.appendChild(defaultParentOption);
            
            ['Matteo', 'Sara'].forEach(genitore => {
                const option = document.createElement('option');
                option.value = genitore;
                option.text = genitore;
                parentSelect.appendChild(option);
            });

            // Creiamo il select per i turni
            const turnoSelect = document.createElement('select');
            turnoSelect.className = 'turno-select';
            
            // Aggiungiamo un'opzione vuota come default
            const defaultTurnoOption = document.createElement('option');
            defaultTurnoOption.text = 'Seleziona un turno';
            defaultTurnoOption.value = '';
            turnoSelect.appendChild(defaultTurnoOption);
            
            // Popoliamo il select con i turni dal dizionario
            Object.keys(turni).forEach(turno => {
                const option = document.createElement('option');
                option.value = turno;
                option.text = `${turno} (${turni[turno].inizio} - ${turni[turno].fine})`;
                turnoSelect.appendChild(option);
            });

            // Creiamo i pulsanti
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'turno-buttons';
            
            const confermaBtn = document.createElement('button');
            confermaBtn.textContent = 'Conferma';
            confermaBtn.className = 'turno-btn turno-btn-conferma';
            
            const annullaBtn = document.createElement('button');
            annullaBtn.textContent = 'Annulla';
            annullaBtn.className = 'turno-btn turno-btn-annulla';

            // Aggiungiamo gli eventi ai pulsanti
            confermaBtn.onclick = function() {
                const turnoSelezionato = turnoSelect.value;
                const genitoreSelezionato = parentSelect.value;
                if (turnoSelezionato && genitoreSelezionato) {
                    calendar.addEvent({
                        title: turnoSelezionato,
                        start: arg.start,
                        end: arg.end,
                        allDay: arg.allDay,
                        className: genitoreSelezionato.toLowerCase(),
                        extendedProps: {
                            orarioInizio: turni[turnoSelezionato].inizio,
                            orarioFine: turni[turnoSelezionato].fine,
                            genitore: genitoreSelezionato
                        }
                    });
                }
                document.body.removeChild(modalDiv);
                calendar.unselect();
            };

            annullaBtn.onclick = function() {
                document.body.removeChild(modalDiv);
                calendar.unselect();
            };

            // Assembliamo il modal
            modalDiv.appendChild(parentSelect);
            modalDiv.appendChild(document.createElement('br'));
            modalDiv.appendChild(turnoSelect);
            modalDiv.appendChild(buttonsDiv);
            buttonsDiv.appendChild(confermaBtn);
            buttonsDiv.appendChild(annullaBtn);
            document.body.appendChild(modalDiv);
        },
        
        eventClick: function(info) {
            if (confirm('Sei sicuro di voler eliminare questo turno?')) {
                info.event.remove();
            }
        }
    });
    
    calendar.render();
}); 
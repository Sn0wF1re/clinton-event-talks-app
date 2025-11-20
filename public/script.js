document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchBar = document.getElementById('search-bar');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data.talks;
            displaySchedule(talks);
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk => {
            return talk.category.some(category => category.toLowerCase().includes(searchTerm));
        });
        displaySchedule(filteredTalks);
    });

    function displaySchedule(talksToDisplay) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        talksToDisplay.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');

            scheduleItem.innerHTML = `
                <div class="schedule-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                <div class="talk-title">${talk.title}</div>
                <div class="talk-speakers">${talk.speakers.join(', ')}</div>
                <div class="talk-description">${talk.description}</div>
                <div class="talk-categories">
                    ${talk.category.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
                </div>
            `;
            scheduleContainer.appendChild(scheduleItem);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                const lunchBreak = document.createElement('div');
                lunchBreak.classList.add('schedule-item', 'break');
                lunchBreak.innerHTML = `
                    <div class="schedule-time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                    <div class="talk-title">Lunch Break</div>
                `;
                scheduleContainer.appendChild(lunchBreak);
                currentTime = lunchEndTime;
            }
        });
    }
});

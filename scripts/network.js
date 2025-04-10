fetch('http://127.0.0.1:62311/api/entries')
    .then(response => response.json())
    .then(data => {
        const entryCount = data.entryCount;
        const entriesDiv = document.getElementById('entries');
        entriesDiv.innerHTML = <p>Total Entries: ${entryCount}</p>;
        // Fetch each entry and display it
        for (let i = 0; i < entryCount; i++) {
            fetch('http://127.0.0.1:62311/api/entry/${i}')
                .then(response => response.json())
                .then(entryData => {
                    const entryElement = document.createElement('div');
                    entryElement.innerHTML = <p>Entry ${i}: ${entryData.data}</p>;
                    entriesDiv.appendChild(entryElement);
                })
                .catch(err => console.error('Error fetching entry', err));
        }
    })
    .catch(err => console.error('Error fetching entry count', err));
// Check authentication
if (!sessionStorage.getItem('adminAuth')) {
    window.location.href = 'admin.html';
}

// Initialize Chart.js
let typeChart;

// Load and display data
function loadResults() {
    const results = JSON.parse(localStorage.getItem('personalityResults')) || [];
    
    // Update stats
    document.getElementById('totalParticipants').textContent = results.length;
    document.getElementById('averageTime').textContent = 
        results.length ? `${Math.round(results.reduce((sum, r) => sum + r.time, 0) / results.length)}s` : '0s';
    
    // Find most common type
    const typeCounts = results.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {});
    const commonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('commonType').textContent = commonType ? `${commonType[0]} (${commonType[1]})` : '-';
    
    // Update chart
    updateChart(typeCounts);
    
    // Populate data grid
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = results.map(result => `
        <div class="data-card">
            <h3>${result.name}</h3>
            <p><strong>Type:</strong> ${result.type}</p>
            <p><strong>Time:</strong> ${result.time}s</p>
            <p><strong>Date:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
            
            <div class="personality-points">
                <h4>Personality Points:</h4>
                <ul>
                    <li><strong>E:</strong> ${result.points?.E || 0}</li>
                    <li><strong>I:</strong> ${result.points?.I || 0}</li>
                    <li><strong>S:</strong> ${result.points?.S || 0}</li>
                    <li><strong>N:</strong> ${result.points?.N || 0}</li>
                    <li><strong>T:</strong> ${result.points?.T || 0}</li>
                    <li><strong>F:</strong> ${result.points?.F || 0}</li>
                    <li><strong>J:</strong> ${result.points?.J || 0}</li>
                    <li><strong>P:</strong> ${result.points?.P || 0}</li>
                </ul>
            </div>
        </div>
    `).join('');
}

function updateChart(typeCounts) {
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    if (typeChart) {
        typeChart.destroy();
    }
    
    typeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Personality Types',
                data: Object.values(typeCounts),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function logout() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'admin.html';
}

// Initialize dashboard
loadResults();
setInterval(() => {
    if (!sessionStorage.getItem('adminAuth')) {
        logout();
    }
}, 1000);
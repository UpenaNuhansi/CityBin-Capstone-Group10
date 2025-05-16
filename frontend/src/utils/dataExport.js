export const exportCSV = (binData) => {
  console.log('Exporting data as CSV');
  const headers = ['date', 'binsEmptied', 'avgFillPercent', 'fullAlerts'];
  const csvContent = [
    headers.join(','),
    ...binData.map(row => 
      `${row.date},${row.binsEmptied},${row.avgFillPercent},${row.fullAlerts}`
    )
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bin_data_report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPDF = (binData) => {
  console.log('Exporting data as PDF');
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Bin Collection Data Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Bin Collection Data Report</h1>
          <p>Report generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bins Emptied</th>
                <th>Avg Fill %</th>
                <th>Full Alerts</th>
              </tr>
            </thead>
            <tbody>
              ${binData.map(row => `
                <tr>
                  <td>${row.date}</td>
                  <td>${row.binsEmptied}</td>
                  <td>${row.avgFillPercent}%</td>
                  <td>${row.fullAlerts}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    alert('Please allow popups to generate PDF reports');
  }
};
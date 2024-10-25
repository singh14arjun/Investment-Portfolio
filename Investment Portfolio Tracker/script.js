// Select DOM elements
const form = document.getElementById("investment-form");
const nameInput = document.getElementById("investment-name");
const amountInput = document.getElementById("investment-amount");
const currentValueInput = document.getElementById("investment-current-value");
const portfolioList = document.getElementById("portfolio-list");
const totalValueElement = document.getElementById("portfolio-summary");
const chartCanvas = document.getElementById("portfolio-chart");

// Initialize investments from localStorage or empty array
let investments = JSON.parse(localStorage.getItem("investments")) || [];
let chart;

// Initialize the portfolio on page load
document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
  updateChart();
});

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const currentValue = parseFloat(currentValueInput.value);

  // Validate input
  if (!name || isNaN(amount) || isNaN(currentValue) || amount < 0 || currentValue < 0) {
    alert("Please provide valid input values.");
    return;
  }

  const existingInvestment = investments.find((inv) => inv.name === name);

  if (existingInvestment) {
    existingInvestment.amount = amount;
    existingInvestment.currentValue = currentValue;
  } else {
    investments.push({ name, amount, currentValue });
  }

  saveInvestments();
  renderPortfolio();
  updateChart();
  form.reset();
});

// Save investments to localStorage
function saveInvestments() {
  localStorage.setItem("investments", JSON.stringify(investments));
}

// Render the portfolio list and summary
function renderPortfolio() {
  portfolioList.innerHTML = "";
  let totalInvestment = 0;
  let totalCurrentValue = 0;

  investments.forEach((inv, index) => {
    totalInvestment += inv.amount;
    totalCurrentValue += inv.currentValue;
    const percentageChange = (((inv.currentValue - inv.amount) / inv.amount) * 100).toFixed(2);

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div>
        <strong>${inv.name}</strong><br>
        Invested: $${inv.amount.toFixed(2)} | Current: $${inv.currentValue.toFixed(2)}<br>
        Change: <span style="color: ${percentageChange >= 0 ? 'green' : 'red'};">
          ${percentageChange}%
        </span>
      </div>
      <button onclick="removeInvestment(${index})">Remove</button>
    `;
    portfolioList.appendChild(listItem);
  });

  const profitOrLoss = totalCurrentValue - totalInvestment;
  const profitOrLossText = profitOrLoss >= 0 ? `Profit: $${profitOrLoss.toFixed(2)}` : `Loss: $${Math.abs(profitOrLoss).toFixed(2)}`;
  
  totalValueElement.innerHTML = `
    Total Investment: $${totalInvestment.toFixed(2)}<br>
    Total Current Value: $${totalCurrentValue.toFixed(2)}<br>
    ${profitOrLossText}
  `;
}

// Remove an investment and update the UI
function removeInvestment(index) {
  investments.splice(index, 1);
  saveInvestments();
  renderPortfolio();
  updateChart();
}

// Update the pie chart with the current data
// Update the pie chart with the current data
function updateChart() {
    const labels = investments.map((inv) => inv.name);
    const data = investments.map((inv) => inv.currentValue);
  
    if (chart) {
      chart.destroy(); // Destroy existing chart to avoid duplication
    }
  
    if (data.length > 0) {
      chart = new Chart(chartCanvas, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              "#007bff", "#28a745", "#ffc107", "#dc3545", "#ff00ff", "#00ffff"
            ],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: "#e0e0e0", // Light text for dark mode
              },
            },
            // Adding the datalabels plugin configuration
            datalabels: {
              color: '#ffffff', // Text color for labels
              formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex]; // Show investment name
              },
              anchor: 'end',
              align: 'start',
              font: {
                weight: 'bold',
              },
            },
          },
        },
        plugins: [ChartDataLabels], // Register the plugin
      });
    }
  }
  

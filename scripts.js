// Main Variables
const loans = [];
const loanList = document.getElementById('loan-list');
const addLoanButton = document.getElementById('add-loan');
const principalInput = document.getElementById('principal');
const aprInput = document.getElementById('apr');
const termInput = document.getElementById('term');
const ctx = document.getElementById('interest-chart').getContext('2d');
let chart;

// Simple Interest Calculation
function calculateSimpleInterest(principal, apr, term) {
  const interest = (principal * apr * term) / 100;
  return interest;
}

// Compound Interest Calculation
function calculateCompoundInterest(principal, apr, term, frequency = 12) {
  const rate = apr / 100 / frequency;
  const periods = term * frequency;
  const compoundAmount = principal * Math.pow(1 + rate, periods);
  return compoundAmount - principal;
}

// Render Loans
function renderLoans() {
  loanList.innerHTML = '';
  loans.forEach((loan, index) => {
    const listItem = document.createElement('li');
    const simpleInterest = calculateSimpleInterest(loan.principal, loan.apr, loan.term);
    const compoundInterest = calculateCompoundInterest(loan.principal, loan.apr, loan.term);
    
    listItem.innerHTML = `
      Loan ${index + 1}:
      Principal: $${loan.principal}, APR: ${loan.apr}%, Term: ${loan.term} years
      <br>Simple Interest: $${simpleInterest.toFixed(2)}, Compound Interest: $${compoundInterest.toFixed(2)}
      <button onclick="removeLoan(${index})">Remove</button>
    `;
    loanList.appendChild(listItem);
  });
  updateChart();
}

// Remove Loan
function removeLoan(index) {
  loans.splice(index, 1);
  renderLoans();
}

// Add Loan
addLoanButton.addEventListener('click', () => {
  const principal = parseFloat(principalInput.value);
  const apr = parseFloat(aprInput.value);
  const term = parseFloat(termInput.value);

  if (!principal || !apr || !term) {
    alert('Please fill out all fields.');
    return;
  }

  loans.push({ principal, apr, term });
  renderLoans();
  principalInput.value = '';
  aprInput.value = '';
  termInput.value = '';
});

// Update Chart
function updateChart() {
  if (chart) {
    chart.destroy();
  }

  const labels = loans.map((loan, index) => `Loan ${index + 1}`);
  const simpleInterestData = loans.map(loan => calculateSimpleInterest(loan.principal, loan.apr, loan.term));
  const compoundInterestData = loans.map(loan => calculateCompoundInterest(loan.principal, loan.apr, loan.term));

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Simple Interest',
          data: simpleInterestData,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'Compound Interest',
          data: compoundInterestData,
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
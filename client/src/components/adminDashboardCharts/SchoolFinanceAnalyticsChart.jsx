import "./schoolFinanceAnalyticsChart.scss";
import ReactApexChart from "react-apexcharts";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

import payments from "../../data/FinanceDashboardData/paymentsInvoices.json";
import expenses from "../../data/FinanceDashboardData/expensesInvoices.json";

const groupByMonth = (data, dateKey, amountKey) => {
  const months = Array(12).fill(0);

  data.forEach((item) => {
    const date = new Date(item[dateKey]);
    const monthIndex = date.getMonth();
    months[monthIndex] += item[amountKey];
  });

  return months;
};

const SchoolFinanceAnalyticsChart = () => {
  const monthlyIncomes = groupByMonth(payments, "date", "amount");
  const monthlyExpenses = groupByMonth(expenses, "date", "amount");

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const formattedTotalExpenses = totalExpenses.toLocaleString("de-DE");

  const totalPayments = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const formattedTotalIncomes = totalPayments.toLocaleString("de-DE");

  const state = {
    series: [
      {
        name: "Expenses",
        data: monthlyExpenses,
      },
      {
        name: "Incomes",
        data: monthlyIncomes,
      },
    ],
    options: {
      chart: {
        height: 150,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#73D674", "#FF0100"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 4,
      },

      grid: {
        borderColor: "#f4f4f4",
        strokeDashArray: 6,
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
        column: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "11px",
          },
        },

        axisBorder: {
          show: true,
          color: "#f4f4f4",
          height: 1,
        },
        axisTicks: {
          show: true,
          color: "#f4f4f4",
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return `${value / 1000}K`;
          },

          style: {
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "11px",
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} TND `,
        },
      },
    },
  };

  return (
    <div id="chart">
      <div className="customized-legend-wrapper">
        <div className="legend-item ">
          <div className="left incomes">
            <FaArrowTrendUp />
          </div>
          <div className="right">
            <div className="title">Incomes</div>
            <div className="montant">
              {formattedTotalIncomes}
              <span> TND</span>
            </div>
          </div>
        </div>

        <div className="legend-item ">
          <div className="left expenses">
            <FaArrowTrendDown />
          </div>
          <div className="right">
            <div className="title">Expenses</div>
            <div className="montant">
              {formattedTotalExpenses}
              <span> TND</span>
            </div>
          </div>
        </div>
      </div>

      <ReactApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={210}
        className="finance-chart-wrapper"
      />
    </div>
  );
};

export default SchoolFinanceAnalyticsChart;

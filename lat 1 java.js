const chartBuildingCategory = document.getElementById("megaChart_2");

fetch("Total_Revenue_building_Category.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var arrTotalRevenue = [];
    var arrBuildingClassCategory = [];
    var arrRevenuePercentage = [];
    data.sort((a, b) => b.Total_Revenue - a.Total_Revenue);
    var slicedData = data.slice(0, 10);

    slicedData.forEach((element) => {
      arrTotalRevenue.push(element.Total_Revenue);
      arrBuildingClassCategory.push(element.BUILDING_CLASS_CATEGORY);
      arrRevenuePercentage.push(element.Revenue_Percentage);
    });
    var objChart = {
      building_class_category: arrBuildingClassCategory,
      total_revenue: arrTotalRevenue,
      revenue_percentage: arrRevenuePercentage,
    };
    createChartBuildingCategory(objChart, "bar");
  });

function createChartBuildingCategory(arrPassedBuildingCategory, type) {
  let arrBgColors = [];
  arrPassedBuildingCategory.total_revenue.forEach((element, index) => {
    arrBgColors.push(
      `rgba(47, 160, 215, 0.5)`
    );
  });

  window.megaChart2Sort = new Chart(chartBuildingCategory, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: arrPassedBuildingCategory.building_class_category,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassedBuildingCategory.total_revenue,
          borderColor: "rgb(0, 0, 255)",
          backgroundColor: arrBgColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          type: "logarithmic",
        },
      },
      plugins: {
        title: {
          display: true,
          text: "TOP 10 TOTAL REVENUE BY BUILDING CATEGORY",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem, data) {
              const formatterUsd = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
              let sum = 0;
              tooltipItem.dataset.data.forEach((data) => { sum += parseInt(data); });
              let percentage = ((parseInt(tooltipItem.parsed.x) * 100) / sum).toFixed(5) + "%";
              var priceValue = formatterUsd.format(tooltipItem.parsed.x);
              var strDisplay = `Total Revenue: ${priceValue} | Percentage: (${percentage})`;

              return strDisplay;
            },
          },
        },
        legend: {
          position: "top",
        },
        datalabels: {
          clip: true,
          align: "end",
          anchor: "end",
          formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map((data) => {
              sum += parseInt(data);
            });
            let percentage = ((parseInt(value) * 100) / sum).toFixed(5) + "%";
            const formatterUsd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

            let usdValue = formatterUsd.format(value);
            let strDisplay = `${usdValue} | (${percentage})`;

            return strDisplay;
          },
          color: "#000",
        },
      },
    },
  });
}

document.getElementById("sortChartAsc").addEventListener("click", function () {
  sortChartDataRevenue("asc", "revenue");
});

document.getElementById("sortChartDesc").addEventListener("click", function () {
  sortChartDataRevenue("desc", "revenue");
});

function sortChartDataRevenue(strSort, sortBy) {
  let arrBuildingClassCategoryChart = window.megaChart2Sort.data.labels;
  let arrTotalRevenueChart = window.megaChart2Sort.data.datasets[0].data;
  let arrBackgroundColor = window.megaChart2Sort.data.datasets[0].backgroundColor;
  let arrSort = [];

  arrTotalRevenueChart.forEach((element, index) => {
    arrSort.push({
      building_class_category: arrBuildingClassCategoryChart[index],
      totalRevenue: element,
      backgroundColor: arrBackgroundColor[index],
    });
  });

  if (sortBy === "revenue") {
    if (strSort === "asc") {
      arrSort.sort((a, b) => a.totalRevenue - b.totalRevenue);
    } else {
      arrSort.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
  }

  arrBuildingClassCategoryChart = [];
  arrTotalRevenueChart = [];
  arrBackgroundColor = [];
  arrSort.forEach((element) => {
    arrBuildingClassCategoryChart.push(element.building_class_category);
    arrTotalRevenueChart.push(element.totalRevenue);
    arrBackgroundColor.push(element.backgroundColor);
  });

  window.megaChart2Sort.data.labels = arrBuildingClassCategoryChart;
  window.megaChart2Sort.data.datasets[0].data = arrTotalRevenueChart;
  window.megaChart2Sort.data.datasets[0].backgroundColor = arrBackgroundColor;
  window.megaChart2Sort.update();
}


function showHideInsight(event) {
  var x = document.getElementById("insightChartMega2");
  
  if(x.classList.contains('hidden')){
    x.classList.remove('hidden');
    x.classList.add('show');
  }
  else if(x.classList.contains('show')){
    x.classList.remove('show');
    x.classList.add('hidden');
  }  
}




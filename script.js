// script.js

// Register the ChartDataLabels plugin
Chart.register(ChartDataLabels);

// Function to generate dataset input fields based on the number of datasets
function generateDatasetInputs() {
  const count = parseInt(document.getElementById("dataSetCount").value);
  const container = document.getElementById("datasetsContainer");
  container.innerHTML = ""; // Clear existing inputs

  for (let i = 1; i <= count; i++) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    const label = document.createElement("label");
    label.textContent = `Enter Data for Dataset ${i} (comma-separated):`;
    label.setAttribute("for", `datasetInput${i}`);
    const input = document.createElement("input");
    input.type = "text";
    input.id = `datasetInput${i}`;
    input.placeholder = `e.g., 10, 20, 30, 40`;
    input.required = true;

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    container.appendChild(formGroup);
  }
}

// Initial call to generate the first dataset input
generateDatasetInputs();

// Event listener to regenerate dataset inputs when the number changes
document
  .getElementById("dataSetCount")
  .addEventListener("change", generateDatasetInputs);

document
  .getElementById("dataForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get chart title
    const chartTitle = document.getElementById("chartTitle").value;

    // Get labels
    const labelsInput = document.getElementById("labelsInput").value;
    const labels = labelsInput.split(",").map((item) => item.trim());

    if (labels.length === 0 || labels[0] === "") {
      alert("Please enter at least one label.");
      return;
    }

    // Get chart type
    const chartType = document.getElementById("chartType").value;

    // Get datasets
    const datasetCount = parseInt(
      document.getElementById("dataSetCount").value
    );
    const datasets = [];

    for (let i = 1; i <= datasetCount; i++) {
      const dataInput = document.getElementById(`datasetInput${i}`).value;
      const dataArray = dataInput
        .split(",")
        .map((item) => parseFloat(item.trim()))
        .filter((item) => !isNaN(item));

      // Ensure data arrays align with labels
      if (dataArray.length !== labels.length) {
        alert(`Dataset ${i} does not match the number of labels.`);
        return;
      }

      datasets.push({
        label: `Dataset ${i}`,
        data: dataArray,
        backgroundColor: generateColors(labels.length, i),
        borderColor: generateBorderColors(labels.length, i),
        borderWidth: 2,
        fill: chartType === "line" ? false : true, // For line charts
        tension: 0.1, // Smooth lines
      });
    }

    // Prepare data for Chart.js
    const chartData = {
      labels: labels,
      datasets: datasets,
    };

    // Chart configuration
    const config = {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: chartTitle !== "",
            text: chartTitle,
            font: {
              size: 24,
              weight: "bold",
              family: "Roboto",
            },
            padding: {
              top: 20,
              bottom: 30,
            },
          },
          legend: {
            position: "top",
            labels: {
              font: {
                family: "Roboto",
                size: 14,
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0,0,0,0.7)",
            titleFont: {
              family: "Roboto",
              size: 14,
            },
            bodyFont: {
              family: "Roboto",
              size: 12,
            },
            footerFont: {
              family: "Roboto",
              size: 10,
            },
          },
          datalabels: {
            display: true,
            color: "#fff",
            font: {
              weight: "bold",
            },
            formatter: function (value, context) {
              return value;
            },
          },
        },
        scales:
          chartType === "bar" || chartType === "line"
            ? {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: "Labels",
                    color: "#333",
                    font: {
                      family: "Roboto",
                      size: 16,
                      weight: "500",
                    },
                  },
                  grid: {
                    display: true,
                    color: "#ecf0f1",
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: "Values",
                    color: "#333",
                    font: {
                      family: "Roboto",
                      size: 16,
                      weight: "500",
                    },
                  },
                  grid: {
                    display: true,
                    color: "#ecf0f1",
                  },
                },
              }
            : {},
      },
      // Remove the plugins array here
      // plugins: [ChartDataLabels] // This is no longer needed
    };

    // Destroy previous chart instance if it exists
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }

    // Render the chart
    const ctx = document.getElementById("myChart").getContext("2d");
    window.myChart = new Chart(ctx, config);
  });

// Function to generate colors
function generateColors(num, datasetIndex) {
  const colors = [];
  const baseHue = (datasetIndex * 60) % 360; // Different base hue for each dataset

  for (let i = 0; i < num; i++) {
    const hue = (baseHue + i * 30) % 360;
    colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
  }
  return colors;
}

// Function to generate border colors (darker shades)
function generateBorderColors(num, datasetIndex) {
  const colors = [];
  const baseHue = (datasetIndex * 60) % 360;

  for (let i = 0; i < num; i++) {
    const hue = (baseHue + i * 30) % 360;
    colors.push(`hsla(${hue}, 70%, 40%, 1)`);
  }
  return colors;
}

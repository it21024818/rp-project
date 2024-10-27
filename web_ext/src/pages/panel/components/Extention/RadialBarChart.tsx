import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import { DataType } from "../../../../../types";
const RadialBarChart: React.FC<{ result: DataType }> = ({ result }) => {
  useEffect(() => {
    const options = {
      series: [
        result.result.sarcasmPresentResult.confidence * 100,
        result.result.sarcasmTypeResult.confidence * 100,
        result.result.sarcasmFakeResult.confidence * 100,
        result.result.sentimentFakeResult.confidence * 100,
        result.result.sentimentTypeResult.confidence * 100,
        result.result.sentimentTextTypeResult.confidence * 100,
        result.result.textQualityResult.confidence * 100,
        result.result.textFakeResult.confidence * 100,
        result.result.biasResult.confidence * 100,
        result.result.biasFakeResult.confidence * 100,
      ],
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#000",
              offsetY: 20,
            },
            value: {
              show: true,
              fontSize: "14px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#000",
              offsetY: 20,
              formatter: (val: number) => `${val}%`,
            },
            barLabels: {
              enabled: true,
              useSeriesColors: true,
              offsetX: -8,
              fontSize: "16px",
              color: "#000",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter: function (seriesName: string, opts: any) {
                return `${seriesName}: ${
                  opts.w.globals.series[opts.seriesIndex]
                }%`;
              },
            },
          },
        },
      },
      colors: [
        "#1ab7ea",
        "#0084ff",
        "#39539E",
        "#0077B5",
        "#FF6347",
        "#32CD32",
        "#FFD700",
        "#FF4500",
        "#8A2BE2",
        "#5F9EA0",
      ],
      labels: [
        "Sarcasm Present",
        "Sarcasm Type",
        "Sarcasm Fake",
        "Sentiment Fake",
        "Sentiment Type",
        "Sentiment Text Type",
        "Text Quality",
        "Text Fake",
        "Bias",
        "Bias Fake",
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: true,
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [result]);

  return <div id="chart" style={{ width: "100%", height: "400px" }} />;
};

export default RadialBarChart;

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import FilterBox from "../Components/chartFilterBox";
const columnDefs = [{}];

const ChartComponent = ({ chartData }) => {
  const [filterValue, setFilterValue] = useState("Revenue Receipts");
  const [formattedChartData, setFormattedChartData] = useState({});

  useEffect(() => {
    const filterChartData = chartData.find((data) => data.name === filterValue);
    formChartData(filterChartData.series);
  }, [filterValue]);

  const formLegendsAndXaxis = (series) => {
    let legends = [];
    let xAxis = [];
    series.map((legend) => {
      legends.push(legend.key);
      legend.values.map((value) => {
        xAxis.push(value.label);
      });
    });
    const seriesData = formSeriesData(legends, series);
    return [legends, xAxis, seriesData];
  };

  const formSeriesData = (legends, series) => {
    let seriesData = [];
    series.map((data, index) => {
      seriesData.push({
        name: legends[index],
        type: "line",
        stack: "total",
        data: formSeriesDataValues(data.values),
      });
    });
    return seriesData;
  };

  const formSeriesDataValues = (data) => {
    let ValuesArray = [];
    data.map((item) => {
      ValuesArray.push(item.value);
    });
    return ValuesArray;
  };

  const formChartData = (data) => {
    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: formLegendsAndXaxis(data)[0],
      },
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: formLegendsAndXaxis(data)[1],
      },
      yAxis: {
        type: "value",
        name: filterValue,
      },
      series: formLegendsAndXaxis(data)[2],
    };
    setFormattedChartData(option);
  };

  return (
    <div style={{ display: "grid", gridAutoFlow: "column" }}>
      <div>
        <FilterBox
          data={chartData}
          onClick={(value) => {
            setFilterValue(value);
          }}
        />
      </div>
      <div>
        <ReactECharts
          style={{ height: "35em", width: "60em" }}
          option={formattedChartData}
        />
      </div>
    </div>
  );
};

export default ChartComponent;

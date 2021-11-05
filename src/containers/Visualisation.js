import React, { useEffect, useState } from "react";
import axios from "axios";
import { CKAN_API_VISUALISATION_ENDPOINT } from "../constants";
import { groupBy } from "lodash";
import { readRemoteFile } from "react-papaparse";
import Chart from "../Components/chart";
import {
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiBasicTable,
  EuiPage,
  EuiPageBody,
  EuiSpacer,
  EuiButtonGroup,
} from "@elastic/eui";

const VisualisationIndex = () => {
  const [columnDefs, setcolumnDefs] = useState([]);
  const [rowDefs, setrowDefs] = useState([]);
  const [viewType, setViewType] = useState("table");
  const [title, setTitle] = useState("");
  const [chartData, setChartData] = useState("");

  useEffect(() => {
    let groupByFormat;
    axios
      .get(`${CKAN_API_VISUALISATION_ENDPOINT}`)
      .then((response) => {
        let data = response.data;
        setTitle(data?.result?.results[0]["title"]);
        groupByFormat = groupBy(data?.result?.results[0]?.resources, "format");
        fetchJsonData(groupByFormat.CSV, groupByFormat.JSON);
      })
      .catch((error) => {});
  }, []);

  const formTableData = (results) => {
    let columnData = [];
    Object.entries(results.data[0]).forEach(([key, value]) => {
      columnData.push({
        field: key,
        name: key,
        truncateText: true,
      });
    });
    setcolumnDefs(columnData);
    setrowDefs(results.data);
  };

  const formChartData = (data) => {
    console.log(
      "🚀 ~ file: Visualisation.js ~ line 51 ~ formChartData ~ data",
      data
    );
    setChartData(data);
  };

  const fetchJsonData = async ([csvData], [jsonData]) => {
    readRemoteFile(csvData.url, {
      header: true,
      complete: (results) => {
        formTableData(results);
      },
    });
    let fetchJsonData = await (await fetch(jsonData.url)).json();
    formChartData(fetchJsonData);
  };

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageContentHeaderSection>
          <EuiTitle size="l">
            <h2>{title}</h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
        <EuiSpacer />

        <EuiPageContentHeaderSection>
          <EuiButtonGroup
            legend=""
            options={[
              {
                id: `table`,
                label: "Table",
              },
              {
                id: `chart`,
                label: "Chart",
              },
            ]}
            idSelected={viewType}
            onChange={(id) => setViewType(id)}
          />
        </EuiPageContentHeaderSection>
        {viewType === "table" ? (
          <EuiBasicTable columns={columnDefs} items={rowDefs} />
        ) : (
          <Chart chartData={chartData} />
        )}
      </EuiPageBody>
    </EuiPage>
  );
};

export default VisualisationIndex;

import Filters from 'components/Filters';
import { barOptions, pieOptions } from './chart-options';
import Chart from 'react-apexcharts';
import { buildBarSeries, getGenderChartData, getPlatformChartData } from './helpers';
import './styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

type PieChartData = {
  labels: string[];
  series: number[];
}

type BarChartData = {
  x: string;
  y: number;
}

const initialPyData = {
  labels: [],
  series: []
}

const BASE_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';

const Charts = () => {
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [platformData, setPlatformData] = useState<PieChartData>(initialPyData);
  const [genderData, setGenderData] = useState<PieChartData>(initialPyData);

  const getData = async () => {
    const recordsResponse = await axios.get(`${BASE_URL}/records`);
    const gamesResponse = await axios.get(`${BASE_URL}/games`);

    const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
    setBarChartData(barData);

    const platformChartData = getPlatformChartData(recordsResponse.data.content);
    setPlatformData(platformChartData);

    const genderChartData = getGenderChartData(recordsResponse.data.content);
    setGenderData(genderChartData);
  } 

  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="page-container">
      <Filters link="records" linkText="VER TABELA" />
      <div className="chart-container">
        <div className="top-related">
          <h1 className="top-related-title">
            Jogos mais Votados
          </h1>
          <div className="games-container">
            <Chart
              options={barOptions}
              type="bar"
              width="900"
              height="650"
              series={[{ data: barChartData }]}
            />
          </div>
        </div>
        <div className="charts">
          <div className="platform-chart">
            <h2 className="chart-title">Plataformas</h2>
            <Chart
              options={{ ...pieOptions, labels: platformData?.labels }}
              type="donut"
              series={platformData?.series}
              width="350"
            />
          </div>
          <div className="gender-chart">
            <h2 className="chart-title">Gêneros</h2>
            <Chart
              options={{ ...pieOptions, labels: genderData?.labels }}
              type="donut"
              series={genderData?.series}
              width="350"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
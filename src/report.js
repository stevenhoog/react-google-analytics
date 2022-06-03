import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

function toMonthName(monthNumber) {
  const date = new Date();


  date.setMonth(monthNumber - 1);
  date.setHours(0, 0, 0);
  //console.log(date);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

function Report() {
  const [data, setData] = useState([]);

  //Start date 
  var startDate = new Date(new Date().getFullYear()-1, 0, 1);
  startDate.setHours(+1);
  var startYear = startDate.toISOString().slice(0, 4);

  //End date last day of last month
  var endDate=new Date(); // current date
  endDate.setDate(1); // going to 1st of the month
  endDate.setHours(-1); //1 hour back to get last day of last month
  var endYear = endDate.toISOString().slice(0, 4);

  const option = {
      grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
      title: {
        text: 'INTK website sessions'
      },
      legend: {
        data: [startYear, endYear]
      },
      tooltip: {
          trigger: "axis"
      },
      xAxis: {
        type: 'category',
          boundaryGap: false,
          data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: startYear,
          type: 'line',
          stack: 'Total',
          data: []
        },
        {
          name: endYear,
          type: 'line',
          stack: 'Total',
          data: []
        }
      ]
  }; 

  useEffect(() => {
    const queryReport = () => {//(1)
      window.gapi.client
        .request({
          path: "/v4/reports:batchGet",
          root: "https://analyticsreporting.googleapis.com/",
          method: "POST",
          body: {
            reportRequests: [
              {
                viewId: "12144382", //enter your view ID here
                dateRanges: [
                  {
                    startDate: startDate.toISOString().slice(0, 10),
                    endDate: endDate.toISOString().slice(0, 10),
                  },
                ],
                metrics: [
                  {
                    expression: "ga:sessions",
                  },
                ],
                dimensions: [
                  {
                    name: "ga:month",
                  },
                  {
                    name: "ga:year",
                  }
                ],
              },
            ],
          },
        })
        .then(displayResults, console.error.bind(console));
    };

    const displayResults = (response) => {//(2)
      const queryResult = response.result.reports[0].data.rows;
      const result = queryResult.map((row) => {
        const dateSting = row.dimensions[0];
        const month = toMonthName(dateSting);
        const formattedDate = `${dateSting.substring(0, 4)}
        -${dateSting.substring(4, 6)}-${dateSting.substring(6, 8)}`;
        return {
          date: `${row.dimensions[1]}-${row.dimensions[0]}`,
          visits: row.metrics[0].values[0],
        };
      });
      setData(result);
    };

    queryReport();
  }, []);

  /*
  return data.map((row) => (
    <div key={row.date}>{`${row.date}: ${row.visits} visits`}</div>//(3)
  ));
  */
  data.map(function(row) {
      if (row.date.indexOf(startYear) > -1) {
        option['series'][0]['data'].push(row.visits);
      }
      if (row.date.indexOf(endYear) > -1) {
        option['series'][1]['data'].push(row.visits);
      }
  });
  return ( <ReactEcharts option={option} style={{ height: 400 }} />);
}

export default Report;
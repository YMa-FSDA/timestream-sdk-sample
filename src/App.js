import './App.css';
import { TimestreamQuery, QueryCommand } from "@aws-sdk/client-timestream-query"; // ES Modules import
import React from 'react'

function App() {

  // basic config for the query client

  // NOTE: please replace the credentials with the ones in the .csv file for solely demonstration purpose. the credentials should be associated with the authorised users. we could discussed how
  //       to implement this feature afterwards. 

  const config = {
    'region': 'eu-west-1',
    'credentials': {
      'accessKeyId': 'ACCESSKEYID', 'secretAccessKey': 'SECRETACCESSKEY'
      //              ↑↑↑↑↑↑↑↑↑↑↑                       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      //              replace with the ones in .csv file
    }
  }

  // setup the client with config

  const queryClient = new TimestreamQuery(config);

  // basic query to get data from the db

  const query1 = 'select * from "CF_Demo_DataBase"."myTestDemo_houlysummary" limit 2';
  
  // NOTE:
  // There is 3 tables in the database, 'CF_Demo_DataBase', which are:
  //    myTestDemo_daily_summary
  //    myTestDemo_hourly_summary
  //    myTestDemo
  // As the names suggest, these are the records of raw data, hourly, and daily summaries.

  // main function to retrieve data 
  // NOTE: becasue the response will return the nextToken, the function need to be called multiple times to get all data rows until the nextToken is null.

  const getAllRows = async (query, nextToken = undefined) => {
    const params = {
      QueryString: query
    };

    if (nextToken) {
      params.NextToken = nextToken;
    }
    const command = new QueryCommand(params);

    queryClient.send(command)
      .then(
        (response) => {
          parseQueryResult(response);
          if (response.NextToken) {
            getAllRows(query, response.NextToken);
          }
        },
        (err) => {
          console.error("Error while querying:", err);
        });
  }

  // this is the function to display the data in the console. 

  const parseQueryResult = (response) => {
    console.log("Current query status: " + JSON.stringify(response.QueryStatus));
    console.log(response);
  }

  // call the function with the desired query.

  getAllRows(query1);

  return (
    <div className='App-header'>
      <p style={{'width':'500px'}}>
        Check the response from the server in the console. Basically, the response comprises of ColumnInfo and Rows which requires
        post process to clean up the data.
      </p>

    </div>
  );
}

export default App;

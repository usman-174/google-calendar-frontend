import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import  { SWRConfig } from 'swr'
import axios from "axios";
axios.defaults.baseURL=process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
const fetcher = async (url) => {
  // let cancelToken;
  try {
    // if(typeof cancelToken !== typeof undefined){
    //   cancelToken.cancel("Cancelling the request");
    // }
    // cancelToken = axios.CancelToken().source()
    const { data } = await axios.get(url)
    return data
      
  } catch (error) {
      throw error.response.data
  }
}
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
    <SWRConfig 
      value={{
        revalidateOnFocus:false,
        refreshInterval: 600000,
        shouldRetryOnError:false,
        fetcher
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SWRConfig>
      
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

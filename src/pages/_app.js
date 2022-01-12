import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Head from "next/head";
import { SWRConfig } from "swr";
import "../style.css";
import { theme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
if (

  process.env.NEXT_APP_NODE_ENV !== "production" ||
  process.env.NODE_ENV !== "production"
) {
    console.log(process.env.NEXT_APP_NODE_ENV)
  console.log(process.env.NODE_ENV)
  axios.defaults.baseURL = "https://iframe-calendar.herokuapp.com/";
} else {
  console.log(process.env.NEXT_APP_NODE_ENV)
  console.log(process.env.NODE_ENV)
  axios.defaults.baseURL =
  process.env.NEXT_APP_SERVER_URL ||
  process.env.SERVER_URL ||
  "https://iframe-calendar.herokuapp.com/";
}

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <CacheProvider value={emotionCache}>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          refreshInterval: 600000,
          shouldRetryOnError: false,
          fetcher,
        }}
      >
        <Head>
          <title>IFRAME CALENDAR APP</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ChakraProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </ChakraProvider>
        </LocalizationProvider>
      </SWRConfig>
    </CacheProvider>
  );
};

export default App;

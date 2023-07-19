/* Redux */
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { orange } from "@mui/material/colors";
import store from "./store"
import Startup from "./Startup";

const theme = createTheme({
  status: {
    danger: orange[500],
  },
});

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Startup />
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

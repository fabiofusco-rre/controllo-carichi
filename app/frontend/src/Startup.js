/* Redux */
import React from "react";
import { connect } from "react-redux";
import { initUserConfig } from "./service/UserConfig";
import userSettings from "./config/userSettings.json";
import { loadConfigs } from "./store/load/actions";
import LoaderScreen from "./pages/LoaderScreen";
import Home from "./pages/Home";


function Startup({loadConfigs, loadingConfigs, configs}) {
  initUserConfig(userSettings);
  const [startupProcess, setStartupProcess] = React.useState(false);
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!startupProcess) {
      setStartupProcess(true);
    }
  }, []);

  React.useEffect(()=>{
    if(startupProcess){
      loadConfigs();
    }
  }, [startupProcess])

  React.useEffect(()=>{
    if(configs !== null){
      setAppIsReady(true);
    }
  }, [configs, loadingConfigs])

  return (
    <>
      {
        appIsReady && 
          <Home/>
      }
      {
        !appIsReady && 
          <LoaderScreen/>
      }
    </>
  );
}

const mapStateToProps = ({ Load }) => ({
  loadingConfigs: Load.loadingConfigs,
  configs: Load.configs,
});

const mapDispatchToProps = dispatch => ({
  loadConfigs: () => dispatch(loadConfigs()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Startup)

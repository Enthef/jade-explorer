import { AppBar, CssBaseline, Theme, Toolbar, Typography, IconButton, Grid, InputBase, Tooltip } from "@material-ui/core"; //tslint:disable-line
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import React, { Dispatch, ChangeEvent, KeyboardEvent, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import useDarkMode from "use-dark-mode";
import "./App.css";
import Address from "./containers/Address";
import Block from "./containers/Block";
import Dashboard from "./containers/Dashboard";
import NodeView from "./containers/NodeView";
import Transaction from "./containers/Transaction";
import ConfigurationMenu from "./containers/ConfigurationMenu";
import { darkTheme, lightTheme } from "./themes/jadeTheme";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import NotesIcon from "@material-ui/icons/Notes";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import CodeIcon from "@material-ui/icons/Code";

import useInterval from "use-interval";
import useServiceRunnerStore from "./stores/useServiceRunnerStore";
import useMultiGethStore from "./stores/useMultiGethStore";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import ETHJSONSpec from "@etclabscore/ethereum-json-rpc-specification/openrpc.json";

import createHistory from "history/createBrowserHistory";
const history = createHistory();

const useStyles = makeStyles((theme: Theme) => ({
  title: {
  },
}));

function App(props: any) {
  const darkMode = useDarkMode();
  const [search, setSearch] = useState();
  const theme = darkMode.value ? darkTheme : lightTheme;

  const [, , setServiceRunnerUrl] = useServiceRunnerStore();
  const [erpc, setMultiGethUrlOverride]: [EthereumJSONRPC, Dispatch<string>] = useMultiGethStore();

  const classes = useStyles(theme);
  const handleConfigurationChange = (type: string, url: string) => {
    if (type === "service-runner") {
      setServiceRunnerUrl(url);
    } else if (type === "ethereum-rpc") {
      setMultiGethUrlOverride(url);
    }
  };

  React.useEffect(() => {
    if (erpc) {
      erpc.startBatch();
    }
  }, [erpc]);

  useInterval(() => {
    if (erpc) {
      erpc.stopBatch();
      erpc.startBatch();
    }
  }, 100, true);

  const isAddress = (query: string): boolean => {
    const re = new RegExp(ETHJSONSpec.components.schemas.Address.pattern);
    return re.test(query);
  };

  const isKeccakHash = (query: string): boolean => {
    const re = new RegExp(ETHJSONSpec.components.schemas.Keccak.pattern);
    return re.test(query);
  };

  const isBlockNumber = (query: string): boolean => {
    const re = new RegExp(/^-{0,1}\d+$/);
    return re.test(query);
  };

  const handleSearch = async (query: string) => {
    if (isAddress(query)) {
      history.push(`/address/${query}`);
    }
    if (isKeccakHash(query)) {
      let transaction;

      try {
        transaction = await erpc.eth_getTransactionByHash(query);
      } catch (e) {
        // do nothing
      }

      if (transaction) {
        history.push(`/tx/${query}`);
      }
      let block;
      try {
        block = await erpc.eth_getBlockByHash(query, false);
      } catch (e) {
        // do nothing
      }
      if (block) {
        history.push(`/block/${query}`);
      }
    }
    if (isBlockNumber(query)) {
      const block = await erpc.eth_getBlockByNumber(`0x${parseInt(query, 10).toString(16)}`, false);
      if (block) {
        history.push(`/block/${block.hash}`);
      }
    }
  };

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Grid justify="space-between" alignItems="center" alignContent="center" container>
              <Grid item style={{ marginTop: "8px" }} direction="row">
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={"/"}>
                      {children}
                    </RouterLink>
                  )}>
                  <Grid container>
                    <Grid>
                      {darkMode.value ?
                        <img
                          alt="jade-explorer"
                          height="30"
                          style={{ marginRight: "5px" }}
                          src="https://github.com/etclabscore/jade-media-assets/blob/master/jade-logo-dark/jade-logo-dark%20(PNG)/32x32.png?raw=true" //tslint:disable-line
                        />
                        :
                        <img
                          alt="jade-explorer"
                          height="30"
                          style={{ marginRight: "5px" }}
                          src="https://github.com/etclabscore/jade-media-assets/blob/master/jade-logo-light/jade-logo-light%20(PNG)/32x32.png?raw=true" //tslint:disable-line
                        />
                      }
                    </Grid>
                    <Grid>
                      <Typography className={classes.title} color="textSecondary" variant="h6">Jade Explorer</Typography>
                    </Grid>
                  </Grid>
                </Link>
              </Grid>
              <Grid item xs={7}>
                <InputBase
                  placeholder="Enter an Address, Transaction Hash or Block Number"
                  onKeyDown={
                    (event: KeyboardEvent<HTMLInputElement>) => {
                      if (event.keyCode === 13) {
                        handleSearch(search.trim());
                      }
                    }
                  }
                  onChange={
                    (event: ChangeEvent<HTMLInputElement>) => {
                      setSearch(event.target.value);
                    }
                  }
                  fullWidth
                  style={{ background: "rgba(0,0,0,0.1)", borderRadius: "4px", padding: "0px 10px", marginRight: "5px" }}
                />
              </Grid>
              <Grid item>
                <Tooltip title="JSOSN-RPC API Documentation">
                  <IconButton
                    onClick={() =>
                      window.open("https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/etclabscore/ethereum-json-rpc-specification/master/openrpc.json")
                    }>
                    <NotesIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Jade Explorer Github">
                  <IconButton
                    onClick={() =>
                      window.open("https://github.com/etclabscore/jade-explorer")
                    }>
                    <CodeIcon />
                  </IconButton>
                </Tooltip>
                <ConfigurationMenu onChange={handleConfigurationChange} />
                <Tooltip title="Toggle Dark Mode">
                  <IconButton onClick={darkMode.toggle}>
                    {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div style={{ margin: "0px 25px 0px 25px" }}>
          <Switch>
            <Route path={"/"} component={Dashboard} exact={true} />
            <Route path={"/block/:hash"} component={Block} />
            <Route path={"/blocks"} component={NodeView} />
            <Route path={"/tx/:hash"} component={Transaction} />
            <Route path={"/address/:address"} component={Address} />
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;

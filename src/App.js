import "./App.css";
import Main from "./containers";
import Datasets from "./containers/Dateset";
import Visualisation from "./containers/Visualisation";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "@elastic/eui/dist/eui_theme_light.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/datasets">
          <Datasets />
        </Route>
        <Route path="/visualisation">
          <Visualisation />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

import {Route, Routes} from "react-router-dom";
import Main from "./Views/Main/Main"
import AlgoRewriter from "./Views/ListAlgo/AlgoRewriter";

function App() {
    return (
        <Routes>
            <Route path={'/'} element={<Main/>}/>
            <Route path={'/Algo-Rewriter'} element={<AlgoRewriter/>}/>
        </Routes>
    );
}

export default App;

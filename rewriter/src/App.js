import { Route, Routes } from "react-router-dom";
import Main from "./Views/Main/Main"
// import AlgoRewriter from "./Views/ListAlgo/AlgoRewriter";
import { GlobalProvider } from "./Hooks/GlobalContext";
import Header from "./Views/Main/Header";
import Footer from "./Views/Main/Footer";

function App() {
	return (
		<GlobalProvider>
			<Header />
			<Routes>
				<Route path="/" element={<Main />} />
			</Routes>
			<Footer />
		</GlobalProvider>
	);
}

export default App;

import {Route, Routes} from "react-router-dom";
import Main from "./Views/Main/Main"
import AlgoRewriter from "./Views/ListAlgo/AlgoRewriter";
import {GlobalProvider} from "./Hooks/GlobalContext";
import Header from "./Views/Main/Header";
import Footer from "./Views/Main/Footer";
import Edit from "./Views/User/Edit";
import Login from "./Views/User/Login";
import Register from "./Views/User/Register";
import Profil from "./Views/User/Profil";
import AdresseWithId from "./Views/User/Profil/AdresseWithId";
import Wish from "./Views/Wishes/Wish";

function App() {
    return (
        <GlobalProvider>
            <Header/>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/Edit/" element={<Edit/>}/>
                <Route path="/Edit/Adresse/:id" element={<AdresseWithId/>}/>
                <Route path="/Register/" element={<Register/>}/>
                <Route path="/Login/" element={<Login/>}/>
                <Route path="/Profil/" element={<Profil/>}/>
                <Route path="/Wish/" element={<Wish/>}/>
            </Routes>
            <Footer/>
        </GlobalProvider>
    );
}

export default App;

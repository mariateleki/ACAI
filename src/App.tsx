import { HashRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/common";
import { About } from "./components/About";
import { Map } from "./components/Map";

function App() {
    return (
        <HashRouter basename="/">
            <div className="app">
                <Header />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Map />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/*" element={<Map />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
}

export default App;

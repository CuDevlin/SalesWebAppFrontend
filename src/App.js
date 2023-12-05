import { Routes, Route } from "react-router-dom";
import TopBar from "./scenes/global/TopBar";
import AppSidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import TableData from "./scenes/tabledata";
import CharData from "./scenes/chartdata";

function App() {


    return (
        <div>
            <TopBar />
            <div className="app">
                <AppSidebar />

                <main className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/data" element={<TableData />} />
                        <Route path="/chart" element={<CharData />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;

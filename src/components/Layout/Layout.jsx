import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
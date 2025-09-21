import { Outlet } from "react-router";
import { LeftMenu } from "../LeftMenu";
import { TopMenu } from "../TopMenu";

export default function MainLayout() {
  //: React.FC
  // display: flex probably not needed
  return (
    <div style={{ display: "flex" }}>
      {/* <LeftMenu /> */}

      <main style={{ flexGrow: 1, padding: "10px" }}>
        <TopMenu />
        <Outlet />
      </main>
    </div>
  );
}

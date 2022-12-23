import Sidebar from "../ChatComponents/Sidebar";
import Chat from "../ChatComponents/Chat";

const Home = () => {
  return (
    <div className="homePage">
      <div className="conteiner">
        <Sidebar></Sidebar>
        <Chat></Chat>
      </div>
    </div>
  );
};

export default Home;

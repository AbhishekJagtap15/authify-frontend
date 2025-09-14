import Header from "../components/header";
import MenuBar from "../components/menubar";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-content-center min-h-100">
            <MenuBar />
            <Header />
        </div>
    )
}
export default Home;
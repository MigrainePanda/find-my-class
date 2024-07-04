import Navbar from "../../components/Navigation/Navigation"

import "./HomePage.css"

function HomePage() {
    return (
        <div className="outer-wrapper">
            <Navbar />
            <main className="main">
                <p className="page-main-description">Find your class around Oregon State University.</p>
                <p className="page-description">This is an app that helps you find your class at Oregon State University.</p>
            </main>
        </div>
    );}

export default HomePage;
import Navbar from "../../components/Navigation/Navigation"

import "./HomePage.css"

function HomePage() {
    return (
        <div className="outer-wrapper">
            <Navbar />
            <main className="main">
                <p className="page-description">Find your class around Oregon State University.</p>
                
            </main>
        </div>
    );}

export default HomePage;
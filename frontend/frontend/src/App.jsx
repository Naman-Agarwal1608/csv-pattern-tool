import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form from "./components/Form";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="mt-5">Welcome</h1>
        <Form />
      </main>
      <Footer />
    </div>
  );
}

export default App;
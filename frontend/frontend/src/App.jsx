import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form from "./components/Form";

function App() {
  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="mt-5">Welcome</h1>
        <Form />
      </main>
      <br />
      <Footer />
    </div>
  );
}

export default App;

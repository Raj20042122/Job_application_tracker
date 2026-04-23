import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const token = localStorage.getItem("token");

  return token ? <Dashboard /> : <Login />;
}

export default App;

<div className="bg-blue-500 text-white p-4">
  Tailwind Test
</div>
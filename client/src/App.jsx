import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div className="p-8 text-center text-xl">LaundryKu</div>} />
      </Routes>
    </Layout>
  );
}

export default App;

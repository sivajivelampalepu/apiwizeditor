
import './App.css';
import MainEditor from './Components/MainEditor';
import store from './Store/store';
import { Provider } from 'react-redux';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  return (
  

     <Provider store={store}>
      
      <div className="App">
        <Header/>
        <MainEditor />
        <Footer/>
      </div>
    </Provider>
    
  );
}

export default App;

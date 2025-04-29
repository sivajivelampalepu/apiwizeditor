
import './App.css';
import MainEditor from './Components/MainEditor';
import store from './Store/store';
import { Provider } from 'react-redux';
import Header from './Components/Header';
import Footer from './Components/Footer';
import CustomEditor from './Components/CustomEditor';

function App() {
  return (
  

     <Provider store={store}>
      
      <div className="App">
        <Header/>
        {/* <MainEditor />
         */}
         <CustomEditor/>
        <Footer/>
      </div>
    </Provider>
    
  );
}

export default App;

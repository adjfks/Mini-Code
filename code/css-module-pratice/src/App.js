import appStyles from './App.module.css'
import indexStyles from './index.css'

function App() {
  return (
    <div className={appStyles.red}>
      App
      {/* <p className="green">I am green</p> */}
      <p className={indexStyles.green}>I am green</p>
    </div>
  );
}

export default App;

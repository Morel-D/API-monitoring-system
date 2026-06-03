import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './app/Router'
import { ToastContainer } from './utils/widgets/toast/Toastcontainer';

function App() {

  return (
            <>
              <RouterProvider router={router} />
              <ToastContainer />
            </>
          );
}

export default App

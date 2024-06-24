import {Outlet} from 'react-router-dom';
import TopBar from "../components/TopBar";




function RootLayout () {
    return (<>
    <TopBar/>
   <Outlet/>

    </>)
}


export default RootLayout;
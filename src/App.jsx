import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "./pages/auth/SignIn";
import AllRoutes from "./routers/AllRouters";
import NavBar from "./components/navBar/NavBar";
import React, { useEffect } from "react";
import { getNewUserData } from "./store/actions/userAction";
import { getUserById } from "./db/dbUser";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "./theme/AppThemes";

const App = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) return;

    dispatch(
      getNewUserData(
        user.id,
        (user) => {
          console.log(">>>check new data: ", user);
        },
        (error) => {
          console.log("error get new user data: ", error);
        }
      )
    );
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem("firstVisit", false);
  }, []);

  return (
    <div className="App">
      {/* {user.user ? <AllRoutes /> : <SignIn />} */}

      <ThemeProvider theme={violet_theme}>
        <AllRoutes />
      </ThemeProvider>
    </div>
  );
};

export default App;

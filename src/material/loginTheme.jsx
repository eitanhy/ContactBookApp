import {createMuiTheme} from "@material-ui/core/styles/index";
import blue from "@material-ui/core/colors/blue";

// Theme for material style login page
const loginTheme = createMuiTheme({
    palette: {
        primary: {
            main: blue[300]
        },
        type: 'dark'
    },
    typography: {
        fontFamily: 'Montserrat',
        fontSize: 24
    }
});

export default loginTheme;
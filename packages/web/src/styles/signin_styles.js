import { makeStyles } from "@material-ui/core/styles";
// import images from "../assets/login_screen.png";
import images from "../assets/login-bg-img.jpg";

export default () =>
    makeStyles((theme) => ({
        root: {
            height: "100vh",
        },
        image: {
            backgroundImage: `url(${images})`,
            backgroundRepeat: "no-repeat",
            backgroundColor:
                theme.palette.type === "light"
                    ? theme.palette.grey[50]
                    : theme.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        paper: {
            margin: theme.spacing(6, 4),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        paperBG: {
            backgroundImage: `url(${images})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },

        media: {
            length: 200,
            width: 200,
        },

        sign_in_header: {
            textAlign: 'center',
        },

        logo_container: {
            margin: '0%'
        },

                
        formControl: {
            // margin: theme.spacing(1),
            minWidth: '100%',
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

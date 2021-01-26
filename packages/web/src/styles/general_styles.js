import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
        root: {
            height: "100vh",
        },
        footerContainer: {
            paddingTop: 10,
            paddingBottom: 10,
        },
        footer: {
            position: "absolute",
            backgroundColor: '#18516c',
            bottom: 0,
            width: "100%",
            alignItems: "center",
            color: "#fa971f"
        },
        contactDetails: {
            flexGrow: 1,
            textAlign: "center",
        },
        root: {
            flexGrow: 1,
        },
        margin: {
            margin: theme.spacing(1),
        },
        menu_functions: {
            paddingTop: "10%",
        },
        menu: {
            width: "100%",
            marginRight: "5%",
        },
        button_fluid: {
            width: "90%",
            padding: 10,
        },
        info_padding: {
            padding: 20,
        },
        label_paddings: {
            padding: 10,
        },
        alert_level_0: {
            color: "green",
        },
        alert_level_1: {
            color: "blue",
        },
        alert_level_2: {
            color: "#f09e01",
        },
        alert_level_3: {
            color: "red",
        },
        header: {
            margin: 50,
        },
        container: {
            display: "flex",
            flexWrap: "wrap",
        },
        img_container: {
            heigth: "80%",
            width: "80%",
            zIndex: 1000,
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: "100%",
        },
        thumbnail: {
            flexWrap: "nowrap",
            transform: "translateZ(0)",
        },
        gridTitle: {
            color: "#fffffff",
        },
        thumbnailTitle: {
            background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
        },

        fabGreen: {
            background: "green",
            color: "white",
            fontWeight: "bold",
        },
        fabRed: {
            background: "red",
            color: "black",
            fontWeight: "bold",
        },

        releaseEwiButton: {
            height: "130%",
        },

        btnGroup: {
            // display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
            margin: theme.spacing(1),
            },
        },

        raPaper: {
            padding: 20,
        },
        editLink: {
            fontSize: 20
        }
}));

const tableStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 75,
    },
}));

export {useStyles, tableStyles};
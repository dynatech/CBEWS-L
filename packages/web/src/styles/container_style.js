import { makeStyles } from "@material-ui/core/styles";
const width = window.innerWidth;
const height = window.innerHeight;

const ContainerStyle = makeStyles((theme) => ({
    header: {
        backgroundColor: "#083451",
        alignItems: "center",
        padding: "3.1%",
    },
    content: {
        width: "100%",
        alignContent: "center",
        marginTop: "5%",
        marginBottom: "5%",
    },
    dashboard_container: {
        flex: 1,
        alignContent: "center",
        margin: "5%",
    },
    login_content: {
        flex: 1,
        paddingRight: "5%",
        paddingLeft: "5%",
    },
    dashboard_content: {
        flex: 2.5,
    },
    dashboard_menu: {
        flex: 1,
    },
    datatable_content: {
        flex: 0.5,
    },
    input_label_combo: {
        // flexDirection: 'row'
        padding: 10,
    },
    menu_row: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        marginBottom: height * 0.03,
    },
    seals: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    dashboard_seals: {
        flexDirection: "row",
        flex: 0.5,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
    },
    weather_container: {
        alignItems: "center",
        paddingBottom: height * 0.03,
    },
    menu_container: {
        textAlign: "center",
    },
    hr: {
        borderColor: "#083451",
        borderRadius: 10,
        borderBottomWidth: 2,
        paddingBottom: 5,
    },
}));

export { ContainerStyle };

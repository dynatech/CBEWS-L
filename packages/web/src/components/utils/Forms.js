import React, {
    useState,
    useEffect,
    Fragment,
    MuiPickersUtilsProvider,
    DateTimePicker,
} from "react";
import {
    Container,
    Grid,
    Typography,
    Button,
    TextField,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import MomentUtils from "@date-io/moment";
import moment from "moment";

import { ContainerStyle } from "../../styles/container_style";
import { ButtonStyle } from "../../styles/button_style";
import { LabelStyle } from "../../styles/label_style";
import { Formik, Form, Field } from "formik";

function ReusableInput(props) {
    const {
        propKey,
        label: temp,
        value,
        handleBlur,
        handleChange,
        reference,
        originalProps
    } = props;
    let label = temp[0].toUpperCase() + temp.slice(1);
    label = label.replace("_", " ");
    const key = propKey.replace(/\s/g, "");

    let component;    
    if (Array.isArray(value)) {
        console.log("value", value);
        if ("customHandlers" in originalProps) {
            const { customHandlers } = originalProps;
            let auto_handler = console.log("This is the autohandler");
            let option = [];
            switch (customHandlers.type) {
                case "moms":
                    auto_handler = customHandlers[label];
                    option = props.fData.current.custom_values[label];
                    break;
                default:
                    console.log("does not exist!");
            }

            if (Object.prototype.toString.call(value) !== "[object Object]") {
                return (
                    <Grid item xs={6}>
                        <Autocomplete
                            freeSolo
                            id="freeSoloCombo"
                            disableClearable
                            options={option.map((option) => option.type)}
                            onChange={(event) => auto_handler(event.target.innerText, props.fData)}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label={label}
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps, type: 'search' }}
                                        onChange={(event) => { console.log("selected", event.target.value) }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                );
            } else {
                console.log("OBject");
            }
        }
    } else if (propKey in reference.string) {
        component = (
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id={propKey}
                    label={label}
                    onChange={handleChange(`${key}`)}
                    onBlur={handleBlur(`${key}`)}
                    defaultValue={value}
                    required
                />
            </Grid>
        );
    } else if (propKey in reference.int) {
        component = (
            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id={propKey}
                    label={label}
                    onChange={handleChange(`${key}`)}
                    onBlur={handleBlur(`${key}`)}
                    defaultValue={value}
                />
            </Grid>
        );
    } else if (propKey in reference.ts) {
        const val = moment(value).format("YYYY-MM-DD HH:mm:ss");
        component = (
            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id={propKey}
                    label={label}
                    onChange={handleChange(`${key}`)}
                    onBlur={handleBlur(`${key}`)}
                    defaultValue={val}
                />
            </Grid>
        );
    } else component = <Typography>Error</Typography>

    return component;
}

export default function Forms(props) {
    const classes = ButtonStyle();
    const { data, submitForm, deleteForm, formData, command } = props;
    const { string, int, ts } = data;

    // const [defaultValues, setDefaultValues] = useState(Object.assign({}, string, int, ts));
    const [defaultValues, setDefaultValues] = useState(Object.assign({}, string, int, ts));
    const [cmd, setCmd] = useState("");

    console.log("formData", formData);

    useEffect(() => {
        setCmd(command);
    }, []);

    return (
        <Formik
            initialValues={defaultValues}
            onSubmit={(values) => {
                formData.current.form_data = values;
                submitForm();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => {
                return (
                    <form className={classes.form} >
                        <Grid container spacing={1}>
                            {Object.entries(defaultValues).map((e, l) => {
                                const reference = { string, int, ts };
                                return (
                                    <ReusableInput
                                        propKey={e[0]}
                                        label={e[0]}
                                        value={e[1]}
                                        reference={reference}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        originalProps={props}
                                        fData={formData}
                                    />
                                );
                            })}
                            <Grid item xs={12}>
                                <Typography>* All fields are required</Typography>
                                <Typography>
                                    * Please review your details before submitting
                                </Typography>
                            </Grid>
                            {command != "add" ? (
                                <Fragment>
                                    <Grid item xs={6}>
                                        <Button
                                            className={classes.small2}
                                            onClick={handleSubmit}
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button 
                                            className={classes.small2}
                                            onClick={deleteForm}>Delete</Button>
                                    </Grid>
                                </Fragment>
                            ) : (
                                <Grid item xs={12}>
                                    <Button
                                        className={classes.small}
                                        onClick={handleSubmit}
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                )
            }}
        </Formik>
    );
}

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
    } = props;
    let label = temp[0].toUpperCase() + temp.slice(1);
    label = label.replace("_", " ");

    let component;
    if (propKey in reference.string) {
        component = (
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id={propKey}
                    label={label}
                    onChange={handleChange(propKey)}
                    onBlur={handleBlur(propKey)}
                    defaultValue={value}
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
                    onChange={handleChange(`${propKey}`)}
                    onBlur={handleBlur(`${propKey}`)}
                    defaultValue={value}
                />
            </Grid>
        );
    } else if (propKey in reference.ts) {
        const val = moment(value).format("YYYY-MM-DD HH:mm:ss");
        component = (
            // <Grid item xs={6}>
            //     <MuiPickersUtilsProvider utils={MomentUtils}>
            //         <DateTimePicker
            //             autoOk
            //             style={{paddingTop: 5}}
            //             ampm={false}
            //             disableFuture
            //             defaultValue={moment()}
            //             format="YYYY-MM-DD HH:mm:ss"
            //             // onChange={}
            //             label="Date time"
            //             fullWidth
            //         />
            //     </MuiPickersUtilsProvider>
            // </Grid>
            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id={propKey}
                    label={label}
                    onChange={handleChange(`${propKey}`)}
                    onBlur={handleBlur(`${propKey}`)}
                    defaultValue={val}
                />
            </Grid>
        );
    }

    return component;
}

export default function Forms(props) {
    const classes = ButtonStyle();
    const { data, submitForm, deleteForm, formData, command } = props;
    const { string, int, ts } = data;
    // const [defaultValues, setDefaultValues] = useState(Object.assign({}, string, int, ts));
    const [defaultValues, setDefaultValues] = useState({});
    const [cmd, setCmd] = useState("");

    useEffect(() => {
        setDefaultValues(Object.assign({}, string, int, ts));
        setCmd(command);
    }, []);

    return (
        <Formik
            initialValues={defaultValues}
            onSubmit={(values) => {
                formData.current = values;
                submitForm();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => {
                return (
                    <form className={classes.form} >
                        <Grid container spacing={1}>
                            {Object.entries(defaultValues).map((e, l) => {
                                let key = e[0].replace(/\s/g, "");
                                const reference = { string, int, ts };
                                return (
                                    <ReusableInput
                                        propKey={e[0]}
                                        label={e[0]}
                                        value={e[1]}
                                        reference={reference}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                );
                            })}
                            <Grid item xs={12}>
                                <Typography>* All fields are required</Typography>
                                <Typography>
                                    * Please review your details before submitting
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    className={classes.small}
                                    onClick={handleSubmit}
                                    type="submit"
                                >
                                    Submit
                                </Button>
                                {cmd != "add" && (
                                    <Button onClick={deleteForm}>Delete</Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                )
            }}
        </Formik>
    );
}

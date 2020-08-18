import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
    Grid, Container,
    Fab, Typography, TextField, MenuItem
} from "@material-ui/core";
import { useStyles, tableStyles } from '../../styles/general_styles';
import AppConfig from '../reducers/AppConfig';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { MarEventsTemplate } from '@dynaslope/commons';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Events() {
    const [template_key, setKey] = useState('');
    const [templates, setTemplates] = useState([]);

    const [ewiID, setEwiId] = useState('');
    const [template_name, setTemplateName] = useState('');
    const [message_template, setTemplateMessage] = useState('');
    const [modifiedBy, setModifiedBy] = useState('');

    const [isNew, setIsNew] = useState(false);
    const [tagHelperText, setTagHelperText] = useState('');
    const [templateHelperText, setTemplateHelperText] = useState('');
    const [newTemplate, setNewTemplate] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogText, setDialogText] = useState('');
    const [dialogCommand, setDialogCommand] = useState('save');

    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
	const [notifText, setNotifText] = useState('');

    const classes = useStyles();
    const newTagOption = {
        'id': 0,
        'template_name': '----NEW TEMPLATE----',
        'message_template': '',
        'ts_modified': '',
        'user_id': ''
    }

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const dialogConfirm = () => {
        switch(dialogCommand) {
            case 'delete':
                deleteTemplate();
                break;
            case 'update':
                break;
            case 'add':
                break;
            default:
                setDialogCommand('update')
        }
    }

    useEffect(()=> {
        initTemplates();
    },[]);

    const initTemplates = async (site_code = "mar") => { 
        // Leave site code for now, in preparation for umi / mar merge
        let template_container = [];
        const response = await MarEventsTemplate.GetAllEventsTemplate();
        if (response.status === true) {
            response.data.forEach(element => {
                template_container.push(element)
            });
            template_container.push(newTagOption);
            setKey(template_container[0].template_name);
            setTemplates(template_container);
            changeFieldValues(template_container[0].template_name, template_container);
        } else console.error("Problem in init message_template");
    }

    const modifyTemplate = async () => {
        let req_url = '';
        let method = '';
        let success_message = '';
        let fail_message = '';

        const data = {
            "id": ewiID,
            "template_name": template_name,
            "message_template": message_template,
            "user_id": 1
        };

        if (tagHelperText.length == 0 && templateHelperText.length == 0) {
            // Leave user_id: 1 for testing 
            let response;
            if (isNew == true) response = await MarEventsTemplate.InsertEventsTemplate(data);
            else response = await MarEventsTemplate.UpdateEventsTemplate(data);

            if (response.status == true) {
                initTemplates();
                setOpenNotif(true);
                setNotifStatus("success");
            } else {
                setOpenNotif(true);
                setNotifStatus("error");
            }
            setNotifText(response.message);
        } else {
            alert("Please resolve the input issues.");
        }
    }

    const deleteTemplate = async () => {
        const response = await MarEventsTemplate.DeleteEventsTemplate({
            "id": ewiID
        });
        if (response.status === true) {
            initTemplates();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted a message message_template.");
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to delete message message_template. Please check your network connectivity.");
        }
    }

    const resetStates = () => {
        setEwiId('');
        setTemplateName('');
        setTemplateMessage('');
        setModifiedBy('');
    }

    const checkIfExistingTag = (template_name) => {
        let obj = templates.find(o => o.template_name.toLowerCase() === template_name.toLowerCase());
        if (obj != undefined || obj != null) {
            setTagHelperText('Duplicate early warning information template_name');
        } else {
            setTagHelperText('');
        }
    }

    const checkTemplateValidity = (message_template) => {
        if (message_template.trim() == '') {
            setTemplateHelperText('Template message is required');
        } else {
            setTemplateHelperText('');
        }
    }

    const changeFieldValues = (template_tag, templates_container) => {
        let obj = templates_container.find(o => o.template_name === template_tag);
        let {id, template_name, message_template, ts_modified, user_id} = obj;
        if (id == 0) {
            setNewTemplate(true)
            setIsNew(true);
        } else {
            setNewTemplate(false)
            setIsNew(false);
        }
        setEwiId(id);
        setTemplateName(template_name);
        setTemplateMessage(message_template);
        setModifiedBy(user_id);
    }

    const handleChange = key_template => event => {
        resetStates();
        setKey(event.target.value);
        changeFieldValues(event.target.value, templates)
    };

    return (
        <Fragment>
            <Container align="center">
                <Grid container>
                    <Grid item xs={12} className={classes.header}>
                        <Typography variant="h4">
                            Events | Message Template creator
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <TextField
                            id="ewi_template_id"
                            select
                            label="Message Template"
                            className={classes.textField}
                            value={template_key}
                            onChange={handleChange('template_key')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="E.g. Ground Measurement Reminder"
                        >
                        {templates.map(option => (
                            <MenuItem key={option.template_name} value={option.template_name}>
                                {option.template_name}
                            </MenuItem>
                        ))}
                        </TextField>
                        <Grid item xs={4} />
                        <Grid item xs={12}>
                            {newTemplate ? 
                                <Grid container align="center" spacing={4} style={{paddingBottom: 10, paddingTop: 10}}>
                                    <Grid item xs={12}>
                                        <TextField
                                            error={tagHelperText.length == 0 ? false : true}
                                            label="New Message Template Name"
                                            onChange={(event)=> { setTemplateName(event.target.value);}}
                                            onBlur={(event)=> {checkIfExistingTag(event.target.value)}}
                                            fullWidth
                                            helperText={tagHelperText}
                                        />
                                    </Grid>
                                </Grid>
                                :
                                <div></div>
                            }
                            <Grid container align="center">
                                <Grid item xs={12}>
                                    <TextField
                                        error={templateHelperText.length == 0 ? false : true}
                                        label="Template"
                                        multiline={true}
                                        onChange={(event)=> { setTemplateMessage(event.target.value) }}
                                        onBlur={(event)=> {checkTemplateValidity(event.target.value)}}
                                        rows={5}
                                        fullWidth
                                        rowsMax={10}
                                        value={message_template}
                                        helperText={templateHelperText}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} style={{marginTop: '10%'}}>
                                    
                                        {isNew ? 
                                            <Grid container spacing={2}>
                                                <Grid item xs={3} />
                                                <Grid item xs={3}>
                                                    <Fab variant="extended"
                                                        color={"primary"}
                                                        aria-label="add"
                                                        className={classes.menu}
                                                        onClick={()=>{modifyTemplate()}}>
                                                        { isNew ? "Add" : "Save"}
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Fab variant="extended"
                                                        color={"primary"}
                                                        aria-label="add"
                                                        className={classes.menu}
                                                        onClick={()=>{initTemplates()}}>
                                                        Reset
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={3} />
                                            </Grid>
                                        :
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <Fab variant="extended"
                                                        color={"primary"}
                                                        aria-label="add"
                                                        className={classes.menu}
                                                        onClick={()=>{modifyTemplate()}}>
                                                        { isNew ? "Add" : "Save" }
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Fab variant="extended"
                                                        color={"primary"}
                                                        aria-label="add"
                                                        className={classes.menu}
                                                        onClick={()=>{setDialogText('Are you sure you want to delete this Early Warning Information Template?'); setDialogCommand('delete'); handleClickOpen()}}>
                                                        Delete
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Fab variant="extended"
                                                        color={"primary"}
                                                        aria-label="add"
                                                        className={classes.menu}
                                                        onClick={()=>{initTemplates()}}>
                                                        Reset
                                                    </Fab>
                                                </Grid>
                                            </Grid>
                                        }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Events | Template Creator</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {dialogText}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {dialogConfirm()}} color="primary">
                    Confirm
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openNotif} 
				autoHideDuration={3000} 
				onClose={() => {setOpenNotif(false)}}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				key={'top,right'}>
				<Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
					{notifText}
				</Alert>
			</Snackbar>
        </Fragment>
    )
}

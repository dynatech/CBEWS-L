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
    const [tag, setTag] = useState('');
    const [templateMessage, setTemplateMessage] = useState('');
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
        'ewi_id': 0,
        'tag': '----NEW TEMPLATE----',
        'template': '',
        'ts_modified': '',
        'modified_by': ''
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
        console.log("response", response);
        if (response.status === true) {
            response.data.forEach(element => {
                template_container.push({
                    "ewi_id": element[0],
                    "tag": element[1],
                    "template": element[2],
                    "ts_modified": element[3],
                    "modified_by": element[4]
                })
            });
            template_container.push(newTagOption);
            setKey(template_container[0].tag);
            setTemplates(template_container);
            changeFieldValues(template_container[0].tag, template_container);
        } else console.error("Problem in init template");
    }

    const modifyTemplate = () => {
        let req_url = '';
        let method = '';
        let success_message = '';
        let fail_message = '';

        if (isNew == true) {
            req_url = `${AppConfig.HOSTNAME}/api/events/template/add`;
            method = 'POST';
            success_message = 'Successfully added new message template';
            fail_message = 'Failed to add message template. Please check your network connectivity.'
        } else {
            req_url = `${AppConfig.HOSTNAME}/api/events/template/update`;   
            method = 'PATCH';
            success_message = 'Successfully update message template';
            fail_message = 'Failed to update message template. Please check your network connectivity.'
        }

        if (tagHelperText.length == 0 && templateHelperText.length == 0) {
            // Leave modified_by: 1 for testing 
            fetch(req_url, {
                method: method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "ewi_id": ewiID,
                    "tag": tag,
                    "template": templateMessage,
                    "modified_by": 1
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == true) {
                        initTemplates();
                        setOpenNotif(true);
                        setNotifStatus("success");
                        setNotifText(success_message);
                    } else {
                        setOpenNotif(true);
                        setNotifStatus("error");
                        setNotifText(fail_message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                }
            );
        } else {
            alert("Please resolve the input issues.");
        }
    }

    const deleteTemplate = async () => {
        const response = await MarEventsTemplate.DeleteEventsTemplate({
            "ewi_id": ewiID
        });
        if (response.status === true) {
            initTemplates();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted a message template.");
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to delete message template. Please check your network connectivity.");
        }
    }

    const resetStates = () => {
        setEwiId('');
        setTag('');
        setTemplateMessage('');
        setModifiedBy('');
    }

    const checkIfExistingTag = (tag) => {
        let obj = templates.find(o => o.tag.toLowerCase() === tag.toLowerCase());
        if (obj != undefined || obj != null) {
            setTagHelperText('Duplicate early warning information tag');
        } else {
            setTagHelperText('');
        }
    }

    const checkTemplateValidity = (template) => {
        if (template.trim() == '') {
            setTemplateHelperText('Template message is required');
        } else {
            setTemplateHelperText('');
        }
    }

    const changeFieldValues = (template_tag, templates_container) => {
        let obj = templates_container.find(o => o.tag === template_tag);
        console.log(obj);
        let {ewi_id, tag, template, ts_modified, modified_by} = obj;
        console.log(ewi_id);
        if (ewi_id == 0) {
            setNewTemplate(true)
            setIsNew(true);
        } else {
            setNewTemplate(false)
            setIsNew(false);
        }
        setEwiId(ewi_id)
        setTag(tag)
        setTemplateMessage(template)
        setModifiedBy(modified_by)
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
                            Events | Message template creator
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
                            <MenuItem key={option.tag} value={option.tag}>
                                {option.tag}
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
                                            label="New template tag"
                                            onChange={(event)=> { setTag(event.target.value);}}
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
                                        value={templateMessage}
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

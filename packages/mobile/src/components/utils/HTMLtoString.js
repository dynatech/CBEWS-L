import React, { useState, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import letter_header from '../../assets/letter_header.png';
import letter_footer from '../../assets/letter_footer.png';

const thStyle = {
    wordWrap: "break-word",
};

const tableStyle = {
    width: "70%",
};

const HTMLtoString = (data_type, data) => {
    let html_string = [];
    let return_body = [];
    if (data.length > 0) {
        switch(data_type) {
            case "umi_situation_report":
                const sit_rep = data[0];
                return_body = (
                    <div style={{width: "100%", borderSpacing: "5px", marginLeft: "10%"}}>
                        <h3>Umingan Situation Report</h3>
                        <table id='umi_situation_report_table' border={0} style={tableStyle}>
                            <tr>
                                <td width={300} style={thStyle}>Date:</td>
                            </tr>
                            <tr>
                                <td width={300} style={thStyle}>{sit_rep.report_ts}</td>
                            </tr>
                            <br />
                            <tr>
                                <td width={300} style={thStyle}>Summary:</td>
                            </tr>
                            <tr>
                                <td width={300} style={thStyle}>{sit_rep.report_summary}</td>
                            </tr>
                        </table>
                    </div> 
                );
                break;
            case "umi_situation_report_list":
                return_body = (
                    <div>
                        <h3>Umingan Situation Report</h3>
                        <table id='umi_situation_report_list_table' border={1}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={1000} style={thStyle}>Summary</th>
                            </tr>
                            {
                                data.map((row, i) => (
                                    <tr key={i}>
                                        <td width={300} style={thStyle}>{row.report_ts}</td>
                                        <td width={1000} style={thStyle}>{row.report_summary}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "umi_field_survey":
                const survey_rep = data[0];
                console.log("survey_rep", survey_rep);
                return_body = (
                    <div>
                        <h3>Umingan Field Survey</h3>
                        <table id='umi_field_survey_table' style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
                            <tr>
                                <td width={400} style={thStyle}><strong>Date:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.report_date}</td>
                            </tr>
                            <tr>
                                <td width={400} style={thStyle}><strong>Features:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.feature}</td>
                            </tr>
                            <tr>
                                <td width={400} style={thStyle}><strong>Materials Characterization:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.materials_characterization}</td>
                            </tr>
                            <tr>
                                <td width={400} style={thStyle}><strong>Mechanism:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.mechanism}</td>
                            </tr>
                            <tr>
                                <td width={400} style={thStyle}><strong>Exposure:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.exposure}</td>
                            </tr>
                            <tr>
                                <td width={400} style={thStyle}><strong>Report Narrative:</strong></td>
                                <td width={700} style={thStyle}>{survey_rep.report_narrative}</td>
                            </tr>
                        </table>
                    </div>
                );
                break;
            case "umi_field_survey_list":
                return_body = (
                    <div>
                        <h3>Umingan Field Survey Report</h3>
                        <table id='umi_field_survey_list_table' border={1} style={{width: "30%"}}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={300} style={thStyle}>Features</th>
                                <th width={300} style={thStyle}>Materials Characterization</th>
                                <th width={300} style={thStyle}>Mechanism</th>
                                <th width={300} style={thStyle}>Exposure</th>
                                <th width={300} style={thStyle}>Report Narrative</th>
                            </tr>
                            {
                                data.map((row, i) => (
                                    <tr key={i}>
                                        <td width={300} style={tdStyle}>{row.report_date}</td>
                                        <td width={300} style={tdStyle}>{row.feature}</td>
                                        <td width={300} style={tdStyle}>{row.materials_characterization}</td>
                                        <td width={300} style={tdStyle}>{row.mechanism}</td>
                                        <td width={300} style={tdStyle}>{row.exposure}</td>
                                        <td width={300} style={tdStyle}>{row.report_narrative}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "umi_maintenance_report":
                const sensor_main = data[0];
                return_body = (
                    <div>
                        <h3>Umingan Maintenance Report</h3>
                        <table id='umi_maintenance_report_table' border={1} style={{width: "100%"}}>
                            <tr>
                                <th width={220} style={thStyle}>Date</th>
                                <th width={330} style={thStyle}>Features</th>
                                <th width={350} style={thStyle}>Materials Characterization</th>
                                <th width={125} style={thStyle}>Mechanism</th>
                                <th width={125} style={thStyle}>Exposure</th>
                            </tr>
                            {
                                data.map((row, i) => (
                                    <tr key={i}>
                                        <td width={220} style={tdStyle}>{row.timestamp}</td>
                                        <td width={330} style={tdStyle}>{row.remarks}</td>
                                        <td width={350} style={tdStyle}>{row.rain_gauge_status}</td>
                                        <td width={125} style={tdStyle}>{row.working_nodes}</td>
                                        <td width={125} style={tdStyle}>{row.anomalous_nodes}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "mar_incident_report":
                return_body = (
                    <div>
                        <h3>Mar Incident Report</h3>
                        <table id='mar_incident_report_table' border={1}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={200} style={thStyle}>Report Narrative</th>
                                <th width={200} style={thStyle}>Reporter</th>
                            </tr>
                            {
                                data.map((row, i) => (
                                    <tr key={i}>
                                        <td width={300} style={tdStyle}>{row.incident_date}</td>
                                        <td width={200} style={tdStyle}>{row.incident_report_narrative}</td>
                                        <td width={200} style={tdStyle}>{row.reporter}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "mar_maintenance_report":
                return_body = (
                    <div>
                        <h3>Mar Maintenance Report</h3>
                        <table id='mar_maintenance_report_table' border={1} style={{width: "100%"}}>
                            <tr>
                                <th width={150} style={thStyle}>Date</th>
                                <th width={350} style={thStyle}>Type</th>
                                <th width={350} style={thStyle}>Remarks</th>
                                <th width={125} style={thStyle}>In-Charge</th>
                                <th width={125} style={thStyle}>Updater</th>
                            </tr>
                            {
                                data.map((row, i) => (
                                    <tr key={i}>
                                        <td width={150} style={tdStyle}>{row.maintenance_date}</td>
                                        <td width={350} style={tdStyle}>{row.type}</td>
                                        <td width={350} style={tdStyle}>{row.remarks}</td>
                                        <td width={125} style={tdStyle}>{row.in_charge}</td>
                                        <td width={125} style={tdStyle}>{row.updater}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            default:
                return_body = (<span>No data</span>);
        }
    } else return_body = (<span>No data</span>);

    html_string = (
        <div>
        <header>
            <img src={letter_header.png} alt="header" />
        </header>
            {return_body}
        <footer>
            <img src={letter_footer.png} alt="footer" />
        </footer>
        </div>
    );

    html_string = renderToString(html_string);
    return html_string;
}

export default HTMLtoString;